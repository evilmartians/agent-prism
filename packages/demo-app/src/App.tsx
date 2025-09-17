import type {
  OpenTelemetryDocument,
  TraceRecord,
  TraceSpan,
} from "@evilmartians/agent-prism-types";

import { openTelemetrySpanAdapter } from "@evilmartians/agent-prism-data";
import { TraceViewer } from "@evilmartians/agent-prism-ui";
import { useEffect, useState } from "react";

import quoTavAgentDataRaw from "./data/quo_tav_agent.json";
import ragEarningsAgentDataRaw from "./data/rag_earnings_agent.json";
import smolDeepResearchAgentDataRaw from "./data/smol_deep_research_agent.json";
import { Layout } from "./Layout";

export const App = () => {
  const [data, setData] = useState<
    Array<{
      traceRecord: TraceRecord;
      spans: TraceSpan[];
    }>
  >([]);

  useEffect(() => {
    setData([
      {
        traceRecord: {
          id: "quo-tav",
          name: "7a8b9c1d",
          spansCount: 24,
          durationMs: 3200,
          agentDescription: "research-agent",
        },
        spans: openTelemetrySpanAdapter.convertRawDocumentsToSpans(
          quoTavAgentDataRaw as unknown as OpenTelemetryDocument,
        ),
      },
      {
        traceRecord: {
          id: "rag-earnings",
          name: "f2e3d4c5",
          spansCount: 156,
          durationMs: 45670,
          agentDescription: "data-analysis-bot",
        },
        spans: openTelemetrySpanAdapter.convertRawDocumentsToSpans(
          ragEarningsAgentDataRaw as unknown as OpenTelemetryDocument,
        ),
      },
      {
        traceRecord: {
          id: "smol-deep-research",
          name: "9b8a7c6d",
          spansCount: 13,
          durationMs: 2500,
          agentDescription: "customer-support-ai",
        },
        spans: openTelemetrySpanAdapter.convertRawDocumentsToSpans(
          smolDeepResearchAgentDataRaw as unknown as OpenTelemetryDocument,
        ),
      },
    ]);
  }, []);

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <TraceViewer data={data} />
    </Layout>
  );
};
