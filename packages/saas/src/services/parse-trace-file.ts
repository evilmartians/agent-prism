import { parseClaudeCodeJSONL } from "@evilmartians/agent-prism-data";

// A trace file is a JSON document, or JSONL with a record per line, which is
// how Claude Code writes its transcripts.
const parseTraceFileText = (text: string): object => {
  try {
    const document: unknown = JSON.parse(text);

    if (typeof document === "object" && document !== null) return document;
  } catch {
    // Not a single JSON document; read it line by line below.
  }

  const records = parseClaudeCodeJSONL(text);

  if (records.length === 0) {
    throw new Error("Invalid file: expected JSON or JSONL content");
  }

  return records;
};

/**
 * Parses uploaded trace files into one payload. A single file is passed on as
 * it is. Several files are flattened into one list: a Claude Code session is a
 * main transcript plus a transcript and a meta file for each of its subagents.
 */
export const parseTraceFilesText = (texts: string[]): object =>
  texts.length === 1
    ? parseTraceFileText(texts[0])
    : texts.map(parseTraceFileText).flat();
