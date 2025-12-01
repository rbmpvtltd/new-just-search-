type Expand<T> = {
  [K in keyof T]: T[K];
};

export function expandObject<T extends Record<string, unknown>>(data: T) {
  const entries = Object.entries(data) as [keyof T, T[keyof T]][];

  const arrayFields = entries.filter(([, value]) => Array.isArray(value)) as [
    keyof T,
    unknown[],
  ][];

  const singleFields = entries.filter(([, value]) => !Array.isArray(value)) as [
    keyof T,
    Exclude<T[keyof T], unknown[]>,
  ][];

  const cartesian = <U>(arrays: U[][]): U[][] =>
    arrays.reduce<U[][]>(
      (acc, curr) => acc.flatMap((a) => curr.map((c) => [...a, c] as U[])),
      [[]],
    );

  const arrayValues = arrayFields.map(([_, value]) => value);

  const combos = cartesian(arrayValues);

  return combos.map((combo) => {
    const expanded = {} as Record<keyof T, T[keyof T]>;

    arrayFields.forEach(([key], i) => {
      expanded[key] = combo[i] as T[keyof T];
    });

    singleFields.forEach(([key, value]) => {
      expanded[key] = value;
    });

    return expanded as Expand<T>;
  });
}
