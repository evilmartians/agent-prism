#!/usr/bin/env node

import { exec } from "child_process";
import { detect } from "package-manager-detector/detect";

const packages = [
  "@evilmartians/agent-prism-data",
  "@evilmartians/agent-prism-types",
  "@radix-ui/react-collapsible",
  "@radix-ui/react-tabs",
  "classnames",
  "lucide-react",
  "react-json-pretty",
].join(" ");

function execCommand(command, config) {
  const { errorPrefix = "Error while executing command" } = config;

  exec(command, (error) => {
    if (error) {
      console.error(`${errorPrefix}: ${error}`);
      process.exit(-1);
    }
  });
}

function installPackages(command) {
  execCommand(`${command} ${packages}`, {
    errorPrefix: "Error while installing packages",
  });
  console.log("All packages installed. Happy using AgentPrism!");
}

execCommand(
  "npx degit evilmartians/agent-prism/packages/ui/src/components src/components/agent-prism",
  {
    errorPrefix: "Error while cloning components",
  },
);

console.log("Components cloned successfully. Installing packages...");

const pm = await detect();

if (pm === "pnpm") {
  installPackages("pnpm add");
}

if (pm === "yarn") {
  installPackages("yarn add");
}

installPackages("npm install");
