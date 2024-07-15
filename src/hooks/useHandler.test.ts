import { expect, test, describe } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { useHandler } from "./useHandler";

describe("useHandler", () => {
  test("should create a handler", () => {
    const config = { model: "gemini-1.5-pro-latest" };
    const { result } = renderHook(() => useHandler(config));
    expect(result.current).toEqual({
      prompt: "",
      output: "",
      config: { model: "gemini-1.5-pro-latest" },
      run: expect.any(Function) as unknown,
      setPrompt: expect.any(Function) as unknown,
      setConfig: expect.any(Function) as unknown,
    });
  });

  test("should update handler prompt using setPrompt", () => {
    const config = { model: "gemini-1.5-pro-latest" };
    const { result } = renderHook(() => useHandler(config));

    const oldHandler = result.current;

    act(() => {
      result.current.setPrompt("test");
    });

    expect(result.current).not.toBe(oldHandler);

    expect(result.current.prompt).toEqual("test");
  });

  test("should not cause an update to handler when the prompt is changed using accessor (not reactive)", () => {
    const config = { model: "gemini-1.5-pro-latest" };
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
    const config = { model: "gemini-1.5-pro-latest" };

    const { result } = renderHook(() => useHandler(config));
    const oldHandler = result.current;

    await act(async () => {
      await result.current.run();
    });

    expect(result.current).not.toBe(oldHandler);

    expect(result.current.output).toEqual(
      "Simulated call to 'gemini-1.5-pro-latest' with prompt: ''"
    );
  });

  test("should update handler output, taking into account prompt", async () => {
    const config = { model: "gemini-1.5-pro-latest" };

    const { result } = renderHook(() => useHandler(config));

    act(() => {
      result.current.setPrompt("test");
    });

    await act(async () => {
      await result.current.run();
    });

    expect(result.current.output).toEqual(
      "Simulated call to 'gemini-1.5-pro-latest' with prompt: 'test'"
    );
  });

  test("should update handler config", () => {
    const config = { model: "gemini-1.5-pro-latest" };

    const { result } = renderHook(() => useHandler(config));
    const oldHandler = result.current;

    expect(result.current.config).toEqual({ model: "gemini-1.5-pro-latest" });

    act(() => {
      result.current.setConfig({ model: "test" });
    });

    expect(result.current).not.toBe(oldHandler);
    expect(result.current.config).toEqual({ model: "test" });
  });
});
