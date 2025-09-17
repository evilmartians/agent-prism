import type {
  LangfuseObservation,
  TraceSpan,
  TraceSpanCategory,
  TraceSpanStatus,
} from "@evilmartians/agent-prism-types";

import { type InputOutputData } from "@evilmartians/agent-prism-types";

export const convertLangfuseObservationToSpanCard = (
  observation: LangfuseObservation,
  children: TraceSpan[] = [],
): TraceSpan => {
  const duration = calculateDuration(observation);
  const status = mapStatus(observation.statusMessage);
  const tokensCount = getTokensCount(observation);
  const cost = getCost(observation);
  const ioData = getInputOutput();
  const type = getType(observation);

  return {
    id: observation.id,
    title: observation.name,
    type,
    status,
    duration,
    tokensCount,
    raw: JSON.stringify(observation, null, 2),
    cost,
    startTime: new Date(observation.startTime),
    endTime: new Date(observation.endTime),
    children,
    input: ioData.input,
    output: ioData.output,
  };
};

function calculateDuration(observation: LangfuseObservation): number {
  return (
    new Date(observation.endTime).getTime() -
    new Date(observation.startTime).getTime()
  );
}

const mapStatus = (status: string | null | undefined): TraceSpanStatus => {
  switch (status) {
    case "SUCCESS":
      return "success";
    case "ERROR":
      return "error";
    default:
      return "warning";
  }
};

function getTokensCount(observation: LangfuseObservation): number {
  return observation.usageDetails?.total || 0;
}

function getCost(observation: LangfuseObservation): number {
  return observation.costDetails?.total || 0;
}

function getInputOutput(): InputOutputData {
  return {
    input: "",
    output: "",
  };
}

function getType(observation: LangfuseObservation): TraceSpanCategory {
  switch (observation.type) {
    case "GENERATION":
      return "llm_call";
    case "SPAN":
      return "unknown";
    case "TOOL":
      return "tool_execution";
  }
  return "unknown";
}
