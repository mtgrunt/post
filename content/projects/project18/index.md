---
title: "OSIRIS: A GPU-Accelerated OSINT Dashboard for Live Global Intelligence"
date: 2026-06-30
draft: false
description: "Building a real-time OSINT dashboard that aggregates flight tracking, CCTV networks, seismic activity, conflict zones, crypto wallet tracing and 24/7 news feeds into a single WebGL-rendered map, with a RECON toolkit for port scanning, WHOIS, DNS and OFAC sanctions cross-checking."
tags: ["Next.js", "TypeScript", "MapLibre", "OSINT", "WebGL", "Reconnaissance", "Real-Time Data", "Threat Intelligence", ]
categories: ["Next.js", "TypeScript", "MapLibre", "OSINT", "WebGL", "Reconnaissance", "Real-Time Data", "Threat Intelligence", ]
---
OSIRIS, short for Open Source Intelligence & Reconnaissance Integrated System, aggregates flight tracking, CCTV feeds, earthquake and fire monitoring, conflict zone mapping, crypto wallet tracing and 24/7 news broadcasts into one map. This build is a fork of an original project by simplifaisoul, pitched there as an open-source "Palantir Alternative," and the fork keeps that framing: a single-pane intelligence tool assembled from public APIs and keyless data sources wherever one exists, rather than a proprietary platform sold at enterprise rates. The hard part is not fetching any single feed. It is holding a dozen live data domains, each with its own refresh cadence, coordinate system and entity volume, in a single viewport without the frame rate collapsing once thousands of markers are on screen at once. Every entity is rendered through MapLibre GL's WebGL pipeline rather than the DOM, which is the decision that keeps the map interactive at 60fps even when flights, cameras and news markers are all rendering simultaneously.

The API layer is a set of Next.js routes, one per intelligence domain, sitting between the client and a wide range of external sources: OpenSky for aircraft, USGS for earthquakes, NASA FIRMS for active fires, NOAA and N2YO for space weather and satellites and a cluster of `/api/osint/*` routes for WHOIS, DNS, CVE lookups, crypto tracing and sanctions search. Splitting the domains into separate routes instead of one combined endpoint pays off directly in the client: a `layerFetchedRef` guard means a layer's data is only requested once it is actually toggled on, and a viewport-aware fetch means a globally distributed dataset like CCTV cameras only pulls the cameras visible in the current view rather than every camera in every city at once.

```
┌───────────────────────────────────────────────────┐
│                   OSIRIS CLIENT                   │
│  MapLibre GL (WebGL)   HUD Panels   RECON Toolkit │
├───────────────────────────────────────────────────┤
│                NEXT.JS API ROUTES                 │
│  /api/flights   /api/earthquakes   /api/cctv      │
│  /api/news      /api/fires         /api/maritime  │
│  /api/osint/*  (whois, dns, ip, cve, sanctions,   │
│                 crypto, sweep, threats, …)        │
├───────────────────────────────────────────────────┤
│               EXTERNAL DATA SOURCES               │
│  OpenSky · USGS · NASA · NOAA · TfL · NVD         │
│  blockstream.info · Blockscout · OpenSanctions    │
└───────────────────────────────────────────────────┘
```

The RECON toolkit is where the project moves from a passive map into something closer to an analyst's workbench. A port scanner does TCP connect scans with service fingerprinting, a DNS lookup pulls the full record set (A, AAAA, MX, NS, TXT, CNAME) for a domain and a WHOIS lookup resolves registration data for a domain or IP. What makes those last two more than convenience tools is that every WHOIS and IP-intelligence result is automatically cross-checked against the OFAC SDN sanctions list, so a registrant or ASN owner that matches a sanctioned entity surfaces an inline alert without the analyst having to run a second, separate query. The same cross-check applies to the crypto wallet tracer: a BTC lookup against blockstream.info's Esplora API or an ETH lookup against Blockscout's public instance returns balance and transaction history, and the resulting address is checked against a mirrored OFAC sanctioned-address list, with a match surfacing as a red SANCTIONED badge directly in the RECON panel.

The Telegram OSINT layer takes a deliberately narrow approach to a normally credential-heavy problem: rather than authenticating through the Bot API or MTProto, it scrapes the public, unauthenticated `t.me/s/<channel>` web preview for a curated set of channels, five by default and overridable through an environment variable. Posts pulled from that feed are geoparsed against a multilingual place dictionary covering English, Cyrillic and Arabic script and plotted on the map as cyan dots, so a post mentioning a city becomes a clickable marker linking back to the original message on Telegram. It is a good example of the project's general pattern: prefer a keyless, publicly available data source over one that requires an API key or elevated access, even if that means writing a bespoke parser instead of calling a maintained SDK. That preference runs deep enough that a meaningful slice of the platform's intelligence domains function with no API keys configured at all.

Conflict zone mapping and the live broadcast network round out the map's non-technical content. Thirteen zones are tracked with severity-coded markers across three tiers, active wars in Ukraine, Gaza, Sudan, Myanmar, DRC and Yemen, high-tension zones in Syria, Lebanon, the Sahel, Somalia and the Red Sea and two elevated-tension zones in the Taiwan Strait and along the Korean DMZ, while more than 25 live 24/7 news streams from broadcasters like NBC, Sky News, Al Jazeera, France 24 and NHK are plotted as clickable dots that open a live feed in place. Because that underlying zone and broadcaster data changes rarely, it is served statically from memory rather than refetched, which alongside relaxed polling intervals of 15 to 30 minutes for otherwise-stable feeds is a large part of how the project reports a 75% reduction in edge requests compared with its initial release, a reminder that most of the cost in a real-time dashboard comes from data that does not actually need to be real-time.

On the interface side, Framer Motion drives the HUD's panel transitions and Lucide React supplies its icon set, both sitting on top of the same Next.js and TypeScript foundation as the API layer. The default deployment target is Vercel's Edge Network, which is what the edge-request figures above are measured against, but the project is also packaged for self-hosting through Docker with CasaOS compatibility, so an analyst who would rather keep every request off a third-party edge network can run the entire stack, map, API routes and RECON toolkit alike, on their own hardware instead. It ships under the MIT license, in keeping with the "open source" half of its name.
