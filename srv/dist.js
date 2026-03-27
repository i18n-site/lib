#!/usr/bin/env bun

import { $ } from 'zx'

await $`bunx changeset version`
await $`bunx changeset publish`
