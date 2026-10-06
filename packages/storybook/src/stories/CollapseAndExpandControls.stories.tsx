import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ExpandAllButton,
  CollapseAllButton,
  CollapseAllButtonSource,
  ExpandAllButtonSource,
} from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Controls,
  Stories,
  Source,
} from "@storybook/addon-docs/blocks";

// Create a wrapper component for the meta since we have two related components
const ControlsWrapper = () => null;

const meta = {
  title: "Atoms/CollapseAndExpandControls",
  component: ControlsWrapper,
  parameters: {
    layout: "centered",
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={ExpandAllButtonSource} language="tsx" />
          <Source code={CollapseAllButtonSource} language="tsx" />
        </>
      ),
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ControlsWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ExpandAll: Story = {
  render: () => (
    <ExpandAllButton onExpandAll={() => console.log("Expand all clicked")} />
  ),
};

export const CollapseAll: Story = {
  render: () => (
    <CollapseAllButton
      onCollapseAll={() => console.log("Collapse all clicked")}
    />
  ),
};

export const BothControls: Story = {
  render: () => (
    <div className="flex gap-2">
      <ExpandAllButton onExpandAll={() => console.log("Expand all clicked")} />
      <CollapseAllButton
        onCollapseAll={() => console.log("Collapse all clicked")}
      />
    </div>
  ),
};
