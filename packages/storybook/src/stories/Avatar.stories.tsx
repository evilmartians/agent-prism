import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar, AvatarSource } from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Controls,
  Stories,
  Source,
} from "@storybook/blocks";

const meta = {
  title: "Atoms/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
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
  },
  tags: ["autodocs"],
  argTypes: {
    src: {
      control: "text",
      description: "The image source for the avatar",
    },
    alt: {
      control: "text",
      description: "The alt text for the avatar",
    },
    size: {
      control: { type: "select" },
      options: ["4", "6", "8", "9", "10", "11", "12", "16"],
      description: "The size of the avatar",
      defaultValue: "8",
    },
    letter: {
      control: "text",
      description:
        "Custom letter to display (will use first letter of alt if not provided)",
    },
    rounded: {
      control: { type: "select" },
      options: ["none", "sm", "md", "lg", "full"],
      description: "The border radius of the avatar",
      defaultValue: "full",
    },
    category: {
      control: { type: "select" },
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
      description: "The category of the span which avatar is associated with",
      defaultValue: "llm_call",
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: "https://i.pravatar.cc/150?img=3",
    alt: "Sarah Johnson",
    category: "llm_call",
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
    letter: "JD",
    alt: "John Doe",
    category: "agent_invocation",
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
    src: "that-does-not-exist.jpg",
    category: "unknown",
  },
};
