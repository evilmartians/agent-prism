export function convertNanoTimestampToDate(nanoString: string): Date {
  const nanoseconds = BigInt(nanoString);
  const milliseconds = Number(nanoseconds / 1_000_000n);

  return new Date(milliseconds);
}
