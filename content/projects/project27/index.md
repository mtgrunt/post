---
title: "Giving a Cisco Switch a Memory: NTP and Remote Syslog Across Firewalled VLANs"
date: 2026-11-11
draft: true
description: "A switch with no clock battery and no remote logging can't tell you what happened or when. Fixing both on a Cisco 2960-X in a segmented UniFi network: an NTP source that never answered, a clock stuck in 1974, a filtered rsyslog receiver and one narrow firewall policy."
tags: ["Cisco", "IOS", "NTP", "Syslog", "rsyslog", "UniFi", "Zone-Based Firewall", "Logging", "Home Lab", "Blue Team"]
categories: ["Networking", "Security"]
---
The [previous lab](/projects/project26/) left a used Catalyst 2960-X managed over SSH on its own VLAN, but with two gaps that matter more to a defender than to a network engineer. The switch had no idea what time it was, and everything it logged stayed on the switch. A log with the wrong timestamp can't be lined up against anything else and a log that only exists on the device can be cleared by whoever gets onto that device. This lab fixed both, in that order, because remote logs are only useful once their timestamps are right.

The 2960-X has no battery-backed clock, so every power cycle starts from an arbitrary date. After setting the time zone, `show clock` reported a time in June 1974. The time zone and timestamp settings came first, so every log line would carry a real date, milliseconds and the zone it was written in:

```
clock timezone PST -8 0
clock summer-time PDT recurring
service timestamps log datetime msec localtime show-timezone
service timestamps debug datetime msec localtime show-timezone
```

The obvious time source was the gateway, since it's already the management VLAN's default route and the switch could ping it. `ntp server` pointed at the gateway, and `show ntp associations` sat at `.INIT.` with a reach of 0 through several poll intervals. Reach is an 8-bit shift register of the last eight polls shown in octal, so 0 means not a single reply ever came back, which isn't the same thing as a slow sync. The gateway routes traffic fine, but it doesn't answer NTP queries from clients. The clock was set by hand first, so NTP wouldn't have to correct a 52-year offset, then the gateway was swapped for two of Google's public stratum-1 servers. The management VLAN already reaches the internet through the default zone policy, so no firewall change was needed.

```
LAB-SW1# show ntp associations
  address         ref clock       st   when   poll reach  delay  offset   disp
+~216.239.35.0    .GOOG.           1     23     64     3 16.860   5.180  0.457
*~216.239.35.4    .GOOG.           1     25     64     3 18.747   4.892 3937.7
```

Within two polls both servers showed a reach of 3 (the last two polls answered), one marked `*` as the system peer and the other `+` as a candidate, and the offset was about 5 milliseconds. Two sources rather than one means NTP has something to compare against, and the clock keeps a reference if one server drops out.

The log receiver was an Ubuntu server that already runs rsyslog for its own logs. The goal was to accept the switch's logs without turning the server into an open syslog sink for the whole network, so the UDP listener is bound to its own ruleset. Anything arriving on 514 is written to a dedicated file only if it came from the switch's management address, and the `stop` drops everything else before it can reach the server's normal log files.

```
module(load="imudp")
input(type="imudp" port="514" ruleset="remote")
ruleset(name="remote") {
  if $fromhost-ip == "<switch-ip>" then {
    action(type="omfile" file="/var/log/cisco/lab-sw1.log")
  }
  stop
}
```

`rsyslogd -N1` validated the config before the restart and `ss -ulnp` confirmed the listener on port 514 for both IPv4 and IPv6. Between the two VLANs, a single Firewall policy in UniFi's Policy Table allows the switch's address to reach the server's address on UDP 514 only. That matches the lab's existing pattern: the workstation can reach the switch on TCP 22 and nothing else, and now the switch can reach the log server on UDP 514 and nothing else.

```
logging host <log-server-ip>
logging trap informational
logging source-interface Vlan99
```

On the switch, `logging trap informational` sends severities 0 through 6 and skips debug. `logging source-interface Vlan99` pins the source address to the management interface. That matters on any multi-interface device: the firewall policy and the rsyslog filter both match one specific address, and a log sourced from a different interface would be silently dropped by both. `send log 6` generated a test message, and three lines arrived on the server within a second:

```
%SYS-5-CONFIG_I: Configured from console by admin on vty0 (<workstation-ip>)
%SYS-6-USERLOG_INFO: Message from tty1(user id: admin): Syslog test from LAB-SW1
%SYS-6-LOGGINGHOST_STARTSTOP: Logging to host <log-server-ip> port 514 started - CLI initiated
```

The first line is the one a SOC analyst cares about. It records that the configuration changed, which account made the change, that it came in over a vty (SSH, not the console port) and the address it came from, all stamped with a synchronized time. That record now lives on a separate machine, so someone who gets onto the switch and clears its local buffer can't erase the copy. The test message also showed that the test itself doesn't appear in an SSH session by default. A vty only displays log messages after `terminal monitor`, which is easy to mistake for logging not working.

The lesson from this lab is about order and evidence. NTP had to work before syslog was worth anything. The NTP failure was only diagnosable because the reach column says exactly how many replies arrived, not just whether the clock is synced. On the logging side, three independent filters (the switch's source interface, the firewall policy and the rsyslog `$fromhost-ip` check) all have to agree on one address, and lining them up deliberately is what keeps the receiver narrow. Next on this switch: logging the actual commands typed with `archive log config`, rate-limiting failed logins and eventually forwarding this file into the [Wazuh SIEM](/projects/project25/) so switch events sit beside endpoint alerts.
