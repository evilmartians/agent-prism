import type { LangfuseObservation, TraceSpan } from "@evilmartians/agent-prism-types";

import { convertLangfuseObservationToSpanCard } from "./convert-langfuse-observation-to-span-card.ts";

export const convertLangfuseTraceToSpanTree = (observations: LangfuseObservation[]): TraceSpan[] => {
  const spanMap = new Map<string, TraceSpan>();
  const rootSpans: TraceSpan[] = [];

  // First pass: create all span objects
  observations.forEach((observation) => {
    const convertedSpan = convertLangfuseObservationToSpanCard(observation);
    spanMap.set(convertedSpan.id, convertedSpan);
  });

  // Second pass: build parent-child relationships
  observations.forEach((observation) => {
    const convertedSpan = spanMap.get(observation.id)!;
    const parentSpanId = observation.parentObservationId;

    if (parentSpanId) {
      const parent = spanMap.get(parentSpanId);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(convertedSpan);
      }
    } else {
      rootSpans.push(convertedSpan);
    }
  });

  return rootSpans;
};
