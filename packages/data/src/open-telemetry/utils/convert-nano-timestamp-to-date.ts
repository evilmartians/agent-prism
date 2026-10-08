import type { OpenTelemetryUnixNano } from "@evilmartians/agent-prism-types";

export function convertNanoTimestampToDate(nano: OpenTelemetryUnixNano): Date {
  const nanoseconds = BigInt(nano);
  const milliseconds = Number(nanoseconds / BigInt(1_000_000));

  return new Date(milliseconds);
}
