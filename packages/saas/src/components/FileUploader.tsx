"use client";

import { Button } from "@evilmartians/agent-prism-ui";
import { ChangeEvent, FC, useContext, useRef, useState } from "react";

import { UploadFileErrorMessage } from "@/components/UploadFileErrorMessage";
import { TraceContext } from "@/context/TraceContext";

const FileUploader: FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isProcessing, setIsProcessing] = useState(false);

  const traceContext = useContext(TraceContext);

  const handleButtonClick = () => {
    if (traceContext?.traceState.error) {
      traceContext?.clearError();
    }
    fileInputRef.current?.click();
  };

  const handleFilesChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);

    try {
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
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".json,.jsonl"
        multiple
        onChange={handleFilesChange}
        aria-label="Upload trace or log files"
        disabled={isProcessing}
      />

      <Button size="12" variant="secondary" onClick={handleButtonClick}>
        Upload traces
      </Button>

      {traceContext?.traceState.error && (
        <div className="mt-4">
          <UploadFileErrorMessage message={traceContext.traceState.error} />
        </div>
      )}
    </div>
  );
};

export default FileUploader;
