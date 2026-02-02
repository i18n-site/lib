# @3-/gitapi: Seamless Git API Abstraction

This project provides a lightweight, unified API wrapper for Git services, designed to work with [gitsync](https://www.npmjs.com/package/@3-/gitsync) to synchronize repositories from AtomGit to GitHub.

## Table of Contents

- [Features](#features)
- [Usage](#usage)
- [Design Philosophy](#design-philosophy)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
- [A Little History](#a-little-history)

## Features

- Unified interface for multiple Git providers (currently AtomGit and GitHub).
- Asynchronous, promise-based operations using native `fetch`.
- Handles API pagination for listing repositories.
- Methods for creating repositories, checking branches, and generating Git URLs.

## Usage

Install the package using bun:

```sh
bun i @3-/gitapi
```

The following example demonstrates how to list repositories from an organization on both AtomGit and GitHub.

```javascript
#!/usr/bin/env coffee

import gitapi from '@3-/gitapi'
const { GITHUB_TOKEN, ATOMGIT_TOKEN } = process.env;

const github = gitapi('api.github.com', GITHUB_TOKEN),
  atomgit = gitapi('api.atomgit.com', ATOMGIT_TOKEN),
  orgReposLs = async (api, org) => {
    for await (const i of api.orgRepos(org)) {
      console.log(api.site, i.full_name)
    }
  }

await orgReposLs(atomgit,'js0')
await orgReposLs(github,'js0-site')
```

## Design Philosophy

The library is designed as a factory function that, when called with a `site` endpoint and an authentication `token`, returns a client object tailored to that service.

- **Client Factory**: `gitapi(site, token)` initializes the client, setting the base URL and authorization headers for all subsequent requests.
- **Request Handling**: A generic `req` function manages all `fetch` calls, automatically injecting authorization headers and performing basic status checks.
- **Pagination**: The `orgRepos` method uses the `@3-/pageiter` library to abstract away the complexity of handling paginated API responses, providing a simple `for...await...of` loop to iterate through all repositories.
- **Pure Functions**: The library adheres to a functional programming style, exporting pure functions and avoiding classes.

## Technology Stack

- **Language**: CoffeeScript (compiled to modern JavaScript)
- **Runtime**: Node.js
- **Package Manager**: Bun
- **Core Dependencies**:
  - `@3-/pageiter`: For asynchronous iteration over paginated API results.

## Directory Structure

```
/
├── src/lib.coffee       # Main source code
├── lib/lib.js           # Compiled JavaScript output
├── test/main.js         # Usage example
├── package.json         # Project metadata and dependencies
└── readme/
    ├── en.md            # This document
    └── zh.md            # Chinese documentation
```

## A Little History

The design of this library echoes a core philosophy within Git itself: the separation of "porcelain" from "plumbing." In Git, "plumbing" refers to the low-level commands that do the raw work (e.g., `hash-object`, `cat-file`), while "porcelain" refers to the user-friendly commands that orchestrate them (e.g., `add`, `commit`).

Similarly, `@3-/gitapi` acts as a "porcelain" layer. It hides the raw "plumbing" of direct `fetch` calls, pagination parameters, and authorization headers, providing a clean, high-level interface for common Git API operations. This abstraction simplifies integration with other tools, like `gitsync`, allowing them to focus on their core logic without getting bogged down in the details of API interaction.
