import type { TraceRecord } from "@evilmartians/agent-prism-types";

import {
  isOpenTelemetryDocument,
  openTelemetrySpanAdapter,
} from "@evilmartians/agent-prism-data";
import { TraceViewer } from "@evilmartians/agent-prism-ui";

import quoTavAgentDataRaw from "./data/quo_tav_agent.json";
import ragEarningsAgentDataRaw from "./data/rag_earnings_agent.json";
import smolDeepResearchAgentDataRaw from "./data/smol_deep_research_agent.json";
import { Layout } from "./Layout";

const EXPORTS: {
  documents: unknown[];
  traceRecord: TraceRecord;
}[] = [
  {
    documents: quoTavAgentDataRaw,
    traceRecord: {
      agentDescription: "research-agent",
      durationMs: 3200,
      id: "quo-tav",
      name: "7a8b9c1d",
      spansCount: 24,
    },
  },
  {
    documents: ragEarningsAgentDataRaw,
    traceRecord: {
      agentDescription: "data-analysis-bot",
      durationMs: 45670,
      id: "rag-earnings",
      name: "f2e3d4c5",
      spansCount: 156,
    },
  },
  {
    documents: smolDeepResearchAgentDataRaw,
    traceRecord: {
      agentDescription: "customer-support-ai",
      durationMs: 2500,
      id: "smol-deep-research",
      name: "9b8a7c6d",
      spansCount: 13,
    },
  },
];

const TRACES = EXPORTS.map(({ documents, traceRecord }) => ({
  spans: openTelemetrySpanAdapter.convertRawDocumentsToSpans(
    documents.filter(isOpenTelemetryDocument),
  ),
  traceRecord,
}));

export const App = () => (
  <Layout>
    <TraceViewer data={TRACES} />
  </Layout>
);
