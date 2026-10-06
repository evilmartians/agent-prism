import type { Meta, StoryObj } from "@storybook/react-vite";

import { TokensBadge, TokensBadgeSource } from "@evilmartians/agent-prism-ui";
import {
  Controls,
  Description,
  Primary,
  Source,
  Stories,
} from "@storybook/addon-docs/blocks";

const meta = {
  argTypes: {
    size: {
      control: { type: "select" },
      defaultValue: "xs",
      description: "The size of the badge",
      options: ["xs", "sm", "md"],
    },
    tokensCount: {
      control: { type: "number" },
      defaultValue: 1500,
      description: "The number of tokens to display",
    },
  },
  component: TokensBadge,
  parameters: {
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={TokensBadgeSource} language="tsx" />
        </>
      ),
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Atoms/TokensBadge",
} satisfies Meta<typeof TokensBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tokensCount: 1500,
  },
};
