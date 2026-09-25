import type { ReactElement } from "react";

import cn from "classnames";

export interface ErrorStatusCircleProps {
  className?: string;
}

/**
 * A small decorative dot used as the error status glyph next to failed spans.
 */
export const ErrorStatusCircle = ({
  className,
}: ErrorStatusCircleProps): ReactElement => (
  <span
    className={cn(
      "bg-agentprism-error block size-1.5 shrink-0 rounded-full",
      className,
    )}
    aria-hidden
  />
);
