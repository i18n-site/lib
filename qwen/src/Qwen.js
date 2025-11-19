#!/usr/bin/env bun

import { randomUUID } from "node:crypto";
import { logUserPrompt } from "@3-/qwen-code-core";
import { runExitCleanup } from "@3-/qwen-code/utils/cleanup.js";
import { loadCliConfig } from "@3-/qwen-code/config/config.js";

import { runNonInteractive } from "@3-/qwen-code/nonInteractiveCli.js";

import { validateNonInteractiveAuth } from "@3-/qwen-code/validateNonInterActiveAuth.js";

import {
  ExtensionStorage,
  loadExtensions,
} from "@3-/qwen-code/config/extension.js";

import {
  loadSettings,
  migrateDeprecatedSettings,
} from "@3-/qwen-code/config/settings.js";

import { ExtensionEnablementManager } from "@3-/qwen-code/config/extensions/extensionEnablement.js";

const settings = loadSettings(),
  sessionId = randomUUID(),
  extensionEnablementManager = new ExtensionEnablementManager(
    ExtensionStorage.getUserExtensionsDir(),
    [], // extensions
  ),
  extensions = loadExtensions(extensionEnablementManager);

migrateDeprecatedSettings(settings);

export default async (openaiBaseUrl, model, openaiApiKey) => {
  // console.log({
  //   openaiApiKey,
  //   openaiBaseUrl,
  //   model,
  // });

  return async (cwd) => {
    const config = await loadCliConfig(
        settings.merged,
        extensions,
        extensionEnablementManager,
        sessionId,
        {
          yolo: 1,
          openaiApiKey,
          openaiBaseUrl,
          model,
        },
        cwd,
      ),
      auth_type = config.getContentGeneratorConfig()?.authType;
    await config.initialize();
    return async (input) => {
      const prompt_id = Math.random().toString(16).slice(2);
      logUserPrompt(config, {
        "event.name": "user_prompt",
        "event.timestamp": new Date().toISOString(),
        prompt: input,
        prompt_id,
        auth_type,
        prompt_length: input.length,
      });
      const auth = settings.merged.security?.auth;
      const nonInteractiveConfig = await validateNonInteractiveAuth(
        auth?.selectedType,
        auth?.useExternal,
        config,
        settings,
      );

      await runNonInteractive(nonInteractiveConfig, settings, input, prompt_id);
      await runExitCleanup();
    };
  };
};
