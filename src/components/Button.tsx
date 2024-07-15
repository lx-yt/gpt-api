import { RootLogger } from "@lx-yt/logging";
const logger = RootLogger.getLogger("Button");

import React from "react";

import type { Handler } from "../util/ai";

export function Button({
  handler,
  className,
  style,
}: {
  handler: Handler;
  className?: string;
  style?: React.CSSProperties;
}) {
  logger.debug("Rendering Button...", handler);
  const handleClick = React.useCallback(() => {
    logger.debug("Running handler...");
    handler.run().catch((error: unknown) => {
      logger.error(error as string);
    });
  }, [handler]);

  return (
    <button
      onClick={handleClick}
      className={className}
      style={style}
    >
      Submit
    </button>
  );
}
