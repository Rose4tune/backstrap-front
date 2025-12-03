import { useEffect, useState } from 'react';

/**
 * 입력값이 연속적으로 변경될 때 마지막 변경 후 일정 시간(delay) 이후에만 업데이트되는 값 반환
 * 사용법 : useDebouncedValeu(value, 500);
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer); // 값이 바뀌면 이전 타이머 제거
  }, [value, delay]);

  return debouncedValue;
}
