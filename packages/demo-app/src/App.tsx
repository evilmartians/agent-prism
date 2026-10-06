import type {
  OpenTelemetryDocument,
  TraceRecord,
  TraceSpan,
} from "@evilmartians/agent-prism-types";

import { openTelemetrySpanAdapter } from "@evilmartians/agent-prism-data";
import { TraceViewer } from "@evilmartians/agent-prism-ui";

import quoTavAgentDataRaw from "./data/quo_tav_agent.json";
import ragEarningsAgentDataRaw from "./data/rag_earnings_agent.json";
import smolDeepResearchAgentDataRaw from "./data/smol_deep_research_agent.json";
import { Layout } from "./Layout";

const TRACES: {
  spans: TraceSpan[];
  traceRecord: TraceRecord;
}[] = [
  {
    spans: openTelemetrySpanAdapter.convertRawDocumentsToSpans(
      quoTavAgentDataRaw as unknown as OpenTelemetryDocument,
    ),
    traceRecord: {
      agentDescription: "research-agent",
      durationMs: 3200,
      id: "quo-tav",
      name: "7a8b9c1d",
      spansCount: 24,
    },
  },
  {
    spans: openTelemetrySpanAdapter.convertRawDocumentsToSpans(
      ragEarningsAgentDataRaw as unknown as OpenTelemetryDocument,
    ),
    traceRecord: {
      agentDescription: "data-analysis-bot",
      durationMs: 45670,
      id: "rag-earnings",
      name: "f2e3d4c5",
      spansCount: 156,
    },
  },
  {
    spans: openTelemetrySpanAdapter.convertRawDocumentsToSpans(
      smolDeepResearchAgentDataRaw as unknown as OpenTelemetryDocument,
    ),
    traceRecord: {
      agentDescription: "customer-support-ai",
      durationMs: 2500,
      id: "smol-deep-research",
      name: "9b8a7c6d",
      spansCount: 13,
    },
  },
];

export const App = () => (
  <Layout>
    <TraceViewer data={TRACES} />
  </Layout>
);
