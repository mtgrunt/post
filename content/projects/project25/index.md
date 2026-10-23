---
title: "A Home SOC Lab: Detection Engineering Against Six Real Attack Techniques with Wazuh"
date: 2026-10-23
draft: false
description: "A home Security Operations Center built around Wazuh, Sysmon and a Kali attacker VM, where every detection rule was validated against a real, executed attack technique rather than trusted on paper. Six MITRE ATT&CK scenarios, eleven custom rules and the specific ways the default rules missed."
tags: ["Wazuh", "SIEM", "Sysmon", "Detection Engineering", "MITRE ATT&CK", "Home Lab", "Blue Team", "LSASS", "PowerShell Logging", ]
categories: ["Security", "Networking"]
---
Installing a SIEM and running one that actually detects things are two different projects. The gap between them is where most home lab writeups stop short. A Wazuh deployment out of the box ships with a broad set of default rules, but default rules are written against generic telemetry assumptions that don't always match what a specific environment actually logs, in what format and on which field. The only way to know whether a detection stack works is to attack it on purpose and check, which is exactly what this lab does: six MITRE ATT&CK techniques executed from a dedicated attacker VM, each one checked against both the default Wazuh ruleset and a set of custom rules written specifically because the defaults fell short.

The lab runs three machines on purposefully separated networks. A Windows 11 endpoint carries Sysmon (a customized build of the SwiftOnSecurity configuration) and the Wazuh agent, sitting on its own UniFi VLAN. A Ubuntu server runs Wazuh's manager, indexer and dashboard as an all-in-one install on a separate server VLAN, reachable from the endpoint only over TCP 1514 and 1515 under a single zone-based firewall policy that opens nothing else beyond SSH and the dashboard's HTTPS port. The attacker is a Kali Linux VM running Hydra and a set of proof-of-concept scripts, but it sits on a host-only 192.168.56.0/24 network entirely inside the Windows host, so none of the simulated attack traffic ever actually touches the real LAN. That isolation is what makes repeatedly running brute-force and credential-dumping attempts against a real Windows box a reasonable thing to do on a home network in the first place.

Two of the six scenarios expose the same underlying lesson from different angles: a default rule can be technically present and still never fire, because it's watching a field the data doesn't populate. The RDP brute-force scenario is the clearest case. Wazuh's stock brute-force correlation keys off `srcip`, but Windows logon event data doesn't populate that field, it puts the originating address in `win.eventdata.ipAddress` instead, so the built-in rule silently never matches regardless of how many failed logons arrive. The fix was two correlated custom rules: one that fires on four failed logons (event 4625, Wazuh's 60122) from the same `win.eventdata.ipAddress` within 120 seconds and a second, higher-severity rule that correlates a subsequent successful logon (4624, 92657) from that same address within a 300-second window, which is the difference between "someone failed to log in a few times" and "someone just got in after failing to log in a few times."

```xml
<rule id="100230" level="10">
  <if_matched_sid>60122</if_matched_sid>
  <same_field>win.eventdata.ipAddress</same_field>
  <frequency>4</frequency>
  <timeframe>120</timeframe>
  <description>Possible RDP brute force: repeated failed logons from one source</description>
  <mitre><id>T1110.001</id></mitre>
</rule>

<rule id="100231" level="12">
  <if_matched_sid>92657</if_matched_sid>
  <same_field>win.eventdata.ipAddress</same_field>
  <if_matched_sid>100230</if_matched_sid>
  <timeframe>300</timeframe>
  <description>Successful logon from a source with recent brute-force failures</description>
  <mitre><id>T1110.001</id><id>T1078</id></mitre>
</rule>
```

The LSASS credential-access scenario hits the same category of problem from the telemetry side rather than the rule-logic side. The straightforward dump attempt was blocked outright by LSA Protection (RunAsPPL), which sounds like a win until you notice it means the expected Sysmon Event 10 process-access record never got generated either, because the access attempt that would trigger it is exactly what got blocked. The SwiftOnSecurity Sysmon config disables ProcessAccess monitoring for `lsass.exe` by default, specifically because it's noisy, so the sensor that should have shown the attempt wasn't even collecting the right event in the first place. Turning that monitoring back on for `lsass.exe` specifically, then layering two custom rules, one matching classic dump-tool access masks (`0x1010`, `0x1038`, `0x1410`, `0x1fffff` among them) and one matching when the accessing process is a script interpreter or LOLBin like `powershell`, `wmic`, `rundll32` or `reg`, shifted detection from "catch the completed dump" to "catch the attempt," which turned out to be the only thing actually observable once prevention did its job.

The encoded-PowerShell scenario produced the lab's one real false positive. The fix is a small, specific lesson in allow-listing instead of a blunt suppression. The detection rule itself matches a Sysmon Event 1 for `powershell.exe` or `pwsh.exe` carrying an encoded-command flag (`-e`, `-ec`, `-enc` or `/enc`) followed by a Base64 blob of at least 20 characters, which is a reasonable general signature for obfuscated PowerShell. It also reliably fired on the lab owner's own AI coding assistant, since the Claude Code VS Code extension's native binary legitimately launches PowerShell with encoded arguments as part of normal operation. Rather than loosening the detection rule itself, the fix is a child rule at level 0 that suppresses only when the parent process matches the extension's specific, pinned install path, which keeps the original rule's sensitivity intact for anything that isn't that one known-benign binary.

Two smaller scenarios round the set out on the data-integrity side. The scheduled-task persistence rule had to account for the fact that Wazuh stores some fields HTML-encoded, so a rule matching a literal `>` character in a task's command line simply never matched until the rule accounted for the encoded form of that character showing up in the stored event instead of the raw one. A second rule in that same scenario narrows further, flagging a PowerShell or `pwsh` process spawned specifically from `svchost.exe -k netsvcs` with a hidden-window flag, which is a plausible shape for a scheduled task dressed up to look like ordinary service activity. The log-clearing scenario is more straightforward by comparison, just three rules escalating what would otherwise be a low default severity: the built-in Event 1102 (security log cleared), a `wevtutil.exe` invocation using `cl` or `clear-log` and a PowerShell equivalent using `Clear-EventLog`, `Remove-EventLog` or a `.ClearLog(` call, since all three accomplish the same anti-forensic goal through different tooling.

What ties all six scenarios together is that none of the real problems were exotic. A field name that doesn't match what Windows actually logs, an encoding mismatch between what's stored and what a rule expects to match, a Sysmon event class that's silently disabled in the base config, a legitimate tool producing the same signature as a malicious one: these are the ordinary failure modes of detection engineering. Every one of them stays invisible until a rule gets run against real, executed attacker behavior instead of read on paper and trusted. The lab's actual output isn't the six detections, it's eleven rules that were proven to fire against the techniques they claim to catch, validated with `wazuh-analysisd -t` and checked against the data as Wazuh actually stores it rather than how the rule author assumed it would look.

Repository: [github.com/mtgrunt/Home-SOC-Lab](https://github.com/mtgrunt/Home-SOC-Lab)
