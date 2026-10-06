import type { TraceSpanStatus } from "@evilmartians/agent-prism-types";
import type { ComponentPropsWithRef, ReactElement } from "react";

import { SpanStatusBadge } from "./SpanStatusBadge";
import { SpanStatusDot } from "./SpanStatusDot";

export type StatusProps = ComponentPropsWithRef<"div"> & {
  status: TraceSpanStatus;
  variant?: StatusVariant | undefined;
};

type StatusVariant = "badge" | "dot";

export const SpanStatus = ({
  status,
  variant = "dot",
  ...rest
}: StatusProps): ReactElement => {
  const title = `Status: ${status}`;

  return (
    <div className="flex size-4 items-center justify-center" {...rest}>
      {variant === "dot" ? (
        <SpanStatusDot status={status} title={title} />
      ) : (
        <SpanStatusBadge status={status} title={title} />
      )}
    </div>
  );
};
