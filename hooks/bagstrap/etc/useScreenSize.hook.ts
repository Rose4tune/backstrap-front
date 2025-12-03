import { useState, useEffect } from 'react';

export default function useScreenSize(breakpoint: number) {
  const [isBelowBreakpoint, setIsBelowBreakpoint] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= breakpoint) {
        setIsBelowBreakpoint(true);
      } else {
        setIsBelowBreakpoint(false);
      }
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint]);

  return isBelowBreakpoint;
}
