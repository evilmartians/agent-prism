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

const isOpenTelemetryDocument = (
  value: unknown,
): value is OpenTelemetryDocument =>
  typeof value === "object" &&
  value !== null &&
  "resourceSpans" in value &&
  Array.isArray(value.resourceSpans);

const openTelemetrySpans = (document: unknown): TraceSpan[] =>
  openTelemetrySpanAdapter.convertRawDocumentsToSpans(
    [document].filter(isOpenTelemetryDocument),
  );

const TRACES: {
  spans: TraceSpan[];
  traceRecord: TraceRecord;
}[] = [
  {
    spans: openTelemetrySpans(quoTavAgentDataRaw),
    traceRecord: {
      agentDescription: "research-agent",
      durationMs: 3200,
      id: "quo-tav",
      name: "7a8b9c1d",
      spansCount: 24,
    },
  },
  {
    spans: openTelemetrySpans(ragEarningsAgentDataRaw),
    traceRecord: {
      agentDescription: "data-analysis-bot",
      durationMs: 45670,
      id: "rag-earnings",
      name: "f2e3d4c5",
      spansCount: 156,
    },
  },
  {
    spans: openTelemetrySpans(smolDeepResearchAgentDataRaw),
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
