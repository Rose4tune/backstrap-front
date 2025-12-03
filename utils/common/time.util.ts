import padStart from "lodash/padStart";

export const formatTimeDisplay = (time: number): string => {
  const hours = ~~(time / 3600);
  const minutes = ~~((time % 3600) / 60);
  const seconds = ~~time % 60;

  return `${hours > 0 ? `${padStart(String(hours), 2, "0")}:` : ""}${padStart(
    String(minutes),
    2,
    "0"
  )}:${padStart(String(seconds), 2, "0")}`;
};
