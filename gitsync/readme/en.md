# gitsync: Automated Git Repository Synchronization and AI-Enhanced Commits

For developers in mainland China, accessing GitHub can often be slow, making AtomGit.com a more efficient alternative. This project bridges that gap by automating the synchronization of repositories from AtomGit to GitHub. It uses AI to generate high-quality commit messages and leverages the `gme` command to signal when a set of changes is ready to be squashed, commented on by AI, and synced to GitHub.

This project not only synchronizes commits from `atomgit.com` to `github.com` but also **automatically creates a corresponding repository on GitHub when a new one is created on AtomGit**, ensuring seamless cross-platform integration.

When your commit message begins with the `🔹` symbol, the system recognizes it as a special merge request. AI then steps in to automatically generate a high-quality, standardized commit message for you.

To maintain a clean and highly readable commit history on the `main` branch, we use `❯ git merge --squash` to combine multiple commits from the `dev` branch into a single, concise hash. This approach preserves the complete development history of the `dev` branch while ensuring the clarity of the main branch.

**From now on, you'll never have to write tedious commit notes by hand again!**

The AI handles it all for you, allowing you to focus on core development tasks.

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [Usage](#usage)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
- [A Little Story](#a-little-story)

## Features

- **Automated Synchronization**: Automatically syncs `dev` branches from a source (e.g., AtomGit) to a destination (e.g., GitHub).
- **Smart Sync Rules**:
    - Triggers an immediate merge for commits in the `dev` branch with messages starting with `🔹`.
    - Automatically syncs repositories that have not seen new commits for more than 10 days.
- **AI-Powered Commits**: Utilizes the Qwen large language model to generate concise, high-quality, bilingual (English/Chinese) commit messages for squashed merges.
- **Automatic Repository Creation**: If a corresponding repository does not exist at the destination, it will be created automatically.
- **Resilient and Stateful**: Maintains a state file to track synchronization status, ensuring robustness and preventing redundant operations.

## How It Works

The synchronization process follows a clear, modular flow:

1.  **`lib.coffee` (Main Entry)**: As the library's entry point, it iterates through all repositories in the source organization and calls `syncSrcDev` to process each one.
2.  **`syncSrcDev` (Sync Logic)**: For each repository, it checks the `dev` branch. It determines if a sync is necessary based on either the 10-day inactivity rule or the presence of new commits. It also handles the logic for creating a new destination repository if one doesn't exist.
3.  **`mergeIfNeed` (Merge Execution)**: If a sync is required, this module prepares the environment and calls `gitInit`.
4.  **`gitInit` (Git Initialization)**: It sets up a temporary local repository, adding the source and destination as remotes (`src` and `origin`).
5.  **`needSync` (Sync Condition Check)**: It inspects the commit history of the `src/dev` branch to see if any commit messages start with the `🔹` flag, which signals an explicit request to merge.
6.  **`merge` (The Merge)**:
    - A `--squash` merge of the `dev` branch is performed.
    - A `diff` of the changes is generated.
    - The diff is sent to the Qwen LLM, which returns a standardized, bilingual commit message.
    - The changes are committed and pushed to the `main` branches of both the destination and source remotes, ensuring they stay aligned.
7.  **`ATOMGIT.js` / `GITHUB.js`**: API clients created using the `@3-/gitapi` library, used for interacting with the AtomGit and GitHub platforms.

This design ensures that routine merges are fully automated, with clear and readable commit histories maintained by AI.

## Usage

To use the library, import the `sync` function and provide it with the necessary configuration.

```javascript
#!/usr/bin/env bun

import GITHUB from "@3-/gitsync/GITHUB.js";
import ATOMGIT from "@3-/gitsync/ATOMGIT.js";
import sync from "@3-/gitsync";
import { join } from "path";

const ROOT = import.meta.dirname;

// Start the synchronization process
// This will sync all repos from the 'js0' org on AtomGit
// to the 'js0-site' org on GitHub.
await sync(
  join(ROOT, "sync.yml"), // Path to the state file
  ATOMGIT, "js0",         // Source API client and organization
  GITHUB, "js0-site"      // Destination API client and organization
);
```

## Helper Scripts

The project includes two helper scripts in the `bin/` directory to simplify daily operations.

- **`gci` (Git Commit)**: A shortcut for your daily commit workflow. It automatically stages all new changes, commits them with a standard message, and pushes the `dev` branch. It handles initial repository setup and ensures work from `main` is correctly merged into `dev`.

- **`gme` (Git Merge)**: A script to flag a commit for immediate synchronization. It runs `gci` to commit any pending changes, then amends the latest commit message to add the `🔹` prefix. This signals the automation to perform a merge on its next run.

## Technology Stack

- **Runtime**: Bun / Node.js
- **Language**: CoffeeScript & JavaScript
- **Core Libraries**:
    - `@3-/gitapi`: A wrapper to simplify API calls to Git platforms like GitHub and AtomGit.

## Directory Structure

```
/
├── AGENTS.md           # Agent development standards and style guide
├── bin/                # Helper scripts
│   ├── gci             # Daily commit shortcut
│   └── gme             # Mark commit for AI merge
├── build.sh            # Project build script
├── bun.lock            # bun dependency lock file
├── package.json        # Project metadata and dependencies
├── readme/             # README documents
│   ├── en.md           # English README
│   └── zh.md           # Chinese README
├── run.sh              # Project run script
├── src/                # Source code (CoffeeScript & JavaScript)
│   ├── ATOMGIT.js      # AtomGit API client
│   ├── GITHUB.js       # GitHub API client
│   ├── gitInit.coffee  # Handles git repository initialization
│   ├── lib.coffee      # Main library entry, orchestrates the sync process
│   ├── merge.coffee    # Performs the squash merge and AI commit generation
│   ├── mergeIfNeed.coffee # Manages the merge process if conditions are met
│   ├── needSync.coffee # Checks if a sync is explicitly requested
│   └── syncSrcDev.coffee # Core logic for checking and initiating sync for a repo
└── test/               # Test and example scripts
    ├── github2atomgit.coffee # Test for syncing from GitHub to AtomGit
    ├── main.js         # Example usage entry point
    └── sync.yml        # Example YAML for synchronization state
```

## A Little Story

The concept of distributed version control, which `git` embodies, was a revolutionary step forward from centralized systems like SVN. But the real magic began when developers started building automation on top of it. The idea of a "commit hook" first appeared in the early days of version control systems, long before Git. These were simple scripts that could run on certain events, like a pre-commit check.

This project takes that spirit of automation to a new level. It’s not just a hook; it’s a fully autonomous agent. It decides *when* to act (the 10-day rule), *what* to look for (the `🔹` flag), and even *how* to describe its actions (AI-generated commits). It reflects a modern trend in software development where AI doesn't just assist developers—it becomes an active, intelligent participant in the development lifecycle itself, handling the routine tasks so humans can focus on creative and complex problems.