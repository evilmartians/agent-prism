import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ReasoningBadge,
  ReasoningBadgeSource,
} from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Controls,
  Stories,
  Source,
} from "@storybook/blocks";

const meta = {
  title: "Atoms/ReasoningBadge",
  component: ReasoningBadge,
  parameters: {
    layout: "centered",
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={ReasoningBadgeSource} language="tsx" />
        </>
      ),
    },
  },
  tags: ["autodocs"],
  argTypes: {
    tokens: {
      control: { type: "number" },
      description: "Reasoning / thinking token count (renders nothing when ≤ 0)",
    },
    size: {
      control: { type: "select" },
      options: ["4", "5", "6", "7"],
      description: "The size of the badge",
    },
  },
} satisfies Meta<typeof ReasoningBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tokens: 512,
  },
};
