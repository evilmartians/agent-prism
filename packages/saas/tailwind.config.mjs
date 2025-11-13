import { agentPrismTailwindColors } from "@evilmartians/agent-prism-ui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@evilmartians/agent-prism-ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: agentPrismTailwindColors,
    },
  },
  plugins: [],
};
