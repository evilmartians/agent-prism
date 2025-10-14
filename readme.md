# AgentPrism

AgentPrism is an open source library of React components for visualizing traces from AI agents. Agentic traces contain perfect information about an agent’s behavior with every plan, action, and retry. But that information gets lost in a sea of JSON. 

Use AgentPrism and turn traces into clear, visual diagrams for debugging AI agents. Plug in OpenTelemetry data and see your agent’s process unfold: display LLM calls, tool executions, and agent workflows in a hierarchical timeline. 

**⚠️ Alpha Release:** *This library is under active development. APIs may change*.

<img width="1280" height="755" alt="github-cover-screen" src="https://github.com/user-attachments/assets/7fa167ab-aa33-4b18-b6f0-83af9ef5cfba" />

## Storybook

[https://agent-prism-ui.web.app/](https://agent-prism-ui.web.app/)

## Prerequisites

- React 19+
- Tailwind CSS 3
- TypeScript

## Installation

Copy the UI components to your project:

```bash
npx degit evilmartians/agent-prism/packages/ui/src/components src/components/agent-prism
```

Install the data and types packages:

```bash
npm install @evilmartians/agent-prism-data @evilmartians/agent-prism-types
```

Install required UI dependencies:

```bash
npm install @radix-ui/react-collapsible @radix-ui/react-tabs classnames lucide-react react-json-pretty
```

## Quick Start

The simplest way to get started is with the `TraceViewer` component, which provides a complete trace visualization interface:

```tsx
import { TraceViewer } from "./components/agent-prism/TraceViewer";
import { openTelemetrySpanAdapter } from "@evilmartians/agent-prism-data";

function App() {
  return (
    <TraceViewer
      data={[
        {
          traceRecord: yourTraceRecord,
          spans:
            openTelemetrySpanAdapter.convertRawDocumentsToSpans(yourTraceData),
        },
      ]}
    />
  );
}
```

The `TraceViewer` includes:

- **Trace List**: Browse multiple traces
- **Tree View**: Hierarchical span visualization with search and expand/collapse
- **Details Panel**: Inspect individual span attributes
- **Responsive Design**: Works on desktop and mobile

## Custom Layouts

For more control, use individual components to build custom layouts:

```tsx
import { useState } from "react";
import type { TraceRecord, TraceSpan } from "@evilmartians/agent-prism-types";
import { openTelemetrySpanAdapter } from "@evilmartians/agent-prism-data";

import { TraceList } from "./components/agent-prism/TraceList/TraceList";
import { TreeView } from "./components/agent-prism/TreeView";
import { DetailsView } from "./components/agent-prism/DetailsView/DetailsView";

// Mock OpenTelemetryDocument (replace with real data)
const traceData = {
  resourceSpans: [],
};

// Mock traces with all required TraceRecord fields
const traces: TraceRecord[] = [
  {
    id: "1",
    name: "Trace 1",
    spansCount: 0,
    durationMs: 0,
    agentDescription: "Mock trace 1",
  },
  {
    id: "2",
    name: "Trace 2",
    spansCount: 0,
    durationMs: 0,
    agentDescription: "Mock trace 2",
  },
];

export function App() {
  const [selectedTrace, setSelectedTrace] = useState<TraceRecord | undefined>(
    undefined,
  );
  const [selectedSpan, setSelectedSpan] = useState<TraceSpan | undefined>(
    undefined,
  );
  const [expandedSpansIds, setExpandedSpansIds] = useState<string[]>([]);

  const spans = openTelemetrySpanAdapter.convertRawDocumentsToSpans(traceData);

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Traces sidebar */}
      <TraceList
        traces={traces}
        expanded={true}
        onExpandStateChange={() => {}}
        onTraceSelect={setSelectedTrace}
        selectedTrace={selectedTrace}
      />

      {/* Tree view */}
      <TreeView
        spans={spans}
        onSpanSelect={setSelectedSpan}
        selectedSpan={selectedSpan}
        expandedSpansIds={expandedSpansIds}
        onExpandSpansIdsChange={setExpandedSpansIds}
        spanCardViewOptions={{
          expandButton: "inside",
        }}
      />

      {/* Details panel */}
      {selectedSpan && <DetailsView data={selectedSpan} />}
    </div>
  );
}
```

## Data Integration

AgentPrism uses a normalized data format optimized for UI rendering. Transform your trace data using the provided adapters.

All adapters implement the same interface and offer some helpful methods for transforming raw data (Open Telemetry, Langfuse, and so on) and getting some info out of it.

```tsx
import {
  openTelemetrySpanAdapter,
  langfuseSpanAdapter,
} from "@evilmartians/agent-prism-data";

// convert whole documents to TraceSpans (normalized view)
openTelemetrySpanAdapter.convertRawDocumentsToSpans(otlpData);

// convert single span (a.k.a. record, a.k.a. Langfuse observation)
openTelemetrySpanAdapter.convertRawSpanToTraceSpan(otlpData);

// in case you want to use TreeView component
openTelemetrySpanAdapter.convertRawSpansToSpanTree(otlpData);

// get some data for a particular observation/span (e.g. when you loaded one record)
langfuseSpanAdapter.getSpanCategory(observationData);
langfuseSpanAdapter.getSpanCost(observationData);
langfuseSpanAdapter.getSpanDuration(observationData);
langfuseSpanAdapter.getSpanInputOutput(observationData);
langfuseSpanAdapter.getSpanStatus(observationData);
langfuseSpanAdapter.getSpanTokensCount(observationData);
```

### OTLP Format

For OpenTelemetry traces, use the OTLP adapter:

```tsx
import { openTelemetrySpanAdapter } from "@evilmartians/agent-prism-data";

const spans = openTelemetrySpanAdapter.convertRawDocumentsToSpans(otlpDocument);
```

### Langfuse Format

For handling Langfuse observations, use Langfuse adapter

```tsx
import { langfuseSpanAdapter } from "@evilmartians/agent-prism-data";

const spans = langfuseSpanAdapter.convertRawDocumentsToSpans(langfuseDocument);
```

### Expected Data Structure

The UI components expect this data shape:

```tsx
interface TraceViewerData {
  traceRecord: TraceRecord; // Trace metadata (id, timestamp, status)
  spans: TraceSpan[]; // Hierarchical span tree
  badges?: BadgeProps[]; // Optional trace badges
}
```

### Supported Attributes

AgentPrism recognizes standard semantic conventions:

- **OpenTelemetry GenAI**: `gen_ai.*` (model, tokens, costs)
- **OpenInference**: `llm.*`, `retrieval.*`
- **Standard OTEL**: HTTP, database spans
- **Custom**: Add your own attributes like `gen_ai.usage.cost`

### Sample OTLP Input

```json
{
  "resourceSpans": [
    {
      "scopeSpans": [
        {
          "spans": [
            {
              "traceId": "abc123...",
              "spanId": "def456...",
              "name": "openai.chat",
              "attributes": [
                {
                  "key": "gen_ai.request.model",
                  "value": { "stringValue": "gpt-4" }
                },
                {
                  "key": "gen_ai.usage.input_tokens",
                  "value": { "intValue": "150" }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## Component Architecture

```
TraceViewer (complete solution)
├── TraceList (trace selection)
├── TreeView (span hierarchy)
│   ├── SearchInput
│   ├── CollapseAndExpandControls
│   └── Individual span rows
└── DetailsView (span inspection)
```

Use `TraceViewer` for quick setup, or compose individual components for custom layouts.

## Contributing

We welcome contributions to AgentPrism! Please see our [Contribution Guide](CONTRIBUTING.md) for details.
