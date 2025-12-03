import { useState, useEffect } from 'react';

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<'xsmall' | 'small' | 'medium' | 'large'>(
    'large'
  );
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 360) {
        setScreenSize('xsmall');
      } else if (window.innerWidth <= 1024) {
        setScreenSize('small');
      } else if (window.innerWidth <= 1440) {
        setScreenSize('medium');
      } else {
        setScreenSize('large');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return screenSize;
};

export default useScreenSize;
