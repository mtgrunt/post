---
title: "A Used Cisco 2960-X in a UniFi Home Lab: Password Recovery, a Forgotten Config Archive and a Management VLAN"
date: 2026-11-10
draft: false
description: "Bringing a secondhand Cisco Catalyst 2960-X into a segmented UniFi network: verifying the hardware, recovering from a lockout with the MODE button, finding a previous owner's config archive that survived the reset, and managing the switch over SSH on its own VLAN behind a zone-based firewall."
tags: ["Cisco", "IOS", "VLAN", "802.1Q", "UniFi", "Zone-Based Firewall", "SSH", "Password Recovery", "Home Lab", "Network Segmentation"]
categories: ["Networking", "Security"]
---
A secondhand enterprise switch is one of the cheapest ways to get real Cisco IOS time at home, but "used" carries two problems that a new box doesn't: you don't know what the last owner left behind and you don't yet know how the hardware behaves when you lock yourself out of it. This lab took a Catalyst 2960-X (24 gigabit ports, LAN Base) bought on eBay and brought it into an existing UniFi network that already keeps every device on its own VLAN, with the goal of managing the switch over the network on a dedicated management VLAN, reachable by SSH from exactly one workstation and nothing else.

The first session was all console and no configuration. Over a USB-to-serial cable at 9600 baud, `show version` confirmed the image was a `UNIVERSALK9` build of IOS 15.0, and the K9 is the part that matters: it's the crypto image, so SSH is available without an upgrade. `show env all` reported the fan OK, the internal power supply good and the temperature at 32 °C, comfortably below the yellow threshold. `show vlan brief` and `show running-config` came back at factory defaults, with one thing worth changing immediately: both `ip http server` and `ip http secure-server` were on, so the switch was ready to serve a web admin page to anyone who could reach it.

The starter config itself taught the first lesson. The plan was to paste a block of lines with the hostname, an enable secret, a local admin user and password encryption, but several of the generated passwords contained a `?`. In IOS the question mark is the context-help key, and it's processed the moment it's typed or pasted, even mid-password, so the line got cut off and the switch printed help output instead. Regenerating the passwords without that character fixed the paste, but the save that followed left a configuration where the login didn't accept what was in the password manager. That's the moment a used switch has to prove it can be recovered.

```
switch: flash_init
switch: rename flash:config.text flash:config.old
switch: boot
Switch> enable
Switch# copy flash:config.old running-config
```

Password recovery on the 2960-X is the MODE button held during power-on until the SYST LED goes from green to amber and back to green, which drops into the `switch:` bootloader instead of IOS. The first two attempts booted normally because the button was released too early; the LED sequence is the only reliable signal. From the bootloader, renaming `config.text` makes IOS boot with no startup config and no passwords. Copying the renamed file back into the running config restores everything else, new passwords go on top and `write memory` makes it permanent. Recovery stays available because the config register reports password recovery as enabled; on a switch where `no service password-recovery` had been set, this path would end in a factory wipe instead.

Cleaning up after recovery turned up the most interesting finding of the whole lab. `dir flash:` showed the expected `config.old` (now holding stale password hashes, so it was deleted), but it also showed a `ConfigBackups` folder with an archived configuration from 2021. The seller had reset the switch before selling it, and the reset had cleared the startup config exactly as intended. It just never touched the IOS `archive` feature's own copies in flash. Anyone buying used network gear should run `dir flash:` before anything else, because "reset to factory defaults" and "erased" are not the same thing on Cisco hardware. The archive was deleted and the folder left empty.

On the UniFi side, the lab added two networks under the zone-based firewall. A LAB network on VLAN 30 went into the DMZ zone, so anything broken or experimental on it stays away from the rest of the house by default. A MGMT network on VLAN 99 went into the Internal zone, with its DHCP pool started above the low addresses so the switch could hold a static management address that DHCP would never hand out. One port on the UniFi gateway became the uplink: VLANs 30 and 99 tagged, no native VLAN. Every switch command was entered over the console before the Ethernet cable went in, so the switch never sat on the network half-configured.

```
vlan 30
 name LAB
vlan 99
 name MGMT
interface Vlan99
 ip address <mgmt-ip> 255.255.255.0
 no shutdown
ip default-gateway <mgmt-gateway>
!
interface GigabitEthernet1/0/1
 description Uplink to gateway
 switchport mode trunk
 switchport trunk allowed vlan 30,99
 switchport nonegotiate
!
ip domain-name lab.home
crypto key generate rsa modulus 2048
ip ssh version 2
no ip http server
no ip http secure-server
line vty 0 15
 login local
 transport input ssh
```

The trunk is deliberately narrow. `switchport trunk allowed vlan 30,99` means nothing else rides the link even if it's misconfigured somewhere else, and `switchport nonegotiate` turns off DTP so the port never tries to negotiate its own trunking. The switch still reports native VLAN 1 on the trunk, which looks like a mismatch with the gateway's "no native VLAN" setting, but VLAN 1 isn't in the allowed list, so no untagged traffic crosses the link either way. Before the cable went in, `show interfaces trunk` printed nothing and the Vlan99 interface sat at up/down, both normal. Once the cable went in, the trunk came up as 802.1Q with both VLANs forwarding, Vlan99 went up/up and a ping to the MGMT gateway returned 5 of 5. The first reply took about a second while the switch resolved the gateway with ARP, and the rest took about a millisecond.

The firewall check came next, and the first result was a failure, which was the point. From the workstation, a TCP test against port 22 on the switch failed and so did ping, because the workstation's VLAN and the MGMT VLAN don't talk unless a policy says so. A single Firewall policy in UniFi's Policy Table fixed exactly one thing: allow, from the workstation's address in the Internal zone, to the switch's address in the Internal zone, service SSH (TCP 22), IPv4 only. After saving, the same TCP test succeeded while ping stayed blocked, so the rule opened what it was supposed to and nothing else.

```
LAB-SW1# show users
    Line       User       Host(s)              Idle       Location
*  1 vty 0     admin      idle                 00:00:00 <workstation-ip>
```

`show users` is the proof that matters at the end. The session is on `vty 0`, not `con 0`, so the login came across the network through SSH rather than through the console cable. The switch is now managed only over its own VLAN, only by SSH version 2, only from one machine and with the web server off. The console cable goes back in the drawer as the recovery path, which this lab already proved works.

What carries over beyond this one switch is mostly about trust in defaults. A factory reset that leaves an archive in flash, a help key that silently eats part of a password, a native VLAN that looks wrong but doesn't matter because of the allowed list, a firewall that blocks by default until a narrow rule says otherwise: none of these were exotic, and each only showed up by checking the output instead of assuming it. Next on this switch: sending its syslog to the lab's log server, syncing its clock (it still believes it's January 1) and mirroring a port to a network sensor.

Featured image: ["Cisco small business SG300-28 28-port Gigabit Ethernet rackmount switch"](https://commons.wikimedia.org/wiki/File:Cisco_small_business_SG300-28_28-port_Gigabit_Ethernet_rackmount_switch.jpg) by Dsimic, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0), cropped from the original.
