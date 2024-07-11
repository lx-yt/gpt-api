import { RootLogger } from "@lx-yt/logging";
const logger = RootLogger.getLogger("gemini-api");

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env["VITE_API_KEY"] as string;

// Access your API key (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(API_KEY); // eslint-disable-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call

export async function run(model: string, prompt: string) {
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const generativeModel = genAI.getGenerativeModel({
    model: model,
  }) as { generateContent: (prompt: string) => Promise<unknown> };

  logger.info(`Running model ${model} with prompt: ${prompt}`);

  const result = (await generativeModel.generateContent(prompt)) as {
    response: Promise<{ text: () => string }>;
  };
  const response = await result.response;
  const text = response.text();
  return text;
}
