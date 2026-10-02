import type { Meta, StoryObj } from "@storybook/react-vite";

import { SkillBadge, SkillBadgeSource } from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Controls,
  Stories,
  Source,
} from "@storybook/blocks";

const meta = {
  title: "Atoms/SkillBadge",
  component: SkillBadge,
  parameters: {
    layout: "centered",
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={SkillBadgeSource} language="tsx" />
        </>
      ),
    },
  },
  tags: ["autodocs"],
  argTypes: {
    skillName: {
      control: { type: "text" },
      description: "The name of the skill invoked",
    },
  },
} satisfies Meta<typeof SkillBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    skillName: "web-search",
  },
};
