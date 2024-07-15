import { expect, test, describe } from "vitest";

import { run, createHandler } from "./ai";

describe("run", () => {
  test("should return a simulated result", async () => {
    const result = await run("test", { model: "gemini-1.5-pro-latest" });
    expect(result).toEqual(
      "Simulated call to 'gemini-1.5-pro-latest' with prompt: 'test'"
    );
  });

  test("should return using a different model", async () => {
    const result = await run("test", { model: "gemini-1.5-flash-latest" });
    expect(result).toEqual(
      "Simulated call to 'gemini-1.5-flash-latest' with prompt: 'test'"
    );
  });
});

describe("createHandler", () => {
  test("should create a handler", () => {
    const handler = createHandler();
    expect(handler).toEqual({
      prompt: "",
      output: "",
      config: { model: "" },
      run: expect.any(Function) as unknown,
    });
  });

  test("should create a handler with a given config", () => {
    const handler = createHandler({ model: "gemini-1.5-pro-latest" });
    expect(handler).toEqual({
      prompt: "",
      output: "",
      config: { model: "gemini-1.5-pro-latest" },
      run: expect.any(Function) as unknown,
    });
  });

  test("should run the handler", async () => {
    const handler = createHandler();
    handler.prompt = "test";
    await handler.run();
    expect(handler.output).toEqual("Simulated call to '' with prompt: 'test'");
  });

  test("should run the handler and trigger the output callback", async () => {
    let result = "";
    const handler = createHandler(
      { model: "gemini-1.5-pro-latest" },
      (output) => {
        result = output;
      }
    );
    handler.prompt = "test";
    await handler.run();
    expect(result).toEqual(
      "Simulated call to 'gemini-1.5-pro-latest' with prompt: 'test'"
    );
  });
});
