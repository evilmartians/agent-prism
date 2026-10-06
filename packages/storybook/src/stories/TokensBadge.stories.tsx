import type { Meta, StoryObj } from "@storybook/react-vite";

import { TokensBadge, TokensBadgeSource } from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Controls,
  Stories,
  Source,
} from "@storybook/addon-docs/blocks";

const meta = {
  title: "Atoms/TokensBadge",
  component: TokensBadge,
  parameters: {
    layout: "centered",
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
  },
  tags: ["autodocs"],
  argTypes: {
    tokensCount: {
      control: { type: "number" },
      description: "The number of tokens to display",
      defaultValue: 1500,
    },
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "md"],
      description: "The size of the badge",
      defaultValue: "xs",
    },
  },
} satisfies Meta<typeof TokensBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tokensCount: 1500,
  },
};
