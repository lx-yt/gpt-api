import { RootLogger } from "@lx-yt/logging";
const logger = RootLogger.getLogger("ai");

import { run as runGemini } from "./gemini-api";

export interface Config {
  model: string;
}

export interface Handler {
  prompt: string;
  output: string;
  config: Config;
  run: () => void;
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

export function createHandler(config?: Config) {
  const handler: Handler = {
    prompt: "",
    output: "",
    config: config ?? { model: "" },
    run: function () {
      run(handler.prompt, handler.config)
        .then((text) => {
          handler.output = text;
        })
        .catch((error: unknown) => {
          handler.output = error as string;
          logger.error(`Error: ${error as string}`);
        });
    },
  };
  return handler;
}
