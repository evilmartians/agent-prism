import { isLogEntry } from "./guards.js";

/**
 * Whether parsed data is a Claude Code transcript: a record of the
 * conversation chain, or a list that holds at least one. Not every item has to
 * match, because a transcript mixes those records with metadata ones (queue
 * operations, titles, subagent meta files).
 */
export const isClaudeCodeTranscript = (data: unknown): boolean => {
  const records: unknown[] = Array.isArray(data) ? data : [data];

  return records.some((record) => isLogEntry(record) && "parentUuid" in record);
};
