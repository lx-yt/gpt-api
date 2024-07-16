import { beforeEach, describe, expect, test } from "vitest";

import { cleanup, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useHandler } from "../hooks/useHandler";
import { Input } from "./Input";

const config = { llm: "gemini", model: "gemini-1.5-pro-latest" } as const;

describe("Input", () => {
  beforeEach(() => {
    cleanup();
  });

  test("should render", () => {
    const { result } = renderHook(() => useHandler(config));
    render(<Input handler={result.current} />);
    expect(
      screen.getByPlaceholderText("Enter your prompt here")
    ).toBeInTheDocument();
  });

  test("should change the prompt and display it accordingly", async () => {
    const user = userEvent.setup();

    let handler = {} as ReturnType<typeof useHandler>;

    function TestComponent() {
      const usedHandler = useHandler(config);
      handler = usedHandler;
      return <Input handler={usedHandler} />;
    }

    render(<TestComponent />);

    const inputElement = screen.getByPlaceholderText<HTMLTextAreaElement>(
      "Enter your prompt here"
    );

    expect(inputElement).toBeInTheDocument();

    await user.click(inputElement);
    await user.paste("abcdef");
    expect(handler.prompt).toEqual("abcdef");
    expect(inputElement).toHaveValue("abcdef");

    await user.type(inputElement, "a");
    expect(handler.prompt).toEqual("abcdefa");
    expect(inputElement).toHaveValue("abcdefa");
    await user.type(inputElement, "b");
    expect(handler.prompt).toEqual("abcdefab");
    expect(inputElement).toHaveValue("abcdefab");

    await user.type(inputElement, "test");
    expect(handler.prompt).toEqual("abcdefabtest");
    expect(inputElement).toHaveValue("abcdefabtest");
  });
});
