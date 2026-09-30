import { describe, expect, it } from "vitest";

import { buildContextItem } from "../utils/build-context-item";
import {
  createMockAttachment,
  createMockPrompt,
  createMockSystem,
  mockTimestamp,
} from "../utils/create-mock-claude-code-entry";

const attachmentItem = (
  attachmentType: string,
  payload?: Record<string, unknown>,
) =>
  buildContextItem(
    createMockAttachment({ uuid: "c1", at: 5, attachmentType, payload }),
    "attachment",
  );

describe("buildContextItem", () => {
  it("takes an attachment's text for the content and the rest for metadata", () => {
    expect(
      attachmentItem("hook_success", {
        hookName: "SessionStart:startup",
        content: "ready",
        exitCode: 0,
      }),
    ).toEqual({
      type: "hook_success",
      title: "Hook succeeded: SessionStart:startup",
      content: "ready",
      timestamp: new Date(mockTimestamp(5)),
      metadata: { hookName: "SessionStart:startup", exitCode: 0 },
    });
  });

  it.each([
    ["text", { text: "<total_tokens>9 left</total_tokens>" }],
    ["stdout", { stdout: "<total_tokens>9 left</total_tokens>" }],
  ])("reads the text from the %s field", (_field, payload) => {
    expect(attachmentItem("total_tokens_reminder", payload)).toMatchObject({
      title: "Total tokens reminder",
      content: "<total_tokens>9 left</total_tokens>",
      metadata: undefined,
    });
  });

  it("joins a list of lines", () => {
    expect(
      attachmentItem("deferred_tools_delta", {
        addedLines: ["WebFetch", "WebSearch"],
        removedNames: [],
      }),
    ).toMatchObject({
      title: "Deferred tools delta",
      content: "WebFetch\nWebSearch",
      metadata: { removedNames: [] },
    });
  });

  it("reads a blocking hook's message from where it is nested", () => {
    expect(
      attachmentItem("hook_blocking_error", {
        hookName: "PostToolUse:Edit",
        blockingError: { blockingError: "typecheck failed", command: "gate" },
      }),
    ).toMatchObject({
      title: "Hook blocked: PostToolUse:Edit",
      content: "typecheck failed",
      metadata: { hookName: "PostToolUse:Edit", command: "gate" },
    });
  });

  it("keeps an attachment without text as metadata alone", () => {
    expect(
      attachmentItem("plan_mode", { reminderType: "full", planExists: false }),
    ).toMatchObject({
      title: "Plan mode",
      content: undefined,
      metadata: { reminderType: "full", planExists: false },
    });
    expect(
      attachmentItem("task_reminder", { content: [], itemCount: 0 }),
    ).toMatchObject({
      content: undefined,
      metadata: { content: [], itemCount: 0 },
    });
  });

  it("describes a system record by its subtype", () => {
    expect(
      buildContextItem(
        createMockSystem({
          uuid: "s1",
          subtype: "stop_hook_summary",
          extra: { hookCount: 3, level: "suggestion" },
        }),
        "system",
      ),
    ).toEqual({
      type: "system.stop_hook_summary",
      title: "Stop hook summary",
      content: undefined,
      timestamp: new Date(mockTimestamp(0)),
      metadata: { hookCount: 3, level: "suggestion" },
    });
  });

  it("takes an API error's message for the content", () => {
    expect(
      buildContextItem(
        createMockSystem({
          uuid: "s1",
          subtype: "api_error",
          extra: {
            error: { status: 401, formatted: "401 token revoked" },
            retryAttempt: 1,
          },
        }),
        "system",
      ),
    ).toMatchObject({
      type: "system.api_error",
      title: "Api error",
      content: "401 token revoked",
      metadata: { retryAttempt: 1 },
    });
  });

  it("keeps what a user record said", () => {
    expect(
      buildContextItem(
        createMockPrompt({ uuid: "u1" }),
        "interrupt",
        "[Request interrupted by user]",
      ),
    ).toEqual({
      type: "interrupt",
      title: "Request interrupted by user",
      content: "[Request interrupted by user]",
      timestamp: new Date(mockTimestamp(0)),
    });
  });

  it("still yields an item for a record of an unknown type", () => {
    expect(
      buildContextItem(
        { uuid: "x1", parentUuid: null, type: "brand-new", payload: 1 },
        "unknown",
      ),
    ).toEqual({
      type: "brand-new",
      title: "Brand new",
      timestamp: undefined,
      metadata: { payload: 1 },
    });
  });

  it("falls back to a generic item for an attachment without a payload", () => {
    expect(
      buildContextItem(
        { uuid: "c1", parentUuid: null, type: "attachment" },
        "attachment",
      ),
    ).toMatchObject({ type: "attachment", title: "Attachment" });
  });
});
