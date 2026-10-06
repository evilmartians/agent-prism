import type { DeepReadonly, TraceSpan } from "@evilmartians/agent-prism-types";

import { createContext } from "react";

export type TraceContextType = {
  clearError: () => void;
  clearTraces: () => void;
  traceState: TraceState;
  uploadTraces: (file: File) => Promise<void>;
};

export type TraceState = DeepReadonly<{
  error: null | string;
  isLoading: boolean;
  spans: TraceSpan[];
}>;

export const TraceContext = createContext<TraceContextType | undefined>(
  undefined,
);
