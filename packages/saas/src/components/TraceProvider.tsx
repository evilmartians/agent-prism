"use client";

import type { FC, ReactNode } from "react";

import React, { useEffect, useState } from "react";

import type { TraceState } from "@/context/TraceContext";

import { TraceContext } from "@/context/TraceContext";
import { extractSpans } from "@/services/extract-spans";

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
    const file = files[0];
    if (!file) {
      throw new Error("No file selected");
    }

    const text = await file.text();
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
