// 시간 파싱 유틸
export const parseHM = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return { h, m };
};
export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

export const GRID_MINUTES = 5;

export const roundToNearest5 = (mins: number) => Math.round(mins / GRID_MINUTES) * GRID_MINUTES;

export const toMinutesRounded5 = (timeStr: string) => {
  const m = toMinutes(timeStr);
  return roundToNearest5(m);
};

export const snapDown5 = (mins: number) => Math.floor(mins / GRID_MINUTES) * GRID_MINUTES;
export const snapUp5 = (mins: number) => Math.ceil(mins / GRID_MINUTES) * GRID_MINUTES;