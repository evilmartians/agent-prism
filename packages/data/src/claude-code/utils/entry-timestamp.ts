import type { ClaudeCodeLogEntry } from "@evilmartians/agent-prism-types";

/** When a record was written; undefined when it does not say. */
export const timestampOf = (entry: ClaudeCodeLogEntry): Date | undefined => {
  if (typeof entry.timestamp !== "string") return undefined;

  const date = new Date(entry.timestamp);

  return Number.isNaN(date.getTime()) ? undefined : date;
};
