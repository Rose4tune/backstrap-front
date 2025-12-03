import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { useMediaQuery } from '@mui/material';

export const ScrollBox = ({ children }: { children: ReactNode }) => {
  const up1280 = useMediaQuery('(min-width:1280px)');

  return (
    <Box
      style={{ WebkitOverflowScrolling: 'touch' }}
      overflow={'auto'}
      mx={up1280 ? 0 : '-16px'}
    >
      <Box px={up1280 ? 0 : '16px'}>{children}</Box>
    </Box>
  );
};
