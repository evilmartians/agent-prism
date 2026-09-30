import { describe, expect, it } from "vitest";

import { extractToolError } from "../utils/extract-tool-error";

describe("extractToolError", () => {
  it("takes the error line out of a failed command's result", () => {
    expect(
      extractToolError(
        "Error: Exit code 1\ntotal 28048\ndrwxr-xr-x  26 user  staff",
        "Exit code 1\ntotal 28048\ndrwxr-xr-x  26 user  staff",
      ),
    ).toBe("Error: Exit code 1");
  });

  it("keeps every error, each on its own line", () => {
    expect(
      extractToolError(
        [
          "Error: Exit code 2",
          "src/a.ts(1,1): something else",
          "  error TS2304: Cannot find name 'x'.",
          "Errors: 1",
          "ERROR in ./src/b.ts",
        ].join("\r\n"),
        undefined,
      ),
    ).toBe(
      "Error: Exit code 2\nerror TS2304: Cannot find name 'x'.\nERROR in ./src/b.ts",
    );
  });

  it("uses the whole text when no line starts with an error", () => {
    expect(extractToolError("  The user rejected this tool use.\n", "x")).toBe(
      "The user rejected this tool use.",
    );
  });

  it("looks for an error field in a structured result", () => {
    expect(
      extractToolError({ stdout: "", stderr: "permission denied" }, "x"),
    ).toBe("permission denied");
    expect(extractToolError({ error: "timed out", stderr: "noise" }, "x")).toBe(
      "timed out",
    );
  });

  it("falls back to the first line of the result content", () => {
    expect(extractToolError(undefined, "\nExit code 1\nmore")).toBe(
      "Exit code 1",
    );
    expect(
      extractToolError({ interrupted: false }, [
        { type: "text", text: "File not found" },
      ]),
    ).toBe("File not found");
  });

  it("always has a message", () => {
    expect(extractToolError(undefined, undefined)).toBe("Tool call failed");
    expect(extractToolError("", "")).toBe("Tool call failed");
  });
});
