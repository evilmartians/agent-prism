import { agentPrismTailwindColors } from "./src/components/theme";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-mode="dark"]'],
  theme: {
    extend: {
      colors: agentPrismTailwindColors,
    },
  },
};
