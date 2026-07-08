import type { TraceSpan } from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import {
  extractAttributeImages,
  extractImagePaths,
} from "@evilmartians/agent-prism-data";
import { useMemo } from "react";

import { ImageGallery } from "../ImageViewer";

interface DetailsViewImagesTabProps {
  data: TraceSpan;
}

export function DetailsViewImagesTab({
  data,
}: DetailsViewImagesTabProps): ReactElement {
  const { inputImages, outputImages, allImages } = useMemo(() => {
    const inputPaths = [
      ...(data.input ? extractImagePaths(String(data.input)) : []),
      ...extractAttributeImages(data.attributes),
    ];
    const outputPaths = data.output
      ? extractImagePaths(String(data.output))
      : [];

    const buildEntries = (paths: string[], label: "Input" | "Output") =>
      paths.map((src) => ({
        src,
        caption: `${label}: ${src.split("/").pop() || src}`,
      }));

    const input = buildEntries(inputPaths, "Input");
    const output = buildEntries(outputPaths, "Output");

    return {
      inputImages: input,
      outputImages: output,
      allImages: [...input, ...output],
    };
  }, [data.input, data.output, data.attributes]);

  if (allImages.length === 0) {
    return (
      <div className="border-agentprism-border bg-agentprism-muted rounded-md border p-8 text-center">
        <p className="text-agentprism-muted-foreground text-sm">
          No images found in this span&rsquo;s input or output.
        </p>
      </div>
    );
  }

  const hasInputImages = inputImages.length > 0;
  const hasOutputImages = outputImages.length > 0;
  const showSeparateSections = hasInputImages && hasOutputImages;

  return (
    <div className="space-y-6">
      <div className="text-agentprism-muted-foreground flex items-center gap-2 text-sm">
        <span className="text-agentprism-foreground font-medium">
          {allImages.length} image{allImages.length > 1 ? "s" : ""} found
        </span>
        {showSeparateSections && (
          <span>
            ({inputImages.length} in input, {outputImages.length} in output)
          </span>
        )}
      </div>

      {showSeparateSections ? (
        <>
          {hasInputImages && (
            <div>
              <h4 className="text-agentprism-foreground mb-3 text-sm font-medium">
                Input Images ({inputImages.length})
              </h4>
              <ImageGallery images={inputImages} />
            </div>
          )}

          {hasOutputImages && (
            <div>
              <h4 className="text-agentprism-foreground mb-3 text-sm font-medium">
                Output Images ({outputImages.length})
              </h4>
              <ImageGallery images={outputImages} />
            </div>
          )}
        </>
      ) : (
        <ImageGallery images={allImages} />
      )}

      <div className="border-agentprism-border bg-agentprism-muted rounded-md border p-3">
        <h4 className="text-agentprism-muted-foreground mb-2 text-xs font-medium">
          Image Paths
        </h4>
        <div className="space-y-1">
          {allImages.map((image, idx) => (
            <div
              key={`${image.src}-${idx}`}
              className="text-agentprism-foreground truncate font-mono text-xs"
              title={image.src}
            >
              {image.src}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
