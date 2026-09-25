import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  DetailsViewCodeViewer,
  DetailsViewCodeViewerSource,
} from "@evilmartians/agent-prism-ui";
import { Description, Primary, Controls, Stories, Source } from "@storybook/blocks";

const meta = {
  title: "Main Components/DetailsViewCodeViewer",
  component: DetailsViewCodeViewer,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Theme-aware syntax highlighting via shiki. Colors are driven by the " +
          "`--agentprism-code-*` CSS tokens, so highlighting follows the active " +
          "light/dark theme. Shiki is a peer dependency loaded lazily on first render.",
      },
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={DetailsViewCodeViewerSource} language="tsx" />
        </>
      ),
    },
  },
  tags: ["autodocs"],
  argTypes: {
    code: { control: "text", description: "The source text to highlight" },
    language: {
      control: "text",
      description: "Explicit shiki language id (wins over filename)",
    },
    filename: {
      control: "text",
      description: "Filename whose extension detects the language",
    },
  },
} satisfies Meta<typeof DetailsViewCodeViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

const JSON_SAMPLE = JSON.stringify(
  {
    model: "gpt-4",
    messages: [{ role: "user", content: "Generate a creative story about AI" }],
    temperature: 0.7,
    max_tokens: 1000,
  },
  null,
  2,
);

const PYTHON_SAMPLE = `def summarize(spans: list[Span]) -> str:
    total = sum(s.duration for s in spans)
    return f"{len(spans)} spans, {total}ms total"
`;

export const Json: Story = {
  args: {
    code: JSON_SAMPLE,
    language: "json",
  },
};

export const Python: Story = {
  args: {
    code: PYTHON_SAMPLE,
    language: "python",
  },
};

export const LanguageFromFilename: Story = {
  args: {
    code: PYTHON_SAMPLE,
    filename: "summarize.py",
  },
};

export const PlainText: Story = {
  args: {
    code: "no language provided — rendered as themed monospace plaintext",
  },
};
