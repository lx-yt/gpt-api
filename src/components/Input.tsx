import { RootLogger } from "@lx-yt/logging";
const logger = RootLogger.getLogger("Input");

import React from "react";

import type { ReactiveHandler } from "../hooks/useHandler";

export function Input({
  handler,
  className,
  style,
}: {
  handler: ReactiveHandler;
  className?: string;
  style?: React.CSSProperties;
}) {
  logger.debug("Rendering Input...", handler);

  const { prompt, setPrompt } = handler;

  logger.debug("Prompt: " + prompt);

  const handleChangePrompt = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      logger.debug(`setPrompt: ${event.target.value}`);
      setPrompt(event.target.value);
    },
    [setPrompt]
  );

  return (
    <textarea
      value={prompt}
      onChange={handleChangePrompt}
      placeholder="Enter your prompt here"
      className={className}
      style={style}
    ></textarea>
  );
}
