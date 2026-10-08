import type { TraceSpan } from "@evilmartians/agent-prism-types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { DetailsView, DetailsViewSource } from "@evilmartians/agent-prism-ui";
import {
  Controls,
  Description,
  Primary,
  Source,
  Stories,
} from "@storybook/addon-docs/blocks";

import { llmSpan } from "../mocks/llm-span";

const meta = {
  argTypes: {
    avatar: {
      description: "Optional avatar configuration for the header",
    },
    className: {
      control: "text",
      description: "Optional className for the root container",
    },
    copyButton: {
      description: "Configuration for the copy button functionality",
    },
    data: {
      description: "The span data to display in the details view",
    },
    defaultTab: {
      control: "text",
      description: "The initially selected tab",
    },
  },
  component: DetailsView,
  parameters: {
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={DetailsViewSource} language="tsx" />
        </>
      ),
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Main Components/DetailsView",
} satisfies Meta<typeof DetailsView>;

const mockSpanData: TraceSpan = {
  ...llmSpan,
  attributes: [
    ...(llmSpan.attributes ?? []),
    {
      key: "llm.max_tokens",
      value: { intValue: "1000" },
    },
    {
      key: "llm.provider",
      value: { stringValue: "openai" },
    },
  ],
};

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
    avatar: {
      alt: "Service Avatar",
      category: "llm_call",
      letter: "US",
    },
    data: mockSpanData,
  },
};

export const CopyButton: Story = {
  args: {
    copyButton: {
      isEnabled: true,
      onCopy: (data) => {
        console.log("Copied:", data);
      },
    },
    data: mockSpanData,
  },
};
