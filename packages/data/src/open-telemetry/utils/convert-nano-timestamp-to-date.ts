export function convertNanoTimestampToDate(nanoString: string): Date {
  const nanoseconds = BigInt(nanoString);
  const milliseconds = Number(nanoseconds / BigInt(1_000_000));

  return new Date(milliseconds);
}
