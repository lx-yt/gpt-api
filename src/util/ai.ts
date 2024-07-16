import { RootLogger } from "@lx-yt/logging";
const logger = RootLogger.getLogger("ai");

import { run as run_gemini, MODELS as MODELS_gemini } from "./gemini-api";

export interface Config {
  llm: (typeof LLMS)[number];
  model: ReturnType<typeof getModels>[number];
}

export interface Handler {
  config: Config;
  prompt: string;
  readonly run: () => Promise<void>;
  readonly output: string;
}

export const LLMS = ["gemini", "gpt", "claude"] as const;

export async function run(prompt: string, config: Config) {
  logger.info(
    `Running llm ${config.llm} model ${config.model} with prompt: ${prompt}`
  );

  let result: string;
  if (import.meta.env.DEV) {
    logger.info("Simulating API call...");
    result = await new Promise((resolve) =>
      setTimeout(() => {
        resolve(
          `Simulated call to llm '${config.llm}' model '${config.model}' with prompt: '${prompt}'`
        );
      }, 1000)
    );
  } else {
    const run = getRun(config.llm);
    result = await run(config.model, prompt);
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
    config: config ?? { llm: LLMS[0], model: getModels(LLMS[0])[0] },

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

function getAI(llm: (typeof LLMS)[number]) {
  switch (llm) {
    case "gemini":
      return { run: run_gemini, MODELS: MODELS_gemini };

    default:
      if (LLMS.includes(llm)) {
        throw new Error(`LLM not implemented: ${llm}`);
      } else {
        throw new Error(`Unknown llm: ${llm}`);
      }
  }
}

function getRun(llm: (typeof LLMS)[number]) {
  return getAI(llm).run;
}

export function getModels(llm: (typeof LLMS)[number]) {
  return getAI(llm).MODELS;
}
