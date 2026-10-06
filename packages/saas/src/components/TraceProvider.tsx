"use client";

import type { FC, ReactNode } from "react";

import React, { useState } from "react";

import type { TraceState } from "@/context/TraceContext";

import { TraceContext } from "@/context/TraceContext";
import { extractSpans } from "@/services/extract-spans";

import testData from "../data/test.json";

const toTraceState = (data: object): TraceState => {
  try {
    const spans = extractSpans(data);

    if (spans.length === 0) {
      throw new Error("No spans found");
    }

    return { spans, isLoading: false, error: null };
  } catch (error) {
    return {
      spans: [],
      isLoading: false,
      error: error instanceof Error ? error.message : "Failed to load",
    };
  }
};

export const TraceProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [traceState, setTraceState] = useState<TraceState>(() =>
    toTraceState(testData),
  );

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

    setTraceState(toTraceState(jsonData));
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
