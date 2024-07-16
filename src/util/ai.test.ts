import { expect, test, describe } from "vitest";

import { run, createHandler } from "./ai";

const config = { llm: "gemini", model: "gemini-1.5-pro-latest" } as const;

describe("run", () => {
  test("should return a simulated result", async () => {
    const result = await run("test", config);
    expect(result).toEqual(
      "Simulated call to llm 'gemini' model 'gemini-1.5-pro-latest' with prompt: 'test'"
    );
  });

  test("should return using a different model", async () => {
    const result = await run("test", {
      ...config,
      model: "gemini-1.5-flash-latest",
    });
    expect(result).toEqual(
      "Simulated call to llm 'gemini' model 'gemini-1.5-flash-latest' with prompt: 'test'"
    );
  });
});

describe("createHandler", () => {
  test("should create a handler", () => {
    const handler = createHandler();
    expect(handler).toEqual({
      prompt: "",
      output: "",
      config: { llm: "gemini", model: "gemini-1.5-pro" },
      run: expect.any(Function) as unknown,
    });
  });

  test("should create a handler with a given config", () => {
    const handler = createHandler({
      ...config,
      llm: "gemini",
      model: "gemini-1.0-pro-latest",
    });
    expect(handler).toEqual({
      prompt: "",
      output: "",
      config: { llm: "gemini", model: "gemini-1.0-pro-latest" },
      run: expect.any(Function) as unknown,
    });
  });

  test("should run the handler", async () => {
    const handler = createHandler();
    handler.prompt = "test";
    await handler.run();
    expect(handler.output).toEqual(
      "Simulated call to llm 'gemini' model 'gemini-1.5-pro' with prompt: 'test'"
    );
  });

  test("should run the handler and trigger the output callback", async () => {
    let result = "";
    const handler = createHandler(config, (output) => {
      result = output;
    });
    handler.prompt = "test";
    await handler.run();
    expect(result).toEqual(
      "Simulated call to llm 'gemini' model 'gemini-1.5-pro-latest' with prompt: 'test'"
    );
  });
});
