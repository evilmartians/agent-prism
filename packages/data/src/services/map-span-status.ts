import type { StatusCode, TraceSpanStatus } from "@ai-agent-trace-ui/types";

export const mapSpanStatus = (statusCode?: StatusCode): TraceSpanStatus => {
  switch (statusCode) {
    case "STATUS_CODE_OK":
      return "success";
    case "STATUS_CODE_ERROR":
      return "error";
    default:
      return "warning";
  }
};
