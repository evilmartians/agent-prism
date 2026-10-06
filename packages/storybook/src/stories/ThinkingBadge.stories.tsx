import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ThinkingBadge,
  ThinkingBadgeSource,
} from "@evilmartians/agent-prism-ui";
import {
  Controls,
  Description,
  Primary,
  Source,
  Stories,
} from "@storybook/addon-docs/blocks";

const meta = {
  argTypes: {
    className: {
      control: { type: "text" },
      description: "Optional className for additional styling",
    },
  },
  component: ThinkingBadge,
  parameters: {
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
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Atoms/ThinkingBadge",
} satisfies Meta<typeof ThinkingBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
