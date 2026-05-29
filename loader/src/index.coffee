#!/usr/bin/env coffee

import { register } from "node:module"
import { pathToFileURL } from "node:url"

register("@3-/loader/loader.js", pathToFileURL("./"))
