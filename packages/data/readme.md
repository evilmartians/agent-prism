# @evilmartians/agent-prism-data

Data transformation utilities for [AgentPrism](https://github.com/evilmartians/agent-prism) - converting OpenTelemetry and Langfuse traces to UI-ready formats for AI agent trace visualization.

Part of the [AgentPrism](https://github.com/evilmartians/agent-prism) project for visualizing AI agent traces, LLM calls, and tool executions.

## Installation

```bash
npm install @evilmartians/agent-prism-data @evilmartians/agent-prism-types
```

Note: This package has a peer dependency on `@evilmartians/agent-prism-types`.

## Usage

```typescript
import {
  openTelemetrySpanAdapter,
  langfuseSpanAdapter,
} from "@evilmartians/agent-prism-data";

// Convert OTLP document to UI-ready spans
const otlpSpans =
  openTelemetrySpanAdapter.convertRawDocumentsToSpans(otlpDocument);

// Convert Langfuse observations to UI-ready spans
const langfuseSpans =
  langfuseSpanAdapter.convertRawDocumentsToSpans(langfuseDocument);

// Build hierarchical tree structure from spans
const tree = openTelemetrySpanAdapter.convertRawSpansToSpanTree(otlpSpans);

// Convert individual span
const spanCard = openTelemetrySpanAdapter.convertRawSpanToTraceSpan(otlpSpan);

// Extract information from spans
const category = openTelemetrySpanAdapter.getSpanCategory(otlpSpan);
const cost = openTelemetrySpanAdapter.getSpanCost(otlpSpan);
const duration = openTelemetrySpanAdapter.getSpanDuration(otlpSpan);
const inputOutput = openTelemetrySpanAdapter.getSpanInputOutput(otlpSpan);
const status = openTelemetrySpanAdapter.getSpanStatus(otlpSpan);
const tokens = openTelemetrySpanAdapter.getSpanTokensCount(otlpSpan);
```

## Features

- **Multiple format support**: Transform OpenTelemetry (OTLP) and Langfuse traces into visualization-ready format
- **Semantic convention support**: Handles OpenInference, GenAI, and standard OpenTelemetry attributes
- **Hierarchical structure**: Build parent-child relationships for tree visualization
- **Timeline calculations**: Calculate durations, offsets, and time ranges
- **Token & cost extraction**: Extract LLM token counts and usage costs from trace spans
- **Input/Output parsing**: Extract prompts and completions from LLM spans

## Related Packages

- [`@evilmartians/agent-prism-types`](https://www.npmjs.com/package/@evilmartians/agent-prism-types) - TypeScript type definitions
- [AgentPrism UI Components](https://github.com/evilmartians/agent-prism) - React components for trace visualization

## Documentation

See the main [AgentPrism documentation](https://github.com/evilmartians/agent-prism) and [Storybook](https://agent-prism-ui.web.app/) for complete usage examples and UI components.

## License

MIT © [Evil Martians](https://evilmartians.com)
