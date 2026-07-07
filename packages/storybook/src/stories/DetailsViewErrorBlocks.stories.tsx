import type { TraceSpan } from "@evilmartians/agent-prism-types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  DetailsViewErrorBlocks,
  DetailsViewErrorBlocksSource,
} from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Controls,
  Stories,
  Source,
} from "@storybook/blocks";

const baseSpan = (
  span: Partial<TraceSpan> & Pick<TraceSpan, "id">,
): TraceSpan => ({
  title: span.id,
  startTime: new Date("2024-01-15T10:30:00Z"),
  endTime: new Date("2024-01-15T10:30:03Z"),
  duration: 3000,
  type: "span",
  raw: "{}",
  status: "success",
  ...span,
});

const parserSpan = baseSpan({
  id: "span-parser",
  title: "Structured Output Parser",
  type: "tool_execution",
  status: "error",
  raw: JSON.stringify({
    status: { code: "ERROR", message: "Model output doesn't fit required format" },
    name: "Structured Output Parser",
  }),
});

const agentSpan = baseSpan({
  id: "span-agent",
  title: "AI Agent",
  type: "agent_invocation",
  status: "error",
  raw: JSON.stringify({ status: { message: "Child node failed" }, name: "AI Agent" }),
  children: [parserSpan],
});

const rootSpan = baseSpan({
  id: "span-root",
  title: "Relevancy scoring workflow",
  type: "chain_operation",
  status: "error",
  raw: JSON.stringify({
    status: { message: "Run failed" },
    name: "Relevancy scoring workflow",
  }),
  children: [agentSpan],
});

const failedRunSpans: TraceSpan[] = [rootSpan];

const successRootSpan = baseSpan({
  id: "span-ok-root",
  title: "Healthy workflow",
  type: "chain_operation",
  children: [baseSpan({ id: "span-ok-child", title: "Fetch data" })],
});

const exceptionSpan = baseSpan({
  id: "span-exception",
  title: "Redis connection",
  type: "tool_execution",
  status: "error",
  raw: "{}",
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
});

const meta = {
  title: "Main Components/DetailsView/ErrorBlocks",
  component: DetailsViewErrorBlocks,
  parameters: {
    layout: "padded",
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
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DetailsViewErrorBlocks>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Root span selected in a failed run → a collapsible summary listing every
 * failed span in the run.
 */
export const RunErrors: Story = {
  args: {
    span: rootSpan,
    allSpans: failedRunSpans,
  },
};

/**
 * A non-root failed span selected → only that span's own error is shown.
 */
export const SingleSpanError: Story = {
  args: {
    span: parserSpan,
    allSpans: failedRunSpans,
  },
};

/**
 * A successful run renders nothing.
 */
export const NoErrors: Story = {
  args: {
    span: successRootSpan,
    allSpans: [successRootSpan],
  },
};

/**
 * A failed span carrying an exception stack trace — the stack is rendered
 * verbatim in a scrollable block below the message.
 */
export const SpanErrorWithStack: Story = {
  args: {
    span: exceptionSpan,
    allSpans: [],
  },
};
