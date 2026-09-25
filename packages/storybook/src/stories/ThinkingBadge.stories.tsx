import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ThinkingBadge,
  ThinkingBadgeSource,
} from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Controls,
  Stories,
  Source,
} from "@storybook/blocks";

const meta = {
  title: "Atoms/ThinkingBadge",
  component: ThinkingBadge,
  parameters: {
    layout: "centered",
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={ThinkingBadgeSource} language="tsx" />
        </>
      ),
    },
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: { type: "text" },
      description: "Optional className for additional styling",
    },
  },
} satisfies Meta<typeof ThinkingBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
