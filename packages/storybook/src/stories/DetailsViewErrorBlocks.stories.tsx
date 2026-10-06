import type { TraceSpan } from "@evilmartians/agent-prism-types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  DetailsViewErrorBlocks,
  DetailsViewErrorBlocksSource,
} from "@evilmartians/agent-prism-ui";
import {
  Controls,
  Description,
  Primary,
  Source,
  Stories,
} from "@storybook/addon-docs/blocks";

const baseSpan = (
  span: Partial<TraceSpan> & Pick<TraceSpan, "id">,
): TraceSpan => ({
  endTime: new Date("2024-01-15T10:30:03Z"),
  raw: ["{}"],
  startTime: new Date("2024-01-15T10:30:00Z"),
  status: "success",
  title: span.id,
  type: "span",
  ...span,
});

const parserSpan = baseSpan({
  id: "span-parser",
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
  type: "tool_execution",
});

const agentSpan = baseSpan({
  children: [parserSpan],
  id: "span-agent",
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

const rootSpan = baseSpan({
  children: [agentSpan],
  id: "span-root",
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

const failedRunSpans: TraceSpan[] = [rootSpan];

const successRootSpan = baseSpan({
  children: [baseSpan({ id: "span-ok-child", title: "Fetch data" })],
  id: "span-ok-root",
  title: "Healthy workflow",
  type: "chain_operation",
});

const exceptionSpan = baseSpan({
  attributes: [
    {
      key: "exception.message",
      value: { stringValue: "Connection refused: redis:6379" },
    },
    {
      key: "exception.stacktrace",
      value: {
        stringValue: [
          "Error: Connection refused: redis:6379",
          "    at RedisClient.connect (/app/node_modules/redis/client.js:142:19)",
          "    at async CacheService.get (/app/src/cache.ts:38:5)",
          "    at async RelevancyScorer.run (/app/src/scorer.ts:21:12)",
        ].join("\n"),
      },
    },
  ],
  id: "span-exception",
  raw: ["{}"],
  status: "error",
  title: "Redis connection",
  type: "tool_execution",
});

const meta = {
  component: DetailsViewErrorBlocks,
  parameters: {
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={DetailsViewErrorBlocksSource} language="tsx" />
        </>
      ),
    },
    layout: "padded",
  },
  tags: ["autodocs"],
  title: "Main Components/DetailsViewErrorBlocks",
} satisfies Meta<typeof DetailsViewErrorBlocks>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Root span selected in a failed run → a collapsible summary listing every
 * failed span in the run.
 */
export const RunErrors: Story = {
  args: {
    allSpans: failedRunSpans,
    span: rootSpan,
  },
};

/**
 * A non-root failed span selected → only that span's own error is shown.
 */
export const SingleSpanError: Story = {
  args: {
    allSpans: failedRunSpans,
    span: parserSpan,
  },
};

/**
 * A successful run renders nothing.
 */
export const NoErrors: Story = {
  args: {
    allSpans: [successRootSpan],
    span: successRootSpan,
  },
};

/**
 * A failed span carrying an exception stack trace — the stack is rendered
 * verbatim in a scrollable block below the message.
 */
export const SpanErrorWithStack: Story = {
  args: {
    allSpans: [],
    span: exceptionSpan,
  },
};
