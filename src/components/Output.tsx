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
  const { output } = handler;

  return (
    <MarkdownPreview
      source={output}
      className={className ?? ""}
      style={style ?? emptyObject}
    />
  );
}
