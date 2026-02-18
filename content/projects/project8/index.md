---
title: "Multi-Threaded Port Scanner in Python"
date: 2026-02-17
draft: false
description: "A concurrent port scanner using Python's concurrent.futures to scan 1024 ports in parallel — reporting open and closed states with clean summaries."
tags: ["Python", "Networking", "Security", "Concurrency", "Sockets"]
categories: ["Security Tools"]
---

## Overview

A multi-threaded port scanner built with Python's `concurrent.futures` module. It scans the first 1024 ports on a target host using 100 concurrent threads, classifying each port as OPEN or CLOSED and producing a clean summary report.

## Key Features

- **Concurrent scanning** with `ThreadPoolExecutor` for fast execution across 1024 ports
- **Configurable target, port range and thread count** via simple constants
- **Socket-level probing** using `connect_ex` with a 1-second timeout per port
- **Clean output** — real-time OPEN port reporting, followed by a summary of open and closed counts with elapsed time

## How It Works

1. Resolves the target hostname to an IP address
2. Submits one `scan_port` task per port to a thread pool
3. Each task opens a TCP socket, attempts to connect and returns the port state
4. Results stream in as they complete — open ports print immediately
5. After all tasks finish, a summary lists open ports, closed ports and total scan time

## Code
---
```` Python

    #!/usr/bin/env python3
    """Multi-threaded port scanner using concurrent.futures — reports OPEN and CLOSED ports."""

    import socket
    import concurrent.futures
    import time

    # Configuration
    TARGET = "scanme.nmap.org"  # Change to your own test machine
    PORT_RANGE = range(1, 1025)  # Scan first 1024 ports
    THREADS = 100  # Number of concurrent threads


    def scan_port(target, port):
        """Scan a single port and return its state."""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            result = sock.connect_ex((target, port))
            sock.close()
            if result == 0:
                return (port, "OPEN")
            else:
                return (port, "CLOSED")
        except socket.error:
            return (port, "CLOSED")


    def main():
        target_ip = socket.gethostbyname(TARGET)
        print(f"Scanning target: {TARGET} ({target_ip})")
        print(f"Scanning ports {PORT_RANGE.start}-{PORT_RANGE.stop - 1} with {THREADS} threads")
        print("-" * 50)

        start_time = time.time()
        open_ports = []
        closed_ports = []

        with concurrent.futures.ThreadPoolExecutor(max_workers=THREADS) as executor:
            futures = {executor.submit(scan_port, target_ip, port): port for port in PORT_RANGE}

            for future in concurrent.futures.as_completed(futures):
                port, status = future.result()
                if status == "OPEN":
                    open_ports.append(port)
                    print(f"  Port {port} is OPEN")

        elapsed = time.time() - start_time

        # Closed ports are everything that wasn't open
        closed_ports = sorted(set(PORT_RANGE) - set(open_ports))

        # Summary
        print("-" * 50)
        print(f"\nScan completed in {elapsed:.2f} seconds\n")

        print(f"OPEN ports ({len(open_ports)}):")
        if open_ports:
            print(f"  {', '.join(str(p) for p in sorted(open_ports))}")
        else:
            print("  None")

        print(f"\nCLOSED ports ({len(closed_ports)}):")
        if len(closed_ports) <= 20:
            print(f"  {', '.join(str(p) for p in closed_ports)}")
        else:
            print(f"  {', '.join(str(p) for p in closed_ports[:10])}, ... "
                f"{', '.join(str(p) for p in closed_ports[-10:])}")


    if __name__ == "__main__":
        main()

## Usage

```bash
python index.md.py
```

Modify the `TARGET`, `PORT_RANGE` and `THREADS` constants to customize the scan.

---

*Built with Python 3 standard library — no external dependencies required.*
