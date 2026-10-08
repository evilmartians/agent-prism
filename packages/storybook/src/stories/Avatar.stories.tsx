import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar, AvatarSource } from "@evilmartians/agent-prism-ui";
import {
  Controls,
  Description,
  Primary,
  Source,
  Stories,
} from "@storybook/addon-docs/blocks";

const meta = {
  argTypes: {
    alt: {
      control: "text",
      description: "The alt text for the avatar",
    },
    category: {
      control: { type: "select" },
      description: "The category of the span which avatar is associated with",
      options: [
        "llm_call",
        "tool_execution",
        "agent_invocation",
        "chain_operation",
        "retrieval",
        "embedding",
        "create_agent",
        "span",
        "event",
        "guardrail",
        "unknown",
      ],
      table: { defaultValue: { summary: "llm_call" } },
    },
    letter: {
      control: "text",
      description:
        "Custom letter to display (will use first letter of alt if not provided)",
    },
    rounded: {
      control: { type: "select" },
      description: "The border radius of the avatar",
      options: ["none", "sm", "md", "lg", "full"],
      table: { defaultValue: { summary: "full" } },
    },
    size: {
      control: { type: "select" },
      description: "The size of the avatar",
      options: ["4", "6", "8", "9", "10", "11", "12", "16"],
      table: { defaultValue: { summary: "8" } },
    },
    src: {
      control: "text",
      description: "The image source for the avatar",
    },
  },
  component: Avatar,
  parameters: {
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={AvatarSource} language="tsx" />
        </>
      ),
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Atoms/Avatar",
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    alt: "Sarah Johnson",
    category: "llm_call",
    src: "https://i.pravatar.cc/150?img=3",
  },
};

export const Size: Story = {
  args: {
    alt: "Large",
    category: "llm_call",
    size: "16",
  },
};

export const Letter: Story = {
  args: {
    alt: "John Doe",
    category: "agent_invocation",
    letter: "JD",
  },
};

export const BgColor: Story = {
  args: {
    alt: "Red Avatar",
    category: "guardrail",
  },
};

export const TextColor: Story = {
  args: {
    alt: "Black Text",
    category: "tool_execution",
  },
};

export const Rounded: Story = {
  args: {
    alt: "Square",
    category: "chain_operation",
    rounded: "none",
  },
};

export const FailedToLoad: Story = {
  args: {
    alt: "Failed to load",
    category: "unknown",
    src: "that-does-not-exist.jpg",
  },
};
