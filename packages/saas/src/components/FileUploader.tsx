"use client";

import type { ChangeEvent, FC } from "react";

import { Button } from "@evilmartians/agent-prism-ui";
import { useContext, useRef, useState } from "react";

import { UploadFileErrorMessage } from "@/components/UploadFileErrorMessage";
import { TraceContext } from "@/context/TraceContext";

export const FileUploader: FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isProcessing, setIsProcessing] = useState(false);

  const traceContext = useContext(TraceContext);
  const error = traceContext?.traceState.error ?? "";

  const handleButtonClick = () => {
    if (error !== "") {
      traceContext?.clearError();
    }
    fileInputRef.current?.click();
  };

  const handleFilesChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files?.[0];
    if (!files || !file) return;

    setIsProcessing(true);

    try {
      const text = await file.text();
      const jsonData: unknown = JSON.parse(text);

      if (typeof jsonData !== "object" || jsonData === null) {
        throw new Error("Invalid JSON: expected an object");
      }

      await traceContext?.uploadTraces(files);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsProcessing(false);

      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input
        accept=".json"
        aria-label="Upload trace or log files"
        className="hidden"
        disabled={isProcessing}
        onChange={(e) => {
          void handleFilesChange(e);
        }}
        ref={fileInputRef}
        type="file"
      />

      <Button onClick={handleButtonClick} size="12" variant="secondary">
        Upload traces
      </Button>

      {error === "" ? null : (
        <div className="mt-4">
          <UploadFileErrorMessage message={error} />
        </div>
      )}
    </div>
  );
};
