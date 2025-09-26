import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { createContext } from "react";

export interface TraceState {
  spans: TraceSpan[];
  isLoading: boolean;
  error: string | null;
}

export interface TraceContextType {
  traceState: TraceState;
  uploadTraces: (files: FileList) => Promise<void>;
  clearTraces: () => void;
  clearError: () => void;
}

export const TraceContext = createContext<TraceContextType | undefined>(
  undefined,
);
