import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { createContext } from "react";

export type TraceState = {
  spans: TraceSpan[];
  isLoading: boolean;
  error: string | null;
};

export type TraceContextType = {
  traceState: TraceState;
  uploadTraces: (files: FileList) => Promise<void>;
  clearTraces: () => void;
  clearError: () => void;
};

export const TraceContext = createContext<TraceContextType | undefined>(
  undefined,
);
