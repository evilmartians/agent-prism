type Guard<T> = (value: unknown) => value is T;

type Shape<T> = { readonly [K in keyof T]-?: Guard<T[K]> };

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const isPlainRecord = (
  value: unknown,
): value is Record<string, unknown> => isRecord(value) && !Array.isArray(value);

export const isString = (value: unknown): value is string =>
  typeof value === "string";

export const isNumber = (value: unknown): value is number =>
  typeof value === "number";

export const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";

export const isFiniteNumber = (value: unknown): value is number =>
  isNumber(value) && Number.isFinite(value);

export const isUnknown = (_value: unknown): _value is unknown => true;

export const isOneOf =
  <T extends string>(values: Readonly<Record<T, true>>): Guard<T> =>
  (value): value is T =>
    isString(value) && Object.hasOwn(values, value);

export const isOptional =
  <T>(guard: Guard<T>): Guard<T | undefined> =>
  (value): value is T | undefined =>
    value === undefined || guard(value);

export const isNullable =
  <T>(guard: Guard<T>): Guard<null | T> =>
  (value): value is null | T =>
    value === null || guard(value);

export const isArrayOf =
  <T>(guard: Guard<T>): Guard<T[]> =>
  (value): value is T[] =>
    Array.isArray(value) && value.every((item: unknown) => guard(item));

const matchesShape = (
  value: unknown,
  shape: Readonly<Record<string, Guard<unknown>>>,
): boolean =>
  isPlainRecord(value) &&
  Object.entries(shape).every(
    ([key, guard]: readonly [string, Guard<unknown>]) => guard(value[key]),
  );

export const hasShape =
  <T>(shape: Shape<T>): Guard<T> =>
  (value): value is T =>
    matchesShape(value, shape);
