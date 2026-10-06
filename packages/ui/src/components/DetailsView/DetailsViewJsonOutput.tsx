import { type FC } from "react";
import JSONPretty from "react-json-pretty";
import colors from "tailwindcss/colors";

import type { ReadonlyProps } from "../ReadonlyProps";

import { agentPrismPrefix } from "../theme";

export type JsonViewerProps = {
  className?: string | undefined;
  content: unknown;
  id: string;
};

export const DetailsViewJsonOutput: FC<ReadonlyProps<JsonViewerProps>> = ({
  className = "",
  content,
  id,
}) => {
  return (
    <JSONPretty
      booleanStyle={`color: ${colors.blue[800]};`}
      className={`overflow-x-hidden rounded-xl p-4 text-left ${className}`}
      data={content}
      id={`json-pretty-${id}`}
      keyStyle={`color: oklch(var(--${agentPrismPrefix}-code-key));`}
      mainStyle={`color: oklch(var(--${agentPrismPrefix}-code-base)); font-size: 12px; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;`}
      stringStyle={`color: oklch(var(--${agentPrismPrefix}-code-string));`}
      valueStyle={`color: oklch(var(--${agentPrismPrefix}-code-number));`}
    />
  );
};
