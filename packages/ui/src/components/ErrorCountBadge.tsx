import type { ReactElement } from "react";

import { errorCountLabel } from "@evilmartians/agent-prism-data";

import { Badge } from "./Badge";
import { ErrorStatusCircle } from "./ErrorStatusCircle";

export type ErrorCountBadgeProps = {
  /**
   * The number of failed spans to display.
   */
  count: number;
};

/**
 * A transparent, error-accented badge summarizing how many spans failed in a
 * run, e.g. `● 3 errors`. Renders nothing when there are no failures, since
 * "0 errors" with an error accent is misleading. The visible label is the
 * accessible name; the icon is decorative.
 */
export const ErrorCountBadge = ({
  count,
}: ErrorCountBadgeProps): null | ReactElement => {
  if (count <= 0) return null;

  return (
    <Badge
      className="text-agentprism-error border-0 bg-transparent px-0 shadow-none"
      iconStart={<ErrorStatusCircle />}
      label={errorCountLabel(count)}
      size="4"
      unstyled
    />
  );
};
