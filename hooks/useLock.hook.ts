import React from "react";

export default function useLock(
  name?: string
): [boolean, (handler: () => void) => void] {
  const [lock, setLock] = React.useState(false);

  const ref = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    return () => {
      if (ref.current != null) {
        clearTimeout(ref.current);
      }
    };
  }, []);

  return [
    !!lock,
    (handler) => {
      if (lock) {
        console.log(name, "BLOCKED");

        return;
      }

      setLock(true);

      handler.call(null);

      const timeout = setTimeout(() => {
        setLock(false);
      }, 300);

      ref.current = timeout;
    },
  ];
}
