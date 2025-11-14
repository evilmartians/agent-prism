import js from "@eslint/js";
import perfectionist from "eslint-plugin-perfectionist";
import pluginReact from "eslint-plugin-react";
import tailwind from "eslint-plugin-tailwindcss";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  ...tailwind.configs["flat/recommended"],
  {
    ignores: [
      "packages/saas/.next",
      "packages/saas/out",
      "packages/saas/next-env.d.ts",
      "packages/core/dist",
      "packages/demo-app/dist",
      "packages/storybook/storybook-static",
      "packages/data/dist",
      "packages/types/dist",
    ],
  },
  {
    plugins: {
      perfectionist,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "perfectionist/sort-imports": [
        "error",
        {
          type: "natural",
          order: "asc",
        },
      ],
    },
  },
]);
