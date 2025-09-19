# @evilmartians/agent-prism-types

TypeScript type definitions and constants for [AgentPrism](https://github.com/evilmartians/agent-prism) - AI agent trace visualization library.

Part of the [AgentPrism](https://github.com/evilmartians/agent-prism) project for visualizing AI agent traces, LLM calls, and tool executions.

## Installation

```bash
npm install @evilmartians/agent-prism-types
```

## Usage

```typescript
// Import types
import type {
  Span,
  TraceSpan,
  SpanAttribute,
  TraceSpanCategory,
  OpenTelemetrySpan,
  OpenTelemetryDocument,
} from "@evilmartians/agent-prism-types";

// Import constants for OpenInference semantic conventions
import {
  OPENINFERENCE_ATTRIBUTES,
  OPENINFERENCE_MAPPINGS,
  OPENTELEMETRY_GENAI_MAPPINGS,
} from "@evilmartians/agent-prism-types";
```

## What's Included

- **Core Types**: `TraceSpan`, `TraceSpanAttribute` - UI-ready span representations
- **Categories**: `TraceSpanCategory` - span categorization (LLM, Tool, Agent, etc.)
- **OpenTelemetry Types**: `OpenTelemetrySpan`, `OpenTelemetryDocument`
- **Langfuse Types**: `LangfuseObservation`, `LangfuseDocument`
- **Semantic Convention Mappings**: Constants for OpenInference, GenAI, and standard OpenTelemetry attributes

## Related Packages

- [`@evilmartians/agent-prism-data`](https://www.npmjs.com/package/@evilmartians/agent-prism-data) - Data transformation utilities
- [AgentPrism UI Components](https://github.com/evilmartians/agent-prism) - React components for visualization

## Documentation

See the main [AgentPrism documentation](https://github.com/evilmartians/agent-prism) and [Storybook](https://agent-prism-ui.web.app/) for complete usage examples and UI components.

## License

MIT © [Evil Martians](https://evilmartians.com)
