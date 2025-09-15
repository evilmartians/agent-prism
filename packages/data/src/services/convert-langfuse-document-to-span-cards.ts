import type {
  LangfuseDocument,
  LangfuseObservation,
  TraceSpan,
} from "@evilmartians/agent-prism-types";

import { convertLangfuseTraceToSpanTree } from "./convert-langfuse-trace-to-span-tree";

export const convertLangfuseDocumentToSpanCards = (
  documents: LangfuseDocument | LangfuseDocument[],
): TraceSpan[] => {
  // Handle both single document and array of documents
  const docArray = Array.isArray(documents) ? documents : [documents];

  // Extract all spans from all documents, resource spans and scope spans
  const allObservations: LangfuseObservation[] = [];

  docArray.forEach((document) => {
    document.observations.forEach((observation) => {
      allObservations.push(observation);
    });
  });

  // Convert the flat array of spans to a tree structure
  return convertLangfuseTraceToSpanTree(allObservations);
};
