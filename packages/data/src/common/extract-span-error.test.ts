import type { DeepReadonly, TraceSpan } from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import {
  collectErrorSpans,
  collectRunErrorEntries,
  collectSpanErrorEntry,
  deriveTraceRunStatus,
  errorCountLabel,
  extractSpanError,
  isRootTraceSpan,
  type SpanErrorDetails,
  spanHasErrorSurface,
  traceRunHasErrors,
} from "./extract-span-error.js";
import {
  formatRunErrorsForAgent,
  formatSpanErrorForAgent,
} from "./format-errors-for-agent.js";

type ReadonlySpan = DeepReadonly<TraceSpan>;

const makeSpan = (
  span: DeepReadonly<Partial<TraceSpan> & Pick<TraceSpan, "id">>,
): ReadonlySpan => ({
  endTime: new Date("2026-06-05T10:00:01.000Z"),
  raw: ["{}"],
  startTime: new Date("2026-06-05T10:00:00.000Z"),
  status: "success",
  title: span.id,
  type: "span",
  ...span,
});

const rawStatusMessageSpan = makeSpan({
  id: "parser",
  raw: [
    JSON.stringify({
      name: "Structured Output Parser",
      status: {
        code: "ERROR",
        message: "Model output doesn't fit required format",
      },
    }),
  ],
  status: "error",
  title: "Structured Output Parser",
});

const errorMessageAttributeSpan = makeSpan({
  attributes: [
    {
      key: "error.message",
      value: { stringValue: "Tool timed out after 30s" },
    },
  ],
  id: "tool",
  raw: ["{}"],
  status: "error",
  title: "Weather Tool",
});

const otlpExceptionSpan = makeSpan({
  attributes: [
    {
      key: "exception.message",
      value: { stringValue: "Connection refused: redis:6379" },
    },
    {
      key: "exception.stacktrace",
      value: { stringValue: "Error\n    at RedisClient.connect (redis.ts:42)" },
    },
  ],
  id: "redis",
  raw: ["{}"],
  status: "error",
  title: "Redis connect",
});

const statusMessageAttributeSpan = makeSpan({
  attributes: [
    {
      key: "status.message",
      value: { stringValue: "Rate limit exceeded (429)" },
    },
  ],
  id: "rate-limited",
  raw: ["{}"],
  status: "error",
  title: "LLM call",
});

const noMessageErrorSpan = makeSpan({
  id: "mystery",
  raw: ["not-json"],
  status: "error",
  title: "Mystery node",
});

const agentParentSpan = makeSpan({
  children: [rawStatusMessageSpan],
  id: "agent",
  raw: [
    JSON.stringify({
      name: "AI Agent",
      status: { message: "Child node failed" },
    }),
  ],
  status: "error",
  title: "AI Agent",
  type: "agent_invocation",
});

const workflowRootSpan = makeSpan({
  children: [agentParentSpan],
  id: "workflow",
  raw: [
    JSON.stringify({
      name: "Relevancy scoring workflow",
      status: { message: "Run failed" },
    }),
  ],
  status: "error",
  title: "Relevancy scoring workflow",
  type: "chain_operation",
});

const failedRunSpans: readonly ReadonlySpan[] = [workflowRootSpan];

const extractDefinedSpanError = (span: ReadonlySpan): SpanErrorDetails => {
  const details = extractSpanError(span);

  if (!details) throw new Error(`Span ${span.id} has no error details`);

  return details;
};

const singleErrorRunSpans: readonly ReadonlySpan[] = [
  makeSpan({
    children: [errorMessageAttributeSpan],
    id: "single-workflow",
    status: "success",
    title: "Single workflow",
    type: "chain_operation",
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
      raw: [
        JSON.stringify({
          name: "Human-readable node name",
          status: { message: "boom" },
        }),
      ],
      status: "error",
      title: "renamed",
    });

    expect(extractSpanError(span)?.nodeName).toBe("Human-readable node name");
  });

  it("prefers the raw status message over the error.message attribute", () => {
    const span = makeSpan({
      attributes: [
        { key: "error.message", value: { stringValue: "from attribute" } },
      ],
      id: "both",
      raw: [JSON.stringify({ status: { message: "from raw status" } })],
      status: "error",
      title: "Both sources",
    });

    expect(extractSpanError(span)?.message).toBe("from raw status");
  });

  it("reads message and nodeName across several raw records", () => {
    const span = makeSpan({
      id: "multi-record",
      raw: [
        JSON.stringify({ name: "Start event" }),
        "not-json",
        JSON.stringify({ status: { message: "Failed at the end" } }),
      ],
      status: "error",
      title: "Multi-record span",
    });

    const error = extractSpanError(span);

    expect(error?.message).toBe("Failed at the end");
    expect(error?.nodeName).toBe("Start event");
  });

  it("reads message from a top-level statusMessage (Langfuse)", () => {
    const span = makeSpan({
      id: "langfuse-obs",
      raw: [
        JSON.stringify({ name: "Obs", statusMessage: "Observation failed" }),
      ],
      status: "error",
      title: "Langfuse observation",
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
      attributes: [{ key: "error.stack", value: { stringValue: stack } }],
      id: "stack-whitespace",
      raw: [JSON.stringify({ status: { message: "Boom" } })],
      status: "error",
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
      attributes: [
        { key: "error.message", value: { stringValue: "Real failure" } },
      ],
      id: "blank-raw-message",
      raw: [JSON.stringify({ name: "Node", status: { message: "   " } })],
      status: "error",
    });

    expect(extractSpanError(span)?.message).toBe("Real failure");
  });

  it("ignores an empty raw name and falls back to the span title", () => {
    const span = makeSpan({
      id: "blank-name",
      raw: [JSON.stringify({ name: "", status: { message: "Boom" } })],
      status: "error",
      title: "Fallback Title",
    });

    expect(extractSpanError(span)?.nodeName).toBe("Fallback Title");
  });

  it("treats a whitespace-only attribute value as absent", () => {
    const span = makeSpan({
      attributes: [{ key: "error.message", value: { stringValue: "   " } }],
      id: "blank-attr",
      raw: ["{}"],
      status: "error",
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
      attributes: [
        { key: "error.message", value: { stringValue: "Flat message" } },
      ],
      id: "object-message",
      raw: [JSON.stringify({ status: { message: { text: "nested" } } })],
      status: "error",
    });
    const primitiveRawSpan = makeSpan({
      id: "primitive-raw",
      raw: [JSON.stringify("just a string")],
      status: "error",
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

    expect(entries.map((entry) => entry.span.title)).toStrictEqual([
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
    const roots = [workflowRootSpan, secondRoot];

    expect(isRootTraceSpan(workflowRootSpan, roots)).toBe(true);
    expect(isRootTraceSpan(secondRoot, roots)).toBe(true);
    expect(isRootTraceSpan(rawStatusMessageSpan, roots)).toBe(false);
  });
});

describe("spanHasErrorSurface", () => {
  const successRoot = makeSpan({
    children: [makeSpan({ id: "surface-child", raw: ["{}"], status: "error" })],
    id: "surface-root",
    status: "success",
    type: "chain_operation",
  });

  it("is true for a root whose subtree contains an error", () => {
    expect(spanHasErrorSurface(successRoot, [successRoot])).toBe(true);
  });

  it("is false for a healthy root with no failed descendants", () => {
    const healthy = makeSpan({ id: "healthy-root" });
    expect(spanHasErrorSurface(healthy, [healthy])).toBe(false);
  });

  it("is true for a non-root error span even without the trace", () => {
    const leaf = makeSpan({ id: "leaf", raw: ["{}"], status: "error" });
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
    const details = extractDefinedSpanError(rawStatusMessageSpan);

    expect(formatSpanErrorForAgent(details)).toBe(
      "# Structured Output Parser\n\nModel output doesn't fit required format",
    );
  });

  it("formatRunErrorsForAgent lists every failed span", () => {
    const text = formatRunErrorsForAgent(
      collectRunErrorEntries(failedRunSpans),
    );

    expect(text).toMatch(/Failed spans: 3/);
    expect(text).toMatch(/Structured Output Parser/);
    expect(text).toMatch(/Child node failed/);
  });

  it("formatRunErrorsForAgent numbers sections in entry order and includes stacks", () => {
    const root = makeSpan({
      children: [
        makeSpan({
          attributes: [
            {
              key: "exception.stacktrace",
              value: { stringValue: "at first()" },
            },
          ],
          id: "first-fail",
          raw: [JSON.stringify({ status: { message: "first boom" } })],
          status: "error",
          title: "First failure",
        }),
        makeSpan({
          id: "second-fail",
          raw: [JSON.stringify({ status: { message: "second boom" } })],
          status: "error",
          title: "Second failure",
        }),
      ],
      id: "run-root",
      status: "success",
    });

    const text = formatRunErrorsForAgent(collectRunErrorEntries([root]));

    expect(text).toMatch(/## 1\. First failure/);
    expect(text).toMatch(/## 2\. Second failure/);
    expect(text.indexOf("First failure")).toBeLessThan(
      text.indexOf("Second failure"),
    );
    expect(text).toMatch(/Stack:\nat first\(\)/);
  });

  it("formatSpanErrorForAgent includes the stack when present", () => {
    const details = extractDefinedSpanError(otlpExceptionSpan);
    const text = formatSpanErrorForAgent(details);

    expect(text).toMatch(/Connection refused: redis:6379/);
    expect(text).toMatch(/RedisClient\.connect/);
  });

  it("formatSpanErrorForAgent omits stack section when absent", () => {
    const details = extractDefinedSpanError(rawStatusMessageSpan);
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
