import { HomeContent } from "@/components/HomeContent.tsx";
import { TraceProvider } from "@/context/TraceProvider";

export default function Home() {
  return (
    <TraceProvider>
      <HomeContent />
    </TraceProvider>
  );
}
