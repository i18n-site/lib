# @3-/ip : Bidirectional IP Address Binary Converter

High-performance library for converting between IP addresses and binary representations, supporting both IPv4 and IPv6 with zero dependencies.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [IPv4 Conversion](#ipv4-conversion)
  - [IPv6 Conversion](#ipv6-conversion)
- [Design Philosophy](#design-philosophy)
- [Technical Stack](#technical-stack)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Historical Context](#historical-context)

## Features

- **Bidirectional Conversion**: Convert IP addresses to binary and back
- **Dual Protocol Support**: Full IPv4 and IPv6 compatibility
- **IPv6 Compression**: Automatic handling of compressed IPv6 notation (::)
- **Type Safety**: Uses Uint8Array for efficient binary representation
- **Zero Dependencies**: Pure JavaScript implementation
- **Modern Syntax**: ES modules with async/await patterns

## Installation

```bash
bun i @3-/ip
```

## Usage

### IPv4 Conversion

```javascript
import ipBin from '@3-/ip/ipBin.js'
import binIp from '@3-/ip/binIp.js'

// Convert IPv4 address to binary
const bytes = ipBin('192.168.1.1')
console.log(bytes) // Uint8Array(4) [192, 168, 1, 1]

// Convert binary back to IPv4 address
const ip = binIp(bytes)
console.log(ip) // "192.168.1.1"
```

### IPv6 Conversion

```javascript
import ipBin from '@3-/ip/ipBin.js'
import binIp from '@3-/ip/binIp.js'

// Convert full IPv6 address to binary
const bytes = ipBin('2001:0db8:85a3:0000:0000:8a2e:0370:7334')
console.log(bytes) // Uint8Array(16) [32, 1, 13, 184, ...]

// Convert compressed IPv6 address
const compressedBytes = ipBin('2001:db8:85a3::8a2e:370:7334')
const ip = binIp(compressedBytes)
console.log(ip) // "2001:db8:85a3::8a2e:370:7334"

// Handle special addresses
const loopback = ipBin('::1')
console.log(binIp(loopback)) // "::1"
```

## Design Philosophy

The library follows a functional programming approach with two core modules:

**Conversion Flow:**

```
IP String → ipBin() → Uint8Array → binIp() → IP String
```

**Module Interaction:**

1. `ipBin.js`: Parses IP string format and converts to binary representation
   - Detects protocol by delimiter (`:` for IPv6, `.` for IPv4)
   - Expands compressed IPv6 notation
   - Validates address format and range
   - Returns Uint8Array (4 bytes for IPv4, 16 bytes for IPv6)

2. `binIp.js`: Reconstructs IP string from binary data
   - Determines protocol by array length
   - Applies IPv6 compression for consecutive zeros
   - Formats output according to protocol standards

3. `IpInvalid.js`: Centralized error handling for invalid addresses

## Technical Stack

- **Runtime**: Bun/Node.js (ES Modules)
- **Language**: Modern JavaScript (ES2022+)
- **Data Structure**: Uint8Array for binary representation
- **Architecture**: Pure functional programming
- **Standards**: RFC 4291 (IPv6), RFC 791 (IPv4)

## Project Structure

```
@3-/ip/
├── src/
│   ├── ipBin.js        # IP string to binary converter
│   ├── binIp.js        # Binary to IP string converter
│   └── IpInvalid.js    # Error definition
├── lib/                # Compiled output
├── test/
│   └── main.js         # Usage examples and tests
├── readme/
│   ├── en.md           # English documentation
│   └── zh.md           # Chinese documentation
└── package.json
```

## API Reference

### ipBin(ip)

Converts IP address string to binary representation.

**Parameters:**
- `ip` (string): IPv4 or IPv6 address

**Returns:**
- `Uint8Array`: 4 bytes for IPv4, 16 bytes for IPv6

**Throws:**
- `IpInvalid`: When address format is invalid

### binIp(bin)

Converts binary representation to IP address string.

**Parameters:**
- `bin` (Uint8Array): Binary IP address (4 or 16 bytes)

**Returns:**
- `string`: Formatted IP address

**Throws:**
- `IpInvalid`: When binary length is invalid

## Historical Context

The need for IP address binary conversion emerged from the early days of network programming. In 1981, RFC 791 defined IPv4 with its 32-bit address space, using dot-decimal notation for human readability while computers processed addresses as binary data.

As the internet grew, IPv4's 4.3 billion addresses proved insufficient. RFC 2460 introduced IPv6 in 1998, expanding to 128-bit addresses with hexadecimal colon notation. The double-colon (::) compression syntax was added to simplify the lengthy addresses, creating the challenge this library solves: efficiently converting between human-readable and machine-processable formats.

The choice of Uint8Array reflects modern JavaScript's evolution. Before typed arrays were introduced in ES2015, developers relied on regular arrays or Buffer objects, which were less efficient for binary operations. Uint8Array provides direct memory access and better performance for network-level operations, making it the ideal choice for IP address manipulation in contemporary JavaScript applications.