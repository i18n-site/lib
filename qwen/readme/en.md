# @3-/qwen: Effortless Qwen-Code Integration

## Table of Contents
- [Features](#features)
- [Usage](#usage)
- [Design](#design)
- [Tech Stack](#tech-stack)
- [Directory Structure](#directory-structure)
- [Project Background](#project-background)

## Features
This project wraps `qwen-code`, providing a functional interface for JavaScript developers to simplify interactions with the Qwen-Code large language model. It abstracts away complex command-line argument configurations, allowing developers to invoke the model's capabilities directly within their JavaScript code. The project also integrates web search functionality via [Tavily](https://tavily.com/), enabling the model to access real-time information for more accurate and timely responses.

## Usage
Execute complex tasks like code generation and file manipulation with a simple function call.

```javascript
import Qwen from '@3-/qwen';

const {
  OPENAI_BASE_URL,
  OPENAI_MODEL,
  OPENAI_API_KEY,
  TAVILY_TOKEN
} = process.env;

const qwen = Qwen(
  OPENAI_BASE_URL,
  OPENAI_MODEL,
  OPENAI_API_KEY,
  TAVILY_TOKEN
);

await qwen('Create a file named news.md with today\'s news, search for it, and format it in Markdown.');
```

## Design
The core logic of `@3-/qwen` resides in `src/lib.js`. This module exports a higher-order function that accepts `openaiBaseUrl`, `model`, `openaiApiKey`, and `tavilyApiKey` as base configurations.

When this function is called, it returns a closure that holds the preset command-line arguments. When a specific task prompt (e.g., `'Create a file named news.md ...'`) is passed, it is combined with the preset arguments and forwarded to the `main` function of the `@3-/qwen-code` package for execution.

This design decouples model configuration from task execution, achieving a separation of concerns and providing developers with a clean and flexible interface.

## Tech Stack
- **Core Dependency**: `@3-/qwen-code` - Provides the core functionality for interacting with the Qwen-Code model.
- **Runtime**: [Bun](https://bun.sh/) - A high-performance JavaScript runtime and toolkit.
- **Testing**: [CoffeeScript](https://coffeescript.org/) - Used for writing concise test cases.

## Directory Structure
```
/
├── src/lib.js       # Core wrapper logic
├── test/main.coffee # Test example
├── readme/          # Project documentation
│   ├── en.md
│   └── zh.md
└── package.json     # Project configuration
```

## Project Background
Qwen (Tongyi Qianwen) is a series of large language models developed by Alibaba Cloud. As a key part of this family, Qwen-Code specializes in code generation, comprehension, and optimization, demonstrating exceptional capabilities in the software development field.

As large models become increasingly integral to software engineering, lowering their barrier to entry is crucial. The `@3-/qwen` project was created to bridge this gap for the vast JavaScript developer community, offering a more accessible and convenient way to integrate the powerful capabilities of Qwen-Code into their workflows and applications. This project is more than just a simple wrapper; it is an extension of `qwen-code`'s usability, aimed at promoting the adoption of AI-assisted programming in the frontend and Node.js ecosystems.
