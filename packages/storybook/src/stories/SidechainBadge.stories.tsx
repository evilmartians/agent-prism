import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  SidechainBadge,
  SidechainBadgeSource,
} from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Controls,
  Stories,
  Source,
} from "@storybook/blocks";

const meta = {
  title: "Atoms/SidechainBadge",
  component: SidechainBadge,
  parameters: {
    layout: "centered",
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={SidechainBadgeSource} language="tsx" />
        </>
      ),
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SidechainBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
