import type {
  DeepReadonly,
  OpenTelemetryAnyValue,
  OpenTelemetryAttribute,
  TraceSpanAttribute,
  TraceSpanAttributeValue,
} from "@evilmartians/agent-prism-types";

import {
  hasShape,
  isArrayOf,
  isBoolean,
  isFiniteNumber,
  isNumber,
  isOneOf,
  isOptional,
  isOptionalNullable,
  isPlainRecord,
  isString,
} from "./guards.js";

type ReadonlyAttributeValue = DeepReadonly<TraceSpanAttributeValue>;

const isIntValue = (value: unknown): value is number | string =>
  (isString(value) && value.trim() !== "" && Number.isFinite(Number(value))) ||
  (isFiniteNumber(value) && Number.isInteger(value));

const isNonFiniteDouble = isOneOf({
  "-Infinity": true,
  Infinity: true,
  NaN: true,
});

const isDoubleValue = (
  value: unknown,
): value is "-Infinity" | "Infinity" | "NaN" | number =>
  isNumber(value) || isNonFiniteDouble(value);

/**
 * Checks an attribute in OTLP/JSON form, where any field may be omitted or
 * `null` when it holds its default value.
 */
export function isOpenTelemetryAttribute(
  value: unknown,
): value is OpenTelemetryAttribute {
  return hasShape<OpenTelemetryAttribute>({
    key: isOptionalNullable(isString),
    value: isOptionalNullable(isAnyValue),
  })(value);
}

function isAnyValue(value: unknown): value is OpenTelemetryAnyValue {
  return hasShape<OpenTelemetryAnyValue>({
    arrayValue: isOptional(
      hasShape<NonNullable<OpenTelemetryAnyValue["arrayValue"]>>({
        values: isOptionalNullable(isArrayOf(isAnyValue)),
      }),
    ),
    boolValue: isOptional(isBoolean),
    bytesValue: isOptional(isString),
    doubleValue: isOptional(isDoubleValue),
    intValue: isOptional(isIntValue),
    kvlistValue: isOptional(
      hasShape<NonNullable<OpenTelemetryAnyValue["kvlistValue"]>>({
        values: isOptionalNullable(isArrayOf(isOpenTelemetryAttribute)),
      }),
    ),
    stringValue: isOptional(isString),
  })(value);
}

const reviveValues = <T>(
  value: unknown,
  revive: (item: unknown) => T[],
): undefined | { values: T[] } =>
  isPlainRecord(value)
    ? {
        values: Array.isArray(value["values"])
          ? value["values"].flatMap(revive)
          : [],
      }
    : undefined;

const reviveValueEntry = (item: unknown): TraceSpanAttributeValue[] => {
  const revived = reviveAttributeValue(item);
  return revived ? [revived] : [];
};

/**
 * Rebuilds an attribute from untrusted JSON; a malformed one is dropped. A
 * missing key is the empty key OTLP/JSON omits.
 */
export function reviveAttribute(item: unknown): TraceSpanAttribute[] {
  if (!isPlainRecord(item)) return [];

  const key = item["key"] ?? "";
  const value = reviveAttributeValue(item["value"]);

  return isString(key) && value ? [{ key, value }] : [];
}

/**
 * Rebuilds an attribute value from untrusted JSON, OTLP/JSON forms included,
 * keeping only the well-formed fields.
 */
export function reviveAttributeValue(
  value: unknown,
): TraceSpanAttributeValue | undefined {
  if (!isPlainRecord(value)) return undefined;

  const arrayValue = reviveValues(value["arrayValue"], reviveValueEntry);
  const kvlistValue = reviveValues(value["kvlistValue"], reviveAttribute);
  const {
    boolValue,
    bytesValue,
    doubleValue,
    intValue,
    stringValue,
  }: Readonly<Record<string, unknown>> = value;

  return {
    ...(arrayValue ? { arrayValue } : {}),
    ...(isBoolean(boolValue) ? { boolValue } : {}),
    ...(isString(bytesValue) ? { bytesValue } : {}),
    ...(isDoubleValue(doubleValue) ? { doubleValue: Number(doubleValue) } : {}),
    ...(isIntValue(intValue) ? { intValue } : {}),
    ...(kvlistValue ? { kvlistValue } : {}),
    ...(isString(stringValue) ? { stringValue } : {}),
  };
}

/**
 * Reads an attribute value as a number: `doubleValue`, `intValue`, or a
 * numeric `stringValue`. Anything else is `undefined`.
 */
export const getAttributeNumber = (
  value: ReadonlyAttributeValue | undefined,
): number | undefined => {
  if (value === undefined) return undefined;
  if (value.doubleValue !== undefined) return value.doubleValue;
  if (value.intValue !== undefined) return Number(value.intValue);
  if (value.stringValue === undefined) return undefined;

  const parsed = Number.parseFloat(value.stringValue);
  return Number.isNaN(parsed) ? undefined : parsed;
};

/**
 * Converts an attribute value to the plain JSON value it stands for: arrays
 * for `arrayValue`, objects for `kvlistValue`, a number for `intValue`.
 */
export const toPlainAttributeValue = (
  value: ReadonlyAttributeValue,
): unknown => {
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.boolValue !== undefined) return value.boolValue;
  if (value.doubleValue !== undefined) return value.doubleValue;
  if (value.intValue !== undefined) {
    const number = Number(value.intValue);
    return Number.isSafeInteger(number) ? number : value.intValue;
  }
  if (value.bytesValue !== undefined) return value.bytesValue;
  if (value.arrayValue !== undefined) {
    return value.arrayValue.values.map(toPlainAttributeValue);
  }
  if (value.kvlistValue !== undefined) {
    return Object.fromEntries(
      value.kvlistValue.values.map((entry) => [
        entry.key,
        toPlainAttributeValue(entry.value),
      ]),
    );
  }
  return undefined;
};

const toAttributeValueList = (
  items: readonly unknown[],
): TraceSpanAttributeValue[] =>
  items.flatMap((item: unknown) => {
    const converted = toAttributeValue(item);
    return converted ? [converted] : [];
  });

/** Converts a plain JSON object to attributes, one per convertible key. */
export function toAttributes(
  record: Readonly<Record<string, unknown>>,
): TraceSpanAttribute[] {
  return Object.entries(record).flatMap(
    ([key, item]: readonly [string, unknown]) => {
      const value = toAttributeValue(item);
      return value ? [{ key, value }] : [];
    },
  );
}

/**
 * Converts a plain JSON value to an attribute value: integers become
 * `intValue`, other numbers `doubleValue`, arrays `arrayValue` and objects
 * `kvlistValue`. `null` and `undefined` have no attribute form.
 */
export function toAttributeValue(
  value: unknown,
): TraceSpanAttributeValue | undefined {
  if (isString(value)) return { stringValue: value };
  if (isBoolean(value)) return { boolValue: value };
  if (isFiniteNumber(value)) {
    return Number.isInteger(value)
      ? { intValue: String(value) }
      : { doubleValue: value };
  }
  if (Array.isArray(value)) {
    return { arrayValue: { values: toAttributeValueList(value) } };
  }
  if (isPlainRecord(value)) {
    return { kvlistValue: { values: toAttributes(value) } };
  }
  return undefined;
}
