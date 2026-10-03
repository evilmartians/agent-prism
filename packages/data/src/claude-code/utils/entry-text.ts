import type {
  ClaudeCodeAssistantEntry,
  ClaudeCodeToolUseBlock,
  ClaudeCodeUserEntry,
} from "@evilmartians/agent-prism-types";

import { blocksOf, isRecord, isTextBlock, isThinkingBlock } from "./guards.js";

const TITLE_MAX_LENGTH = 80;

// Input fields that say what a tool call is about, the most telling first.
const TOOL_HINT_KEYS = [
  "file_path",
  "notebook_path",
  "pattern",
  "query",
  "url",
  "skill",
  "subagent_type",
  "path",
];

const TOOL_PATH_KEYS = new Set(["file_path", "notebook_path", "path"]);

const joinParts = (parts: string[]): string | undefined =>
  parts.length > 0 ? parts.join("\n\n") : undefined;

/** The text blocks among `blocks`, joined; undefined when there are none. */
export const textOfBlocks = (blocks: readonly unknown[]): string | undefined =>
  joinParts(blocks.filter(isTextBlock).map((block) => block.text));

/**
 * The thinking blocks among `blocks`, joined; undefined when there are none.
 * An empty string means the thinking happened but its text was not kept.
 */
export const thinkingOfBlocks = (
  blocks: readonly unknown[],
): string | undefined =>
  joinParts(blocks.filter(isThinkingBlock).map((block) => block.thinking));

/** What a prompt or a response says, whether its content is text or blocks. */
export const entryText = (
  entry: ClaudeCodeAssistantEntry | ClaudeCodeUserEntry,
): string | undefined => {
  const { content } = entry.message;
  const text =
    typeof content === "string" ? content : textOfBlocks(blocksOf(entry));

  return text === "" ? undefined : text;
};

/**
 * A tool result's content as text. It is a string or a list of blocks; anything
 * without text in it (tool references, search results) is kept as JSON.
 */
export const toolResultText = (content: unknown): string | undefined => {
  if (content === undefined || content === null) return undefined;
  if (typeof content === "string") return content;

  const text = Array.isArray(content) ? textOfBlocks(content) : undefined;

  return text ?? JSON.stringify(content, null, 2);
};

/** The first line that says something, cut to the length of a title. */
export const titleFromText = (text: string | undefined): string | undefined => {
  const line = text
    ?.split("\n")
    .map((candidate) => candidate.trim())
    .find((candidate) => candidate !== "");

  if (!line) return undefined;

  return line.length > TITLE_MAX_LENGTH
    ? `${line.slice(0, TITLE_MAX_LENGTH)}…`
    : line;
};

const tagText = (text: string, tag: string): string | undefined => {
  const start = text.indexOf(`<${tag}>`);
  const end = text.indexOf(`</${tag}>`, start);

  if (start === -1 || end === -1) return undefined;

  return text.slice(start + tag.length + 2, end).trim() || undefined;
};

/**
 * A title for a prompt. Claude Code wraps what it submits on the user's behalf
 * in tags (a finished background task, a slash command); such a prompt is
 * titled by what the tags hold rather than by its opening tag.
 */
export const promptTitle = (text: string): string | undefined => {
  const trimmed = text.trimStart();

  if (trimmed.startsWith("<task-notification>")) {
    return titleFromText(tagText(text, "summary")) ?? "Task notification";
  }

  if (trimmed.startsWith("<command-")) {
    const command = [
      tagText(text, "command-name"),
      tagText(text, "command-args"),
    ]
      .filter(Boolean)
      .join(" ");

    if (command) return titleFromText(command);
  }

  return titleFromText(text);
};

const toolHint = (input: Record<string, unknown>): string | undefined => {
  for (const key of TOOL_HINT_KEYS) {
    const value = input[key];

    if (typeof value === "string" && value.trim() !== "") {
      return titleFromText(
        TOOL_PATH_KEYS.has(key)
          ? value.split(/[\\/]/).filter(Boolean).at(-1)
          : value,
      );
    }
  }

  return undefined;
};

/**
 * A tool call is titled by the description the model gave it. Most tools take
 * none, so the fallback is the tool's name and what it was pointed at.
 */
export const toolTitle = (block: ClaudeCodeToolUseBlock): string => {
  const input = isRecord(block.input) ? block.input : {};
  const description =
    typeof input.description === "string"
      ? titleFromText(input.description)
      : undefined;

  if (description) return description;

  const hint = toolHint(input);

  return hint ? `${block.name} ${hint}` : block.name;
};

/**
 * A tool call's input: the command when it runs one, its arguments otherwise.
 * The description is left out, since it is the span's title.
 */
export const toolInput = (
  block: ClaudeCodeToolUseBlock,
): string | undefined => {
  const { input } = block;

  if (input === undefined || input === null) return undefined;
  if (typeof input === "string") return input;
  if (!isRecord(input)) return JSON.stringify(input, null, 2);
  if (typeof input.command === "string" && input.command !== "") {
    return input.command;
  }

  const rest = Object.entries(input).filter(([key]) => key !== "description");

  return rest.length > 0
    ? JSON.stringify(Object.fromEntries(rest), null, 2)
    : undefined;
};
