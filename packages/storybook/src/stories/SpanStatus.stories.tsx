import type { Meta, StoryObj } from "@storybook/react-vite";

import { SpanStatus, SpanStatusSource } from "@evilmartians/agent-prism-ui";
import {
  Controls,
  Description,
  Primary,
  Source,
  Stories,
} from "@storybook/addon-docs/blocks";

const meta = {
  argTypes: {
    status: {
      control: { type: "select" },
      description: "The status type to display",
      options: ["success", "error", "pending", "warning"],
    },
    variant: {
      control: { type: "select" },
      description: "Visual variant of the status indicator",
      options: ["dot", "badge"],
      table: { defaultValue: { summary: "dot" } },
    },
  },
  component: SpanStatus,
  parameters: {
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={SpanStatusSource} language="tsx" />
        </>
      ),
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Atoms/SpanStatus",
} satisfies Meta<typeof SpanStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    status: "success",
  },
};

export const Variant: Story = {
  args: {
    status: "success",
    variant: "badge",
  },
};

export const ErrorStatus: Story = {
  args: {
    status: "error",
  },
  name: "Error",
};

export const Warning: Story = {
  args: {
    status: "warning",
  },
};

export const Pending: Story = {
  args: {
    status: "pending",
  },
};
