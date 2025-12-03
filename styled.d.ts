import '@emotion/react';
import { Theme as MUITheme, Breakpoints } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    '2xl': true;
    '3xl': true;
    '4xl': true;
  }
}

declare module '@emotion/react' {
  export interface Theme extends MUITheme {}
}
