import type { DeepReadonly } from "@evilmartians/agent-prism-types";

import type { RunErrorEntry, SpanErrorDetails } from "./extract-span-error.js";

/**
 * Formats a single span error as Markdown suitable for pasting into an AI
 * agent — a title heading followed by the error message.
 */
export const formatSpanErrorForAgent = (
  details: Readonly<SpanErrorDetails>,
): string => {
  const title = details.nodeName;
  const lines = [`# ${title}`, "", details.message];

  if (details.stack !== undefined && details.stack !== "") {
    lines.push("", "Stack:", details.stack);
  }

  return lines.join("\n");
};

/**
 * Formats every failed span in a run as a single Markdown document, one
 * numbered section per error.
 */
export const formatRunErrorsForAgent = (
  entries: readonly DeepReadonly<Pick<RunErrorEntry, "details">>[],
): string => {
  const lines = [
    "# Trace run errors",
    "",
    `Failed spans: ${entries.length}`,
    "",
  ];

  entries.forEach((entry, index) => {
    const { details } = entry;
    const title = details.nodeName;

    lines.push(`## ${index + 1}. ${title}`, "", details.message, "");

    if (details.stack !== undefined && details.stack !== "") {
      lines.push("Stack:", details.stack, "");
    }
  });

  return lines.join("\n").trimEnd();
};
