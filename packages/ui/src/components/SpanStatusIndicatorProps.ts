import type { TraceSpanStatus } from "@evilmartians/agent-prism-types";

export type SpanStatusIndicatorProps = {
  status: TraceSpanStatus;
  title: string;
};
