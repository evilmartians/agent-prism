import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import {
  collectErrorSpans,
  collectRunErrorEntries,
  collectSpanErrorEntry,
  deriveTraceRunStatus,
  errorCountLabel,
  extractSpanError,
  isRootTraceSpan,
  spanHasErrorSurface,
  traceRunHasErrors,
} from "./extract-span-error";
import {
  formatRunErrorsForAgent,
  formatSpanErrorForAgent,
} from "./format-errors-for-agent";

const makeSpan = (span: Partial<TraceSpan> & Pick<TraceSpan, "id">): TraceSpan => ({
  title: span.id,
  startTime: new Date("2026-06-05T10:00:00.000Z"),
  endTime: new Date("2026-06-05T10:00:01.000Z"),
  duration: 1000,
  type: "span",
  raw: "{}",
  status: "success",
  ...span,
});

// Reads message + nodeName from the normalized `raw` payload.
const rawStatusMessageSpan = makeSpan({
  id: "parser",
  title: "Structured Output Parser",
  status: "error",
  raw: JSON.stringify({
    status: { code: "ERROR", message: "Model output doesn't fit required format" },
    name: "Structured Output Parser",
  }),
});

// No message in `raw` — falls back to the `error.message` attribute.
const errorMessageAttributeSpan = makeSpan({
  id: "tool",
  title: "Weather Tool",
  status: "error",
  raw: "{}",
  attributes: [
    { key: "error.message", value: { stringValue: "Tool timed out after 30s" } },
  ],
});

// OTLP-style exception attributes carry both message and stack.
const otlpExceptionSpan = makeSpan({
  id: "redis",
  title: "Redis connect",
  status: "error",
  raw: "{}",
  attributes: [
    { key: "exception.message", value: { stringValue: "Connection refused: redis:6379" } },
    {
      key: "exception.stacktrace",
      value: { stringValue: "Error\n    at RedisClient.connect (redis.ts:42)" },
    },
  ],
});

// `status.message` provided as an attribute rather than in `raw`.
const statusMessageAttributeSpan = makeSpan({
  id: "rate-limited",
  title: "LLM call",
  status: "error",
  raw: "{}",
  attributes: [
    { key: "status.message", value: { stringValue: "Rate limit exceeded (429)" } },
  ],
});

// Error span with no discoverable message anywhere.
const noMessageErrorSpan = makeSpan({
  id: "mystery",
  title: "Mystery node",
  status: "error",
  raw: "not-json",
});

// A failed run: workflow root → agent → parser, all in error state.
const failedRunSpans: TraceSpan[] = [
  makeSpan({
    id: "workflow",
    title: "Relevancy scoring workflow",
    type: "chain_operation",
    status: "error",
    raw: JSON.stringify({ status: { message: "Run failed" }, name: "Relevancy scoring workflow" }),
    children: [
      makeSpan({
        id: "agent",
        title: "AI Agent",
        type: "agent_invocation",
        status: "error",
        raw: JSON.stringify({ status: { message: "Child node failed" }, name: "AI Agent" }),
        children: [rawStatusMessageSpan],
      }),
    ],
  }),
];

const agentParentSpan = failedRunSpans[0]!.children![0]!;

const singleErrorRunSpans: TraceSpan[] = [
  makeSpan({
    id: "single-workflow",
    title: "Single workflow",
    type: "chain_operation",
    status: "success",
    children: [errorMessageAttributeSpan],
  }),
];

describe("extractSpanError", () => {
  it("reads message and nodeName from the raw status payload", () => {
    const error = extractSpanError(rawStatusMessageSpan);

    expect(error).not.toBeNull();
    expect(error?.message).toBe("Model output doesn't fit required format");
    expect(error?.nodeName).toBe("Structured Output Parser");
    expect(error?.stack).toBeUndefined();
  });

  it("falls back to the error.message attribute", () => {
    expect(extractSpanError(errorMessageAttributeSpan)?.message).toBe(
      "Tool timed out after 30s",
    );
  });

  it("reads nodeName from raw.name over the span title", () => {
    const span = makeSpan({
      id: "renamed",
      title: "renamed", // matches id; distinct from raw.name below
      status: "error",
      raw: JSON.stringify({
        status: { message: "boom" },
        name: "Human-readable node name",
      }),
    });

    expect(extractSpanError(span)?.nodeName).toBe("Human-readable node name");
  });

  it("prefers the raw status message over the error.message attribute", () => {
    const span = makeSpan({
      id: "both",
      title: "Both sources",
      status: "error",
      raw: JSON.stringify({ status: { message: "from raw status" } }),
      attributes: [
        { key: "error.message", value: { stringValue: "from attribute" } },
      ],
    });

    expect(extractSpanError(span)?.message).toBe("from raw status");
  });

  it("reads message from a top-level statusMessage (Langfuse)", () => {
    const span = makeSpan({
      id: "langfuse-obs",
      title: "Langfuse observation",
      status: "error",
      // Langfuse observations expose the error text on `statusMessage`, not a
      // nested `status.message`.
      raw: JSON.stringify({ statusMessage: "Observation failed", name: "Obs" }),
    });

    const error = extractSpanError(span);

    expect(error?.message).toBe("Observation failed");
    expect(error?.nodeName).toBe("Obs");
  });

  it("reads OTLP exception message and stack", () => {
    const error = extractSpanError(otlpExceptionSpan);

    expect(error?.message).toBe("Connection refused: redis:6379");
    expect(error?.stack).toMatch(/RedisClient\.connect/);
  });

  it("preserves stack-trace whitespace verbatim", () => {
    const stack = "\n  at foo (a.ts:1)\n    at bar (b.ts:2)\n";
    const span = makeSpan({
      id: "stack-whitespace",
      status: "error",
      raw: JSON.stringify({ status: { message: "Boom" } }),
      attributes: [{ key: "error.stack", value: { stringValue: stack } }],
    });

    expect(extractSpanError(span)?.stack).toBe(stack);
  });

  it("reads the status.message attribute", () => {
    expect(extractSpanError(statusMessageAttributeSpan)?.message).toBe(
      "Rate limit exceeded (429)",
    );
  });

  it("uses a fallback message when none is present", () => {
    expect(extractSpanError(noMessageErrorSpan)?.message).toBe(
      "Error (no message in span payload)",
    );
  });

  it("ignores an empty/whitespace raw message in favor of an attribute", () => {
    const span = makeSpan({
      id: "blank-raw-message",
      status: "error",
      raw: JSON.stringify({ status: { message: "   " }, name: "Node" }),
      attributes: [
        { key: "error.message", value: { stringValue: "Real failure" } },
      ],
    });

    expect(extractSpanError(span)?.message).toBe("Real failure");
  });

  it("ignores an empty raw name and falls back to the span title", () => {
    const span = makeSpan({
      id: "blank-name",
      title: "Fallback Title",
      status: "error",
      raw: JSON.stringify({ status: { message: "Boom" }, name: "" }),
    });

    expect(extractSpanError(span)?.nodeName).toBe("Fallback Title");
  });

  it("treats a whitespace-only attribute value as absent", () => {
    const span = makeSpan({
      id: "blank-attr",
      status: "error",
      raw: "{}",
      attributes: [{ key: "error.message", value: { stringValue: "   " } }],
    });

    expect(extractSpanError(span)?.message).toBe(
      "Error (no message in span payload)",
    );
  });

  it("returns null for non-error spans", () => {
    expect(extractSpanError(makeSpan({ id: "ok" }))).toBeNull();
  });

  it("never returns a non-string message from a malformed raw payload", () => {
    const objectMessageSpan = makeSpan({
      id: "object-message",
      status: "error",
      raw: JSON.stringify({ status: { message: { text: "nested" } } }),
      attributes: [
        { key: "error.message", value: { stringValue: "Flat message" } },
      ],
    });
    const primitiveRawSpan = makeSpan({
      id: "primitive-raw",
      status: "error",
      raw: JSON.stringify("just a string"),
    });

    expect(typeof extractSpanError(objectMessageSpan)?.message).toBe("string");
    expect(extractSpanError(objectMessageSpan)?.message).toBe("Flat message");
    expect(extractSpanError(primitiveRawSpan)?.message).toBe(
      "Error (no message in span payload)",
    );
  });
});

describe("collectRunErrorEntries", () => {
  it("returns every error span in the tree", () => {
    const entries = collectRunErrorEntries(failedRunSpans);

    expect(entries.map((entry) => entry.span.title)).toEqual([
      "Relevancy scoring workflow",
      "AI Agent",
      "Structured Output Parser",
    ]);
  });
});

describe("collectSpanErrorEntry", () => {
  it("returns only the selected span's error", () => {
    const entry = collectSpanErrorEntry(agentParentSpan);

    expect(entry).not.toBeNull();
    expect(entry?.details.message).toBe("Child node failed");
    expect(entry?.span.title).toBe("AI Agent");
  });
});

describe("collectErrorSpans / traceRunHasErrors", () => {
  it("flattens and filters error spans", () => {
    expect(collectErrorSpans(failedRunSpans)).toHaveLength(3);
    expect(traceRunHasErrors(failedRunSpans)).toBe(true);
    expect(traceRunHasErrors([makeSpan({ id: "ok" })])).toBe(false);
  });
});

describe("isRootTraceSpan", () => {
  it("matches any top-level root span, not only the first", () => {
    const secondRoot = makeSpan({ id: "root-b", title: "Second root" });
    const roots = [failedRunSpans[0]!, secondRoot];

    expect(isRootTraceSpan(failedRunSpans[0]!, roots)).toBe(true);
    expect(isRootTraceSpan(secondRoot, roots)).toBe(true);
    expect(isRootTraceSpan(rawStatusMessageSpan, roots)).toBe(false);
  });
});

describe("spanHasErrorSurface", () => {
  const successRoot = makeSpan({
    id: "surface-root",
    type: "chain_operation",
    status: "success",
    children: [makeSpan({ id: "surface-child", status: "error", raw: "{}" })],
  });

  it("is true for a root whose subtree contains an error", () => {
    expect(spanHasErrorSurface(successRoot, [successRoot])).toBe(true);
  });

  it("is false for a healthy root with no failed descendants", () => {
    const healthy = makeSpan({ id: "healthy-root" });
    expect(spanHasErrorSurface(healthy, [healthy])).toBe(false);
  });

  it("is true for a non-root error span even without the trace", () => {
    const leaf = makeSpan({ id: "leaf", status: "error", raw: "{}" });
    expect(spanHasErrorSurface(leaf, [])).toBe(true);
  });

  it("is false for a non-root healthy span", () => {
    const leaf = makeSpan({ id: "leaf-ok" });
    expect(spanHasErrorSurface(leaf, [successRoot])).toBe(false);
  });
});

describe("deriveTraceRunStatus", () => {
  it("flags a failed run", () => {
    expect(deriveTraceRunStatus(failedRunSpans)).toBe("error");
    expect(deriveTraceRunStatus([makeSpan({ id: "ok" })])).toBe("success");
  });
});

describe("errorCountLabel", () => {
  it("uses singular and plural forms", () => {
    expect(errorCountLabel(1)).toBe("1 error");
    expect(errorCountLabel(3)).toBe("3 errors");
  });
});

describe("format helpers", () => {
  it("formatSpanErrorForAgent includes title and message", () => {
    const details = extractSpanError(rawStatusMessageSpan)!;

    expect(formatSpanErrorForAgent(details)).toBe(
      "# Structured Output Parser\n\nModel output doesn't fit required format",
    );
  });

  it("formatRunErrorsForAgent lists every failed span", () => {
    const text = formatRunErrorsForAgent(collectRunErrorEntries(failedRunSpans));

    expect(text).toMatch(/Failed spans: 3/);
    expect(text).toMatch(/Structured Output Parser/);
    expect(text).toMatch(/Child node failed/);
  });

  it("formatRunErrorsForAgent numbers sections in entry order and includes stacks", () => {
    const root = makeSpan({
      id: "run-root",
      status: "success",
      children: [
        makeSpan({
          id: "first-fail",
          title: "First failure",
          status: "error",
          raw: JSON.stringify({ status: { message: "first boom" } }),
          attributes: [
            {
              key: "exception.stacktrace",
              value: { stringValue: "at first()" },
            },
          ],
        }),
        makeSpan({
          id: "second-fail",
          title: "Second failure",
          status: "error",
          raw: JSON.stringify({ status: { message: "second boom" } }),
        }),
      ],
    });

    const text = formatRunErrorsForAgent(collectRunErrorEntries([root]));

    // Sections are numbered 1..N in traversal order (regression guard for an
    // off-by-one or reversed ordering that substring matching would miss).
    expect(text).toMatch(/## 1\. First failure/);
    expect(text).toMatch(/## 2\. Second failure/);
    expect(text.indexOf("First failure")).toBeLessThan(
      text.indexOf("Second failure"),
    );
    // The run-level export renders stacks, not only the single-span formatter.
    expect(text).toMatch(/Stack:\nat first\(\)/);
  });

  it("formatSpanErrorForAgent includes the stack when present", () => {
    const details = extractSpanError(otlpExceptionSpan)!;
    const text = formatSpanErrorForAgent(details);

    expect(text).toMatch(/Connection refused: redis:6379/);
    expect(text).toMatch(/RedisClient\.connect/);
  });

  it("formatSpanErrorForAgent omits stack section when absent", () => {
    const details = extractSpanError(rawStatusMessageSpan)!;
    const text = formatSpanErrorForAgent(details);

    expect(text).not.toMatch(/Stack/);
  });
});

describe("single error run", () => {
  it("reports one error", () => {
    expect(collectErrorSpans(singleErrorRunSpans)).toHaveLength(1);
    expect(errorCountLabel(collectErrorSpans(singleErrorRunSpans).length)).toBe(
      "1 error",
    );
  });
});
