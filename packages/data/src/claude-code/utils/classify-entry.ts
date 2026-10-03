import type {
  ClaudeCodeAssistantEntry,
  ClaudeCodeLogEntry,
  ClaudeCodeToolResultBlock,
  ClaudeCodeUserEntry,
} from "@evilmartians/agent-prism-types";

import { entryText } from "./entry-text.js";
import {
  blocksOf,
  isAssistantEntry,
  isToolResultBlock,
  isUserEntry,
} from "./guards.js";

/** The model name on assistant records that Claude Code wrote itself. */
export const SYNTHETIC_MODEL = "<synthetic>";

const INTERRUPT_MARKER = "[Request interrupted by user";

const LOCAL_COMMAND_OUTPUT = /^\s*<local-command-(?:stdout|stderr|caveat)>/;

export type ClaudeCodeContextKind =
  | "attachment"
  | "compact_summary"
  | "interrupt"
  | "local_command"
  | "meta"
  | "synthetic"
  | "system"
  | "unknown";

/**
 * What a record is to the span tree:
 *
 * - `prompt` opens a turn;
 * - `assistant` is one record of an API response;
 * - `tool_result` answers an earlier tool call;
 * - `context` never becomes a span and is added to the span it follows;
 * - `link` only keeps the chain connected.
 */
export type ClaudeCodeEntryClass =
  | { kind: "assistant"; entry: ClaudeCodeAssistantEntry }
  | {
      kind: "context";
      entry: ClaudeCodeLogEntry;
      contextKind: ClaudeCodeContextKind;
      text?: string;
    }
  | { kind: "link"; entry: ClaudeCodeLogEntry }
  | { kind: "prompt"; entry: ClaudeCodeUserEntry; text: string }
  | {
      kind: "tool_result";
      entry: ClaudeCodeUserEntry;
      results: ClaudeCodeToolResultBlock[];
    };

// Tool results, interrupt markers and local command output are all written as
// user records, so a user record is a prompt only when it is none of those.
const classifyUserEntry = (
  entry: ClaudeCodeUserEntry,
): ClaudeCodeEntryClass => {
  const results = blocksOf(entry).filter(isToolResultBlock);

  if (results.length > 0) return { kind: "tool_result", entry, results };

  const text = entryText(entry) ?? "";
  const context = (
    contextKind: ClaudeCodeContextKind,
  ): ClaudeCodeEntryClass => ({
    kind: "context",
    entry,
    contextKind,
    text,
  });

  if (text.startsWith(INTERRUPT_MARKER)) return context("interrupt");
  if (entry.isCompactSummary === true) return context("compact_summary");
  if (entry.isMeta === true) return context("meta");
  if (LOCAL_COMMAND_OUTPUT.test(text)) return context("local_command");

  return { kind: "prompt", entry, text };
};

export const classifyEntry = (
  entry: ClaudeCodeLogEntry,
): ClaudeCodeEntryClass => {
  if (isUserEntry(entry)) return classifyUserEntry(entry);

  if (isAssistantEntry(entry)) {
    // When a session resumes after an interrupt, Claude Code fills the open
    // turn with a synthetic message. No model was called for it.
    return entry.message.model === SYNTHETIC_MODEL &&
      entry.isApiErrorMessage !== true
      ? {
          kind: "context",
          entry,
          contextKind: "synthetic",
          text: entryText(entry),
        }
      : { kind: "assistant", entry };
  }

  if (entry.type === "attachment") {
    return { kind: "context", entry, contextKind: "attachment" };
  }

  if (entry.type === "system") {
    return { kind: "context", entry, contextKind: "system" };
  }

  // Older versions report hook, shell and subagent progress as records of the
  // chain, many per tool call. They carry nothing a span needs.
  if (entry.type === "progress") return { kind: "link", entry };

  return { kind: "context", entry, contextKind: "unknown" };
};
