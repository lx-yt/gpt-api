import { describe, expect, test } from "vitest";

import { render, screen, renderHook } from "@testing-library/react";

import { useHandler } from "../hooks/useHandler";
import { Output } from "./Output";

describe("Output", () => {
  test.todo("should render", () => {
    const { result } = renderHook(() =>
      useHandler({ model: "gemini-1.5-pro-latest" })
    );
    render(<Output handler={result.current} />);
    expect(screen.getByDisplayValue("")).toBeInTheDocument();
  });

  test.todo("should change value when the handler is run");
});
