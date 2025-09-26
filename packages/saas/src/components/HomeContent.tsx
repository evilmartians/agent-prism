"use client";

import { useContext } from "react";

import { Hero } from "@/components/Hero";
import { SimpleTraceViewer } from "@/components/SimpleTraceViewer";
import { TraceContext } from "@/context/TraceContext";

export const HomeContent = () => {
  const traceContext = useContext(TraceContext);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-screen-xl bg-white px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:pt-16 dark:bg-gray-950">
        <Hero />

        {traceContext.traceState &&
          traceContext.traceState.spans.length > 0 && (
            <div className="mt-6 sm:mt-8 lg:mt-6">
              <SimpleTraceViewer spans={traceContext.traceState.spans} />
            </div>
          )}
      </div>
    </div>
  );
};
