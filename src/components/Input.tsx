import { RootLogger } from "@lx-yt/logging";
const logger = RootLogger.getLogger("Input");

import React from "react";

import type { HandlerWithSetPrompt } from "../hooks/useHandler";

export function Input({
  handler,
  className,
  style,
}: {
  handler: HandlerWithSetPrompt;
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
      className={className}
      style={style}
    ></textarea>
  );
}