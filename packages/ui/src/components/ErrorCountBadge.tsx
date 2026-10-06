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
 * run, e.g. `● 3 errors`.
 */
export const ErrorCountBadge = ({
  count,
}: ErrorCountBadgeProps): null | ReactElement => {
  // A badge that reads "0 errors" with an error accent is misleading; render
  // nothing when there are no failures.
  if (count <= 0) return null;

  // The visible "N errors" label is the accessible name; the icon is decorative.
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
