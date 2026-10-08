import { agentPrismTailwindColors } from "@evilmartians/agent-prism-ui/theme";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@evilmartians/agent-prism-ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [],
  theme: {
    extend: {
      colors: agentPrismTailwindColors,
    },
  },
};
