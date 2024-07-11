import type { Handler } from "../util/ai";

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
    <textarea
      value={output}
      readOnly
      className={className}
      style={style}
    ></textarea>
  );
}
