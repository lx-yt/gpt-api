import { beforeEach, describe, expect, test } from "vitest";

import { cleanup, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ConfigView } from "./ConfigView";
import { useHandler } from "../hooks/useHandler";

const config = { llm: "gemini", model: "gemini-1.5-pro-latest" } as const;

describe("ConfigView", () => {
  beforeEach(() => {
    cleanup();
  });

  test("should render", () => {
    const { result } = renderHook(() => useHandler(config));
    const { container } = render(<ConfigView handler={result.current} />);
    expect(container).toBeInTheDocument();
  });

  // useless until more LLMs than just gemini are implemented
  test.todo("should change the LLM", async () => {
    const { result } = renderHook(() => useHandler(config));

    render(<ConfigView handler={result.current} />);

    const user = userEvent.setup();

    const selectElement = screen.getByLabelText<HTMLSelectElement>("LLM");

    const oldHandler = result.current;

    await user.selectOptions(selectElement, "gemini");

    expect(result.current).not.toBe(oldHandler);
    expect(result.current.config.llm).toEqual("gemini");
  });

  test("should change the model", async () => {
    const { result } = renderHook(() => useHandler(config));
    render(<ConfigView handler={result.current} />);

    expect(result.current.config.model).not.toEqual("gemini-1.0-pro");

    const oldHandler = result.current;

    const user = userEvent.setup();
    const selectElement = screen.getByLabelText<HTMLSelectElement>("Model");
    await user.selectOptions(selectElement, "gemini-1.0-pro");
    expect(result.current.config.model).toEqual("gemini-1.0-pro");
    expect(result.current).not.toBe(oldHandler);
  });

  test.todo("should display only the model options for the selected llm");
});
