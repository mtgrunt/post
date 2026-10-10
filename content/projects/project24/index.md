---
title: "Writing a DNS Resolver From Scratch in Rust"
date: 2026-10-10
draft: false
description: "Building a DNS resolver in Rust using nothing but UDP sockets and hand-rolled byte parsing: the wire format, name compression pointers, iterative resolution against root and TLD servers and the TCP fallback the protocol still depends on."
tags: ["Rust", "DNS", "Networking", "UDP", "Protocol Design", "Sockets", "Name Resolution", ]
categories: ["Rust", "Networking"]
---
Every program that calls a DNS resolution function is trusting a black box: hand it a name, get back an address, no visibility into what happened between those two calls. Building a resolver from scratch means giving up that convenience on purpose, because the only way to see the protocol is to construct the query bytes by hand, send them over a raw UDP socket and parse whatever comes back one byte at a time. There is no DNS crate involved here, just `std::net::UdpSocket` and the wire format itself.

A DNS message starts with a fixed 12-byte header: a 16-bit transaction ID the client picks and the server echoes back, a 16-bit flags field packed with the query/response bit, opcode, recursion-desired bit and a handful of others, then four 16-bit counts for how many entries follow in the question, answer, authority and additional sections. Everything after that header is just those sections back to back, with no delimiters beyond the counts already given.

```rust
struct DnsHeader {
    id: u16,
    flags: u16,
    qdcount: u16,
    ancount: u16,
    nscount: u16,
    arcount: u16,
}

impl DnsHeader {
    fn to_bytes(&self) -> [u8; 12] {
        let mut buf = [0u8; 12];
        buf[0..2].copy_from_slice(&self.id.to_be_bytes());
        buf[2..4].copy_from_slice(&self.flags.to_be_bytes());
        buf[4..6].copy_from_slice(&self.qdcount.to_be_bytes());
        buf[6..8].copy_from_slice(&self.ancount.to_be_bytes());
        buf[8..10].copy_from_slice(&self.nscount.to_be_bytes());
        buf[10..12].copy_from_slice(&self.arcount.to_be_bytes());
        buf
    }
}
```

A query carries one question: the name being looked up, encoded not as a plain string but as a sequence of length-prefixed labels, each label up to 63 bytes, terminated by a zero-length label marking the root. `example.com` becomes the byte `7`, the ASCII bytes for "example", the byte `3`, the ASCII bytes for "com", then a trailing zero. That encoding is what lets a resolver walk a name one label at a time without needing to scan for a separator character.

```rust
fn encode_name(name: &str) -> Vec<u8> {
    let mut out = Vec::new();
    for label in name.split('.') {
        out.push(label.len() as u8);
        out.extend_from_slice(label.as_bytes());
    }
    out.push(0);
    out
}

fn build_query(id: u16, name: &str) -> Vec<u8> {
    let header = DnsHeader {
        id,
        flags: 0x0100, // recursion desired
        qdcount: 1,
        ancount: 0,
        nscount: 0,
        arcount: 0,
    };
    let mut packet = header.to_bytes().to_vec();
    packet.extend(encode_name(name));
    packet.extend_from_slice(&1u16.to_be_bytes()); // QTYPE: A
    packet.extend_from_slice(&1u16.to_be_bytes()); // QCLASS: IN
    packet
}
```

Sending that packet is the easy part, a single UDP datagram to port 53 with a receive timeout, since DNS over UDP has no connection state to establish:

```rust
use std::net::UdpSocket;
use std::time::Duration;

fn query(server: &str, packet: &[u8]) -> std::io::Result<Vec<u8>> {
    let socket = UdpSocket::bind("0.0.0.0:0")?;
    socket.set_read_timeout(Some(Duration::from_secs(2)))?;
    socket.send_to(packet, (server, 53))?;
    let mut buf = [0u8; 512];
    let (n, _) = socket.recv_from(&mut buf)?;
    Ok(buf[..n].to_vec())
}
```

Parsing the response is where the format stops being straightforward, because of a single trick: name compression. Rather than repeating a domain name in full every time it shows up, a DNS message can replace any suffix of a name with a two-byte pointer back to where that suffix already appears earlier in the packet, signaled by the top two bits of a length byte both being set. An answer for `example.com` after a question section that already spelled it out in full typically just contains a pointer to offset 12, where the question's name starts, rather than repeating all nine bytes. Decoding a name correctly means checking every label-length byte for that `0xC0` mask and, on finding it, jumping to the pointed-to offset to keep reading, then returning to where parsing left off.

```rust
fn read_name(packet: &[u8], mut pos: usize) -> (String, usize) {
    let mut labels = Vec::new();
    let start_pos = pos;
    let mut jumped = false;
    let mut next_pos = pos;

    loop {
        let len = packet[pos] as usize;
        if len & 0xC0 == 0xC0 {
            let pointer = (((packet[pos] as usize) & 0x3F) << 8) | packet[pos + 1] as usize;
            if !jumped {
                next_pos = pos + 2;
                jumped = true;
            }
            pos = pointer;
            continue;
        }
        if len == 0 {
            pos += 1;
            break;
        }
        labels.push(String::from_utf8_lossy(&packet[pos + 1..pos + 1 + len]).to_string());
        pos += 1 + len;
    }

    let end_pos = if jumped { next_pos } else { pos };
    let _ = start_pos;
    (labels.join("."), end_pos)
}
```

With names decodable, walking an answer record just means reading the compressed name, then a fixed 10-byte block (type, class, TTL, data length) followed by that many bytes of record data, which for an A record is simply four raw bytes read as an IPv4 address.

```rust
fn parse_a_record(packet: &[u8], pos: usize) -> (String, u32, std::net::Ipv4Addr, usize) {
    let (name, pos) = read_name(packet, pos);
    let rtype = u16::from_be_bytes([packet[pos], packet[pos + 1]]);
    let ttl = u32::from_be_bytes(packet[pos + 4..pos + 8].try_into().unwrap());
    let rdlength = u16::from_be_bytes([packet[pos + 8], packet[pos + 9]]) as usize;
    let data_start = pos + 10;
    let addr = std::net::Ipv4Addr::new(
        packet[data_start], packet[data_start + 1],
        packet[data_start + 2], packet[data_start + 3],
    );
    let _ = rtype;
    (name, ttl, addr, data_start + rdlength)
}
```

Asking a single recursive resolver like `8.8.8.8` to do the work, which is what `0x0100` in the query flags requests, skips the most interesting part of the system: how that resolver itself finds an answer it doesn't already have cached. The alternative is iterative resolution, the same process `dig +trace` shows, which means starting at one of the thirteen root server addresses, asking for the name directly and reading the authority section of the response rather than the answer section. A root server never answers a query for `example.com` directly; it replies with a referral, a list of the TLD nameservers responsible for `.com`, as NS records with no recursion-desired flag set in the original query. The resolver repeats the same query against one of those servers, gets referred again to `example.com`'s actual authoritative nameservers and only then receives an answer section with real A records in it.

```rust
fn resolve_iterative(name: &str) -> std::io::Result<std::net::Ipv4Addr> {
    let mut server = "198.41.0.4".to_string(); // a.root-servers.net
    loop {
        let packet = build_query(0x1234, name);
        let response = query(&server, &packet)?;
        let header_flags = u16::from_be_bytes([response[2], response[3]]);
        let ancount = u16::from_be_bytes([response[6], response[7]]);

        if ancount > 0 {
            let (_, _, _, pos) = parse_a_record(&response, 12 + encode_name(name).len() + 4);
            let _ = pos;
            let (_, _, addr, _) = parse_a_record(&response, 12 + encode_name(name).len() + 4);
            return Ok(addr);
        }

        // No answer yet: pull the next server to try from the additional section's A records.
        let _ = header_flags;
        server = next_referral_address(&response)?;
    }
}
```

Every query so far assumes the response fits in a single 512-byte UDP datagram, which was the original DNS specification's hard limit and still shows up today as the `TC` (truncated) bit in a response's flags. A response too large to fit, common with DNSSEC signatures or a name carrying many records, sets that bit and expects the resolver to retry the exact same query over TCP instead, where a two-byte length prefix in front of the message replaces the implicit 512-byte ceiling. A resolver that only speaks UDP will silently return incomplete data on a truncated response rather than erroring, which is the kind of failure that's easy to miss until a specific domain starts behaving strangely.

What building this exposes is how much of DNS's actual complexity has nothing to do with looking up an address and everything to do with the delegation chain underneath it: a name resolves not because one server knows the answer but because a fixed set of root servers know who to ask next. That chain of referrals, compressed names and a UDP-with-TCP-fallback transport is the entire reason `example.com` reliably turns into an IP address without every server on the internet needing to know about every domain that exists.
