import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    color: {
      primary: string;
      primaryLight: string;
      primaryDark: string;
      primaryDarkLight: string;
      pointBlue: string;
      pointRed: string;
      grey1: string;
      grey2: string;
      grey3: string;
      grey4: string;
      grey5: string;

      // 신규 디자인 시스템
      main: string;
      turqoise100: string;
      turqoise200: string;
      turqoise300: string;
      turqoise500: string;
      turqoise600: string;
      turqoise700: string;
      gray200: string;
      gray300: string;
      gray400: string;
      gray600: string;
      gray700: string;
      gray800: string;
      gray900: string;
      black: string;
      black1: string;
      black2: string;
      black3: string;
    };
  }
  interface ThemeOptions {
    color?: {
      primary?: string;
      primaryLight?: string;
      primaryDark?: string;
      primaryDarkLight?: string;
      pointBlue?: string;
      pointRed?: string;
      grey1?: string;
      grey2?: string;
      grey3?: string;
      grey4?: string;
      grey5?: string;

      // 신규 디자인 시스템
      main?: string;
      turqoise100?: string;
      turqoise200?: string;
      turqoise300?: string;
      turqoise500?: string;
      turqoise600?: string;
      turqoise700?: string;
      gray200?: string;
      gray300?: string;
      gray400?: string;
      gray600?: string;
      gray700?: string;
      gray800?: string;
      gray900?: string;
      black?: string;
      black1?: string;
      black2?: string;
      black3?: string;
    };
  }
}

export const theme = createTheme({
  typography: {
    fontFamily: `'Wanted Sans', 'Pretendard', 'Roboto', 'Helvetica', 'Arial', sans-serif`
  },
  palette: {
    mode: 'light',
    primary: {
      light: '#8DE8E1',
      main: '#8DE8E1',
      dark: '#8DE8E1',
      contrastText: '#fff'
    },
    text: {
      primary: '#272727'
    }
  },
  color: {
    primary: '#00CBBC',
    primaryLight: '#EFF6F6',
    primaryDark: '#157974',
    primaryDarkLight: '#D5E8E7',
    pointBlue: '#6990EF',
    pointRed: '#EF6969',
    grey1: '#F6F6F6',
    grey2: '#D7D7D7',
    grey3: '#BFBFBF',
    grey4: '#A6A6A6',
    grey5: '#727272',

    // 신규 디자인 시스템
    main: '#00CBBC',
    turqoise100: '#EAFBFB',
    turqoise200: '#C2F1EF',
    turqoise300: '#8EE8E4',
    turqoise500: '#29D1C9',
    turqoise600: '#01C5BC',
    turqoise700: '#01A8A0',
    gray200: '#EDEDED',
    gray300: '#DBDBDB',
    gray400: '#C5C5C5',
    gray600: '#919090',
    gray700: '#7D7C7C',
    gray800: '#605F5F',
    gray900: '#424242',
    black: '#000000',
    black1: 'rgba(0, 0, 0, 5%)',
    black2: 'rgba(0, 0, 0, 10%)',
    black3: 'rgba(0, 0, 0, 15%)'
  },
  breakpoints: {
    values: {
      xs: 360,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1360,
      '3xl': 1536,
      '4xl': 1920
    }
  }
});
