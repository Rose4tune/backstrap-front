import { useEffect } from 'react';

const useLocalStorage = <T>(key: string, setValue?: (value: T) => void) => {
  // 컴포넌트가 마운트될 때 로컬스토리지에서 데이터 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined' && setValue) {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        setValue(JSON.parse(storedValue));
      }
    }
  }, [key, setValue]);

  // 데이터 저장 함수
  const saveValue = (newValue: T) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(newValue));
      setValue?.(newValue);
    }
  };

  // 데이터 가져오기 함수
  const getValue = (): T | string | null => {
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem(key);
      if (!storedValue) return null;

      try {
        return JSON.parse(storedValue);
      } catch {
        return storedValue;
      }
    }
    return null;
  };

  // 데이터 삭제 함수
  const removeValue = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
      setValue?.({} as T);
    }
  };

  return { saveValue, getValue, removeValue };
};

export default useLocalStorage;
