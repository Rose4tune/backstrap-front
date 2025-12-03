import numeral from "numeral";

export const formatNumberDisplay = (num: number): string =>
  numeral(num).format("0,0");

export const isNumber = (num: string | number): boolean =>
  !Number.isNaN(Number(num));

export const sum = (arr: number[], baseValue = 0) =>
  arr.reduce((acc, cur) => acc + cur, baseValue);

export const divide = (
  a: number | null | undefined,
  b: number | null | undefined
): number => {
  if (a && b) {
    return a / b;
  }

  return 0;
};
