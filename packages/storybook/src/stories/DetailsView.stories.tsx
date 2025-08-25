import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  DetailsView,
  type TraceSpan,
  DetailsViewSource,
} from "ai-agent-trace-ui-core";

const mockSpanData: TraceSpan = {
  id: "span-llm-001",
  title: "GPT-4 Text Generation",
  startTime: new Date("2024-01-15T10:30:00Z"),
  endTime: new Date("2024-01-15T10:30:03Z"),
  duration: 3000,
  cost: 0.045,
  type: "llm_call",
  raw: JSON.stringify({
    model: "gpt-4",
    prompt: "Generate a creative story about AI",
    temperature: 0.7,
    max_tokens: 1000,
  }),
  attributes: [
    {
      key: "llm.model",
      value: { stringValue: "gpt-4" },
    },
    {
      key: "llm.temperature",
      value: { intValue: "0.7" },
    },
    {
      key: "llm.max_tokens",
      value: { intValue: "1000" },
    },
    {
      key: "llm.provider",
      value: { stringValue: "openai" },
    },
  ],
  tokensCount: 850,
  status: "success",
};

const meta = {
  title: "Components/DetailsView",
  component: DetailsView,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`\`\`tsx
${DetailsViewSource}
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    data: {
      description: "The span data to display in the details view",
    },
    avatar: {
      description: "Optional avatar configuration for the header",
    },
    defaultTab: {
      control: "text",
      description: "The initially selected tab",
    },
    className: {
      control: "text",
      description: "Optional className for the root container",
    },
    copyButton: {
      description: "Configuration for the copy button functionality",
    },
  },
} satisfies Meta<typeof DetailsView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: mockSpanData,
  },
};

export const DefaultTab: Story = {
  args: {
    data: mockSpanData,
    defaultTab: "raw",
  },
};

export const Avatar: Story = {
  args: {
    data: mockSpanData,
    avatar: {
      alt: "Service Avatar",
      bgColor: "indigo",
      letter: "US",
    },
  },
};

export const CopyButton: Story = {
  args: {
    data: mockSpanData,
    copyButton: {
      isEnabled: true,
      onCopy: (data) => console.log("Copied:", data),
    },
  },
};
