import { RootLogger } from "@lx-yt/logging";
const logger = RootLogger.getLogger("ai");

import { run as runGemini } from "./gemini-api";

export interface Config {
  model: string;
}

export interface Handler {
  config: Config;
  prompt: string;
  readonly run: () => Promise<void>;
  readonly output: string;
}

export async function run(prompt: string, config: Config) {
  logger.info(`Running model ${config.model} with prompt: ${prompt}`);

  let result: string;
  if (import.meta.env["VITE_SIMULATE_API"] === "true") {
    logger.info("Simulating API call...");
    result = await new Promise((resolve) =>
      setTimeout(() => {
        resolve("Simulated result for:" + prompt);
      }, 1000)
    );
  } else {
    result = await runGemini(config.model, prompt);
    logger.info(`Result: ${result}`);
  }

  return result;
}

export function createHandler(
  config?: Config | null,
  outputChangedCallback?: ((output: string) => void) | null
) {
  let output = "";

  const changeOutput = (value: string) => {
    output = value;
    outputChangedCallback?.(output);
  };

  const handler: Handler = {
    config: config ?? { model: "" },
    prompt: "",
    run: async function () {
      return run(handler.prompt, handler.config)
        .then((text) => {
          changeOutput(text);
        })
        .catch((error: unknown) => {
          changeOutput(error as string);
          logger.error(`Error: ${error as string}`);
        });
    },
    get output() {
      return output;
    },
    set output(_: string) {
      throw new Error("Cannot set 'output' directly.");
    },
  };

  return handler;
}
