import type { Meta, StoryObj } from "@storybook/react-vite";

import { SpanStatus, SpanStatusSource } from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Controls,
  Stories,
  Source,
} from "@storybook/addon-docs/blocks";

const meta = {
  title: "Atoms/SpanStatus",
  component: SpanStatus,
  parameters: {
    layout: "centered",
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
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: { type: "select" },
      options: ["success", "error", "pending", "warning"],
      description: "The status type to display",
    },
    variant: {
      control: { type: "select" },
      options: ["dot", "badge"],
      description: "Visual variant of the status indicator",
      defaultValue: "dot",
    },
  },
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
  name: "Error",
  args: {
    status: "error",
  },
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
