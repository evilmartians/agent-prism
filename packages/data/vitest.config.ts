import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

process.env["TZ"] = "UTC";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      include: ["src/**/*.ts"],
      provider: "v8",
      thresholds: {
        branches: 93,
        functions: 93,
        lines: 89,
        statements: 89,
      },
    },
    globals: true,
  },
});
