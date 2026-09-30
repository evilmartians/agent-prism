import type {
  ClaudeCodeLogEntry,
  TraceSpanContextItem,
} from "@evilmartians/agent-prism-types";

import type { ClaudeCodeContextKind } from "./classify-entry.js";

import { timestampOf } from "./entry-timestamp.js";
import { isAttachmentEntry, isRecord } from "./guards.js";

// Fields every record of the chain has. They say where the record sits, not
// what it carries, so they are left out of an item's metadata.
const ENVELOPE_KEYS = [
  "uuid",
  "parentUuid",
  "logicalParentUuid",
  "type",
  "timestamp",
  "sessionId",
  "version",
  "gitBranch",
  "cwd",
  "slug",
  "userType",
  "entrypoint",
  "isSidechain",
  "agentId",
  "isMeta",
];

// Attachment fields that hold the injected text, the most likely first.
const TEXT_KEYS = ["content", "text", "stdout", "addedLines", "addedBlocks"];

const HOOK_TITLES: Record<string, string> = {
  async_hook_response: "Hook response",
  hook_additional_context: "Hook context",
  hook_blocking_error: "Hook blocked",
  hook_success: "Hook succeeded",
};

const TEXT_ITEM_TITLES: Partial<Record<ClaudeCodeContextKind, string>> = {
  compact_summary: "Compaction summary",
  interrupt: "Request interrupted by user",
  local_command: "Local command output",
  meta: "Meta message",
  synthetic: "Synthetic assistant message",
};

const humanize = (name: string): string => {
  const words = name.replace(/[_-]+/g, " ").trim();

  return words === "" ? name : words.charAt(0).toUpperCase() + words.slice(1);
};

const omit = (
  record: Record<string, unknown>,
  keys: string[],
): Record<string, unknown> | undefined => {
  const rest = Object.entries(record).filter(([key]) => !keys.includes(key));

  return rest.length > 0 ? Object.fromEntries(rest) : undefined;
};

const textOf = (value: unknown): string | undefined => {
  if (typeof value === "string") return value === "" ? undefined : value;

  return Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === "string")
    ? value.join("\n")
    : undefined;
};

const attachmentItem = (
  payload: Record<string, unknown> & { type: string },
): TraceSpanContextItem => {
  const { type } = payload;
  const hookTitle = HOOK_TITLES[type];
  const title =
    hookTitle === undefined
      ? humanize(type)
      : [hookTitle, textOf(payload.hookName)].filter(Boolean).join(": ");

  // A blocking hook nests its message one level down, next to its command.
  const blocking = payload.blockingError;

  if (isRecord(blocking) && textOf(blocking.blockingError) !== undefined) {
    return {
      type,
      title,
      content: textOf(blocking.blockingError),
      metadata: omit({ ...payload, ...blocking }, ["type", "blockingError"]),
    };
  }

  const textKey = TEXT_KEYS.find((key) => textOf(payload[key]) !== undefined);

  return {
    type,
    title,
    content: textKey === undefined ? undefined : textOf(payload[textKey]),
    metadata: omit(
      payload,
      textKey === undefined ? ["type"] : ["type", textKey],
    ),
  };
};

const systemItem = (fields: Record<string, unknown>): TraceSpanContextItem => {
  const subtype = textOf(fields.subtype) ?? "unknown";
  const error = isRecord(fields.error) ? fields.error : undefined;

  return {
    type: `system.${subtype}`,
    title: humanize(subtype),
    content:
      textOf(error?.formatted) ??
      textOf(error?.message) ??
      textOf(fields.content),
    metadata: omit(fields, [...ENVELOPE_KEYS, "subtype", "content"]),
  };
};

/**
 * Turns a record that never becomes a span into the context item its parent
 * span gets. Whatever the record holds besides its text goes into the item's
 * metadata, so nothing of it is lost. Records of an unknown kind or shape still
 * yield an item.
 */
export const buildContextItem = (
  entry: ClaudeCodeLogEntry,
  kind: ClaudeCodeContextKind,
  text?: string,
): TraceSpanContextItem => {
  const timestamp = timestampOf(entry);
  const fields: Record<string, unknown> = entry;

  if (kind === "attachment" && isAttachmentEntry(entry)) {
    return { ...attachmentItem(entry.attachment), timestamp };
  }

  if (kind === "system") return { ...systemItem(fields), timestamp };

  const title = TEXT_ITEM_TITLES[kind];

  if (title !== undefined) {
    return { type: kind, title, content: text || undefined, timestamp };
  }

  return {
    type: entry.type,
    title: humanize(entry.type),
    timestamp,
    metadata: omit(fields, ENVELOPE_KEYS),
  };
};
