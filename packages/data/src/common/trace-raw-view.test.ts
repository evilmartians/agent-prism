import { describe, expect, it } from "vitest";

import { formatBytes, interpretTraceRawResponse } from "./trace-raw-view";

describe("interpretTraceRawResponse", () => {
  it("maps a 200 body response to a body view", () => {
    const view = interpretTraceRawResponse(200, {
      tooLarge: false,
      body: { resourceSpans: [] },
      sizeBytes: 12,
    });

    expect(view.kind).toBe("body");

    if (view.kind === "body") {
      expect(view.sizeBytes).toBe(12);
      expect(view.body).toEqual({ resourceSpans: [] });
    }
  });

  it("maps a 200 too_large response to a too_large view", () => {
    const view = interpretTraceRawResponse(200, {
      tooLarge: true,
      sizeBytes: 2_000_000,
    });

    expect(view.kind).toBe("too_large");
    if (view.kind === "too_large") expect(view.sizeBytes).toBe(2_000_000);
  });

  it("maps a 404 to absent (the trace has no stored original)", () => {
    expect(
      interpretTraceRawResponse(404, { message: "No original payload" }).kind,
    ).toBe("absent");
  });

  it("maps a server error status to an error view", () => {
    expect(interpretTraceRawResponse(500, { message: "boom" }).kind).toBe(
      "error",
    );
  });

  it("maps a 200 with an unexpected shape to an error view", () => {
    expect(interpretTraceRawResponse(200, { unexpected: true }).kind).toBe(
      "error",
    );
  });

  it("maps a 200 tooLarge:false with a missing body to an error view", () => {
    expect(
      interpretTraceRawResponse(200, { tooLarge: false, sizeBytes: 5 }).kind,
    ).toBe("error");
  });
});

describe("formatBytes", () => {
  it("renders bytes / KB / MB compactly", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1536)).toBe("1.5 KB");
    expect(formatBytes(2_000_000)).toBe("1.9 MB");
  });
});
