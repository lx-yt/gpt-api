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

describe("Button", () => {
  beforeEach(() => {
    cleanup();
  });

  test("should render", () => {
    const { result } = renderHook(() =>
      useHandler({ model: "gemini-1.5-pro-latest" })
    );
    render(<Button handler={result.current} />);
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  test.todo("should run the handler", async () => {
    const user = userEvent.setup();

    const config = { model: "gemini-1.5-pro-latest" };

    const { result } = renderHook(() => useHandler(config));

    result.current.setPrompt("test");

    render(<Button handler={result.current} />);

    const buttonElement = screen.getByText("Submit");
    expect(buttonElement).toBeInTheDocument();
    await user.click(buttonElement);
    await waitFor(() => {
      expect(result.current.output).toEqual(
        "Simulated call to 'gemini-1.5-pro-latest' with prompt: 'test'"
      );
    });
  });
});
