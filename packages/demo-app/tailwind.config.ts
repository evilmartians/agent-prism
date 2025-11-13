import { agentPrismTailwindColors } from "@evilmartians/agent-prism-ui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@evilmartians/agent-prism-ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: agentPrismTailwindColors,
    },
  },
};
