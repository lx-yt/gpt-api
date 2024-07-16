import { RootLogger } from "@lx-yt/logging";
const logger = RootLogger.getLogger("Output");

import type { Handler } from "../util/ai";
import MarkdownPreview from "@uiw/react-markdown-preview";

const emptyObject = {};

export function Output({
  handler,
  className,
  style,
}: {
  handler: Handler;
  className?: string;
  style?: React.CSSProperties;
}) {
  logger.debug("Rendering Output...", handler);

  const { output } = handler;

  return (
    <MarkdownPreview
      source={output}
      className={className ?? ""}
      style={style ?? emptyObject}
    />
  );
}
