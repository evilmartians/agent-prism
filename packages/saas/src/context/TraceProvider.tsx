"use client";

import type {
  OpenTelemetryDocument,
  LangfuseDocument,
  TraceSpan,
} from "@evilmartians/agent-prism-types";

import {
  openTelemetrySpanAdapter,
  langfuseSpanAdapter,
} from "@evilmartians/agent-prism-data";
import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  FC,
} from "react";

import testData from "../data/test.json";

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

function hasProperty<T extends string>(
  obj: object,
  prop: T,
): obj is Record<T, unknown> {
  return prop in obj;
}

function isValidTraceSpan(item: unknown): item is TraceSpan {
  return (
    typeof item === "object" &&
    item !== null &&
    hasProperty(item, "id") &&
    hasProperty(item, "title") &&
    hasProperty(item, "startTime") &&
    hasProperty(item, "endTime") &&
    hasProperty(item, "duration") &&
    hasProperty(item, "type") &&
    hasProperty(item, "status") &&
    hasProperty(item, "raw")
  );
}

function extractSpans(data: object): TraceSpan[] {
  if (hasProperty(data, "resourceSpans") && Array.isArray(data.resourceSpans)) {
    return openTelemetrySpanAdapter.convertRawDocumentsToSpans(
      data as OpenTelemetryDocument,
    );
  }

  if (
    Array.isArray(data) &&
    data.length > 0 &&
    data.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        hasProperty(item, "resourceSpans") &&
        Array.isArray(item.resourceSpans),
    )
  ) {
    return openTelemetrySpanAdapter.convertRawDocumentsToSpans(
      data as OpenTelemetryDocument[],
    );
  }

  if (hasProperty(data, "trace") || hasProperty(data, "observations")) {
    return langfuseSpanAdapter.convertRawDocumentsToSpans([
      data as LangfuseDocument,
    ]);
  }

  if (Array.isArray(data) && data.length > 0 && data.every(isValidTraceSpan)) {
    return data;
  }

  if (
    hasProperty(data, "spans") &&
    Array.isArray(data.spans) &&
    data.spans.every(isValidTraceSpan)
  ) {
    return data.spans;
  }

  if (
    hasProperty(data, "data") &&
    Array.isArray(data.data) &&
    data.data.every(isValidTraceSpan)
  ) {
    return data.data;
  }

  if (isValidTraceSpan(data)) {
    return [data];
  }

  throw new Error("Invalid trace format. Expected OpenTelemetry or Langfuse.");
}

export const TraceProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [traceState, setTraceState] = useState<TraceState>({
    spans: [],
    isLoading: false,
    error: null,
  });

  const loadSpans = async (data: object) => {
    setTraceState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const spans = extractSpans(data);

      if (spans.length === 0) {
        throw new Error("No spans found");
      }

      setTraceState({ spans, isLoading: false, error: null });
    } catch (error) {
      setTraceState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to load",
      }));
    }
  };

  useEffect(() => {
    if (typeof testData === "object" && testData !== null) {
      loadSpans(testData);
    }
  }, []);

  const uploadTraces = async (files: FileList) => {
    const text = await files[0].text();
    const jsonData = JSON.parse(text);

    if (typeof jsonData !== "object" || jsonData === null) {
      throw new Error("Invalid JSON: expected an object");
    }

    await loadSpans(jsonData);
  };

  const clearTraces = () =>
    setTraceState({ spans: [], isLoading: false, error: null });
  const clearError = () => setTraceState((prev) => ({ ...prev, error: null }));

  return (
    <TraceContext.Provider
      value={{ traceState, uploadTraces, clearTraces, clearError }}
    >
      {children}
    </TraceContext.Provider>
  );
};
