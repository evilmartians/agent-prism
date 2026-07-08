import { useState, useCallback, useEffect, type ReactElement } from "react";

export interface ImageViewerProps {
  src: string;
  alt?: string;
  caption?: string;
  className?: string;
  expandable?: boolean;
}

export interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt?: string;
    caption?: string;
  }>;
  className?: string;
}

function getImageUrl(src: string): string {
  if (src.startsWith("data:") || src.startsWith("http")) {
    return src;
  }

  if (src.startsWith("/")) {
    return src;
  }

  return src;
}

interface ImageModalProps {
  src: string;
  alt?: string;
  caption?: string;
  onClose: () => void;
}

function ImageModal({
  src,
  alt,
  caption,
  onClose,
}: ImageModalProps): ReactElement {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <div
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="bg-agentprism-background text-agentprism-foreground hover:bg-agentprism-secondary absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full shadow-lg"
          aria-label="Close image preview"
        >
          <svg
            className="size-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <img
          src={getImageUrl(src)}
          alt={alt || "Preview"}
          className="max-h-[85vh] max-w-full rounded-lg object-contain"
        />

        {caption && (
          <div className="mt-2 text-center text-sm text-white/80">
            {caption}
          </div>
        )}
      </div>
    </div>
  );
}

export function ImageViewer({
  src,
  alt,
  caption,
  className = "",
  expandable = true,
}: ImageViewerProps): ReactElement {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleClick = useCallback(() => {
    if (expandable && !hasError) {
      setIsExpanded(true);
    }
  }, [expandable, hasError]);

  const handleClose = useCallback(() => {
    setIsExpanded(false);
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  if (hasError) {
    return (
      <div
        className={`border-agentprism-border bg-agentprism-muted rounded-lg border p-4 ${className}`}
      >
        <div className="text-agentprism-muted-foreground flex items-center gap-2 text-sm">
          <svg
            className="size-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>Failed to load image</span>
        </div>
        <div className="text-agentprism-muted-foreground mt-1 truncate text-xs">
          {src}
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`border-agentprism-border bg-agentprism-muted group relative overflow-hidden rounded-lg border ${expandable ? "cursor-pointer" : ""} ${className}`}
        onClick={handleClick}
        role={expandable ? "button" : undefined}
        tabIndex={expandable ? 0 : undefined}
        onKeyDown={
          expandable ? (e) => e.key === "Enter" && handleClick() : undefined
        }
      >
        {isLoading && (
          <div className="bg-agentprism-muted absolute inset-0 flex items-center justify-center">
            <div className="border-agentprism-border border-t-agentprism-brand size-6 animate-spin rounded-full border-2" />
          </div>
        )}

        <img
          src={getImageUrl(src)}
          alt={alt || "Image preview"}
          className={`max-h-64 w-full object-contain transition-opacity ${isLoading ? "opacity-0" : "opacity-100"}`}
          onLoad={handleLoad}
          onError={handleError}
        />

        {expandable && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
            <div className="rounded-full bg-white/90 p-2">
              <svg
                className="size-5 text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </div>
          </div>
        )}

        {caption && (
          <div className="border-agentprism-border bg-agentprism-background text-agentprism-muted-foreground border-t px-3 py-2 text-xs">
            {caption}
          </div>
        )}
      </div>

      {isExpanded && (
        <ImageModal
          src={src}
          alt={alt}
          caption={caption}
          onClose={handleClose}
        />
      )}
    </>
  );
}

export function ImageGallery({
  images,
  className = "",
}: ImageGalleryProps): ReactElement {
  if (images.length === 0) {
    return (
      <div className="text-agentprism-muted-foreground text-sm">
        No images found
      </div>
    );
  }

  if (images.length === 1) {
    return <ImageViewer {...images[0]} className={className} />;
  }

  return (
    <div
      className={`grid gap-3 ${images.length === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"} ${className}`}
    >
      {images.map((image, index) => (
        <ImageViewer key={`${image.src}-${index}`} {...image} />
      ))}
    </div>
  );
}
