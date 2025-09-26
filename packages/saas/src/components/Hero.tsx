import { type FC } from "react";

import FileUploader from "./FileUploader";

export const Hero: FC = () => {
  return (
    <section className="bg-white text-center dark:bg-gray-950">
      <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl dark:text-white">
        Explore and Understand Your AI Agents
      </h1>
      <p className="mb-4 px-4 text-base font-normal text-gray-500 sm:px-8 sm:text-lg lg:px-16 lg:text-xl xl:px-48 dark:text-gray-400">
        Gain full visibility into every step your AI agents take. Trace
        decisions, debug workflows, and optimize performance with powerful logs
        and insights—all in one place.
      </p>

      <FileUploader />
    </section>
  );
};
