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
  const handleClick = React.useCallback(() => {
    handler.run();
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
