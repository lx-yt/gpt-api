import { beforeEach, describe, expect, test } from "vitest";
import {
  render,
  screen,
  renderHook,
  cleanup,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useHandler } from "../hooks/useHandler";

import { Button } from "./Button";

const config = { llm: "gemini", model: "gemini-1.5-pro-latest" } as const;

describe("Button", () => {
  beforeEach(() => {
    cleanup();
  });

  test("should render", () => {
    const { result } = renderHook(() => useHandler(config));
    render(<Button handler={result.current} />);
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  test("should run the handler", async () => {
    const user = userEvent.setup();

    const { result } = renderHook(() => useHandler(config));

    result.current.setPrompt("test");

    render(<Button handler={result.current} />);

    const buttonElement = screen.getByText("Submit");
    expect(buttonElement).toBeInTheDocument();
    await user.click(buttonElement);
    await waitFor(
      () => {
        expect(result.current.output).toEqual(
          "Simulated call to llm 'gemini' model 'gemini-1.5-pro-latest' with prompt: 'test'"
        );
      },
      { timeout: 4000 }
    );
  });
});
