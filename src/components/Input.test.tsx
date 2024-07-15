import { beforeEach, describe, expect, test } from "vitest";

import { cleanup, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useHandler } from "../hooks/useHandler";
import { Input } from "./Input";

describe("Input", () => {
  beforeEach(() => {
    cleanup();
  });

  test("should render", () => {
    const { result } = renderHook(() =>
      useHandler({ model: "gemini-1.5-pro-latest" })
    );
    render(<Input handler={result.current} />);
    expect(
      screen.getByPlaceholderText("Enter your prompt here")
    ).toBeInTheDocument();
  });

  test.todo("should change the prompt", async () => {
    const user = userEvent.setup();

    const config = { model: "gemini-1.5-pro-latest" };

    const { result } = renderHook(() => useHandler(config));
    render(<Input handler={result.current} />);
    let inputElement = screen.getByPlaceholderText("Enter your prompt here");

    expect(inputElement).toBeInTheDocument();

    await user.type(inputElement, "test");

    console.log(inputElement);
    console.log(result.current.prompt);
    expect(inputElement).toHaveValue("");
    inputElement = screen.getByPlaceholderText("Enter your prompt here");
    console.log(inputElement);

    expect(inputElement).toHaveValue("test");

    expect(result.current.prompt).toEqual("test");
  });
});
