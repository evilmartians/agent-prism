import { toolResultText } from "./entry-text.js";
import { isRecord } from "./guards.js";

const ERROR_LINE = /^\s*error\b/i;

// Fields a structured tool result reports a failure in.
const ERROR_FIELDS = ["error", "message", "stderr"];

const nonEmpty = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;

const linesOf = (text: string): string[] =>
  text.split(/\r?\n/).map((line) => line.trim());

/**
 * The error message of a failed tool call.
 *
 * When a tool fails, Claude Code writes `toolUseResult` as text in which every
 * error sits on a line of its own ("Error: Exit code 1"), ahead of whatever the
 * tool printed. Those lines are the message. Without them the whole text is;
 * a structured result is searched for an error field; and the first line of
 * the result content is the last resort.
 */
export const extractToolError = (
  toolUseResult: unknown,
  content: unknown,
): string => {
  const text = nonEmpty(toolUseResult);

  if (text !== undefined) {
    const errorLines = linesOf(text).filter((line) => ERROR_LINE.test(line));

    return errorLines.length > 0 ? errorLines.join("\n") : text;
  }

  if (isRecord(toolUseResult)) {
    for (const field of ERROR_FIELDS) {
      const message = nonEmpty(toolUseResult[field]);

      if (message !== undefined) return message;
    }
  }

  return (
    linesOf(toolResultText(content) ?? "").find((line) => line !== "") ??
    "Tool call failed"
  );
};
