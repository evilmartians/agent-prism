import type { Meta, StoryObj } from "@storybook/react-vite";

import { PriceBadge, PriceBadgeSource } from "@evilmartians/agent-prism-ui";
import {
  Controls,
  Description,
  Primary,
  Source,
  Stories,
} from "@storybook/addon-docs/blocks";

const meta = {
  argTypes: {
    cost: {
      control: { type: "number" },
      description: "The cost amount to display",
      table: { defaultValue: { summary: "0.5" } },
    },
    size: {
      control: { type: "select" },
      description: "The size of the badge",
      options: ["xs", "sm", "md"],
      table: { defaultValue: { summary: "xs" } },
    },
  },
  component: PriceBadge,
  parameters: {
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={PriceBadgeSource} language="tsx" />
        </>
      ),
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Atoms/PriceBadge",
} satisfies Meta<typeof PriceBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cost: 0.5,
  },
};
