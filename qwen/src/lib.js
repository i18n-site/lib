#!/usr/bin/env bun

import Qwen from "./Qwen.js";

const { OPENAI_API_KEY, OPENAI_BASE_URL, OPENAI_MODEL } = process.env;
export default await Qwen(OPENAI_BASE_URL, OPENAI_MODEL, OPENAI_API_KEY);
