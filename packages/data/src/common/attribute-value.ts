import type {
  DeepReadonly,
  TraceSpanAttribute,
  TraceSpanAttributeValue,
} from "@evilmartians/agent-prism-types";

import {
  hasShape,
  isArrayOf,
  isBoolean,
  isFiniteNumber,
  isOptional,
  isPlainRecord,
  isString,
} from "./guards.js";

type ReadonlyAttributeValue = DeepReadonly<TraceSpanAttributeValue>;

const isIntValue = (value: unknown): value is number | string =>
  (isString(value) && value.trim() !== "" && Number.isFinite(Number(value))) ||
  (isFiniteNumber(value) && Number.isInteger(value));

/** Strict check: the value is an attribute and nothing in it is malformed. */
export function isAttribute(value: unknown): value is TraceSpanAttribute {
  return hasShape<TraceSpanAttribute>({
    key: isString,
    value: isAttributeValue,
  })(value);
}

function isArrayValue(
  value: unknown,
): value is { values: TraceSpanAttributeValue[] } {
  return isPlainRecord(value) && isArrayOf(isAttributeValue)(value["values"]);
}

function isAttributeValue(value: unknown): value is TraceSpanAttributeValue {
  return hasShape<TraceSpanAttributeValue>({
    arrayValue: isOptional(isArrayValue),
    boolValue: isOptional(isBoolean),
    bytesValue: isOptional(isString),
    doubleValue: isOptional(isFiniteNumber),
    intValue: isOptional(isIntValue),
    kvlistValue: isOptional(isKvlistValue),
    stringValue: isOptional(isString),
  })(value);
}

function isKvlistValue(
  value: unknown,
): value is { values: TraceSpanAttribute[] } {
  return isPlainRecord(value) && isArrayOf(isAttribute)(value["values"]);
}

const reviveValues = <T>(
  value: unknown,
  revive: (item: unknown) => T[],
): undefined | { values: T[] } =>
  isPlainRecord(value) && Array.isArray(value["values"])
    ? { values: value["values"].flatMap(revive) }
    : undefined;

const reviveValueEntry = (item: unknown): TraceSpanAttributeValue[] => {
  const revived = reviveAttributeValue(item);
  return revived ? [revived] : [];
};

/** Rebuilds an attribute from untrusted JSON; a malformed one is dropped. */
export function reviveAttribute(item: unknown): TraceSpanAttribute[] {
  if (!isPlainRecord(item) || !isString(item["key"])) return [];

  const value = reviveAttributeValue(item["value"]);

  return value ? [{ key: item["key"], value }] : [];
}

function reviveAttributeValue(
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
    ...(isFiniteNumber(doubleValue) ? { doubleValue } : {}),
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
  if (value.intValue !== undefined) return Number(value.intValue);
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
