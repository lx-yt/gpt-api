import { expect, test, describe } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { useHandler } from "./useHandler";

const config = { llm: "gemini", model: "gemini-1.5-pro-latest" } as const;

describe("useHandler", () => {
  test("should create a handler", () => {
    const { result } = renderHook(() => useHandler(config));
    expect(result.current).toEqual({
      prompt: "",
      output: "",
      config: { llm: "gemini", model: "gemini-1.5-pro-latest" },
      run: expect.any(Function) as unknown,
      setPrompt: expect.any(Function) as unknown,
      setConfig: expect.any(Function) as unknown,
    });
  });

  test("should update handler prompt using setPrompt", () => {
    const { result } = renderHook(() => useHandler(config));

    const oldHandler = result.current;

    act(() => {
      result.current.setPrompt("test");
    });

    expect(result.current).not.toBe(oldHandler);

    expect(result.current.prompt).toEqual("test");
  });

  test("should not cause an update to handler when the prompt is changed using accessor (not reactive)", () => {
    const { result } = renderHook(() => useHandler(config));

    let oldHandler = result.current;

    expect(result.current.prompt).toEqual("");

    act(() => {
      result.current.setPrompt("test");
    });

    expect(result.current).not.toBe(oldHandler);
    expect(result.current.prompt).toEqual("test");
    oldHandler = result.current;

    act(() => {
      result.current.prompt = "test";
    });

    expect(result.current).toBe(oldHandler);

    expect(result.current.prompt).toEqual("test");
  });

  test("should update handler output", async () => {
    const { result } = renderHook(() => useHandler(config));
    const oldHandler = result.current;

    await act(async () => {
      await result.current.run();
      expect(result.current.output).not.toEqual(
        "Simulated call to llm 'gemini' model 'gemini-1.5-pro-latest' with prompt: ''"
      );
    });

    expect(result.current.output).toEqual(
      "Simulated call to llm 'gemini' model 'gemini-1.5-pro-latest' with prompt: ''"
    );
    expect(result.current).not.toBe(oldHandler);
    expect(result.current.output).toEqual(
      "Simulated call to llm 'gemini' model 'gemini-1.5-pro-latest' with prompt: ''"
    );
  }, 9000);

  test("should update handler output, taking into account prompt", async () => {
    const { result } = renderHook(() => useHandler(config));

    act(() => {
      result.current.setPrompt("test");
    });

    await act(async () => {
      await result.current.run();
    });

    expect(result.current.output).toEqual(
      "Simulated call to llm 'gemini' model 'gemini-1.5-pro-latest' with prompt: 'test'"
    );
  });

  test("should update handler config", () => {
    const { result } = renderHook(() => useHandler(config));
    const oldHandler = result.current;

    expect(result.current.config.model).toEqual("gemini-1.5-pro-latest");

    act(() => {
      result.current.setConfig({
        ...result.current.config,
        model: "gemini-1.0-pro",
      });
    });

    expect(result.current).not.toBe(oldHandler);
    expect(result.current.config.model).toEqual("gemini-1.0-pro");
  });
});
