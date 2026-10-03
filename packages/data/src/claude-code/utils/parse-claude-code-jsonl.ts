const parseJSON = (text: string): { value: unknown } | undefined => {
  try {
    return { value: JSON.parse(text) };
  } catch {
    return undefined;
  }
};

/**
 * Parses transcript text into records. The text is normally JSONL (one record
 * per line), but a single JSON document, such as an array of records, is read
 * too. Lines that are not JSON are skipped: a transcript can be cut off in the
 * middle of a write.
 */
export const parseClaudeCodeJSONL = (text: string): unknown[] => {
  const document = parseJSON(text);

  if (document) {
    return Array.isArray(document.value) ? document.value : [document.value];
  }

  return text.split(/\r?\n/).flatMap((line) => {
    const record = parseJSON(line);

    return record ? [record.value] : [];
  });
};
