const isList = <T>(value: readonly T[] | T): value is readonly T[] =>
  Array.isArray(value);

export const toList = <T>(value: readonly T[] | T): readonly T[] =>
  isList(value) ? value : [value];
