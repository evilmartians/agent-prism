import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { createContext } from "react";

export type TraceContextType = {
  clearError: () => void;
  clearTraces: () => void;
  traceState: TraceState;
  uploadTraces: (files: FileList) => Promise<void>;
};

export type TraceState = {
  error: null | string;
  isLoading: boolean;
  spans: TraceSpan[];
};

export const TraceContext = createContext<TraceContextType | undefined>(
  undefined,
);
