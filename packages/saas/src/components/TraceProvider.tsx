"use client";

import React, { FC, ReactNode, useEffect, useState } from "react";

import { TraceContext, TraceState } from "@/context/TraceContext";
import { extractSpans } from "@/services/extract-spans";
import { parseTraceFilesText } from "@/services/parse-trace-file";

import testData from "../data/test.json";

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
      setTraceState({
        spans: [],
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to load",
      });
    }
  };

  useEffect(() => {
    if (typeof testData === "object" && testData !== null) {
      loadSpans(testData);
    }
  }, []);

  const uploadTraces = async (files: FileList) => {
    try {
      const texts = await Promise.all(
        Array.from(files).map((file) => file.text()),
      );

      await loadSpans(parseTraceFilesText(texts));
    } catch (error) {
      setTraceState({
        spans: [],
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to load",
      });
    }
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
