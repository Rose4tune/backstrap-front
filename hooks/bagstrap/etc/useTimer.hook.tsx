import React from "react";
import { useInterval } from "react-use";

export default function useTimer(
  total: number,
  onTimeout?: () => void
): [number, (total?: number) => void, (reset?: boolean) => void] {
  const [time, setTime] = React.useState(total);

  const [isRunning, setIsRunning] = React.useState(false);

  useInterval(
    () => {
      setTime((prev) => (prev > 0 ? prev - 1 : prev));

      if (time === 0) {
        setIsRunning(false);

        onTimeout?.call(null);
      }
    },
    isRunning ? 1000 : null
  );

  return [
    // residual time
    time,
    // start / reset
    (newVal = total) => {
      setTime(newVal);

      setIsRunning(true);
    },
    // stop / reset
    (reset) => {
      setIsRunning(false);

      if (reset) {
        setTime(total);
      }
    },
  ];
}
