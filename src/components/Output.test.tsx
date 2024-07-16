import { RootLogger } from "@lx-yt/logging";
RootLogger.getLogger("Output").minLevel = "debug";

import { beforeEach, describe, expect, test } from "vitest";

import { act, cleanup, render, renderHook } from "@testing-library/react";

import { useHandler } from "../hooks/useHandler";
import { Output } from "./Output";

const config = { llm: "gemini", model: "gemini-1.5-pro-latest" } as const;

describe("Output", () => {
  beforeEach(() => {
    cleanup();
  });

  test("should render", () => {
    const { result } = renderHook(() => useHandler(config));
    const { container } = render(<Output handler={result.current} />);
    expect(container.children[0]).toBeInTheDocument();
  });

  test("should change value when the handler is run", async () => {
    let handler = {} as ReturnType<typeof useHandler>;

    function TestComponent() {
      const usedHandler = useHandler(config);
      handler = usedHandler;
      return <Output handler={usedHandler} />;
    }

    const { container } = render(<TestComponent />);

    expect(container.children[0]).toBeInTheDocument();
    expect(container.children[0]).toContainHTML("");

    await act(async () => {
      await handler.run();
    });

    expect(handler.output).toEqual(
      "Simulated call to llm 'gemini' model 'gemini-1.5-pro-latest' with prompt: ''"
    );

    expect(container.children[0]?.innerHTML).toEqual(
      `<p>${handler.output}</p>`
    );
  });
});
