import type { Meta, StoryObj } from "@storybook/react-vite";

import { McpBadge, McpBadgeSource } from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Controls,
  Stories,
  Source,
} from "@storybook/blocks";

const meta = {
  title: "Atoms/McpBadge",
  component: McpBadge,
  parameters: {
    layout: "centered",
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={McpBadgeSource} language="tsx" />
        </>
      ),
    },
  },
  tags: ["autodocs"],
  argTypes: {
    servers: {
      control: { type: "text" },
      description: "Optional MCP server name(s); omit for a bare `MCP` label",
    },
  },
} satisfies Meta<typeof McpBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    servers: "filesystem, github",
  },
};

export const NoServers: Story = {
  args: {},
};
