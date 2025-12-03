// themeEmotion.tsx (Emotion 기반 스타일링)
import { css } from '@emotion/react';

export const emotionTheme = {
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
    // 새 디자인 적용
    main: '#00CBBC',
    white: '#FFFFFF',

    black: '#000000',
    black1: 'rgba(0, 0, 0, 5%)',
    black2: 'rgba(0, 0, 0, 10%)',
    black3: 'rgba(0, 0, 0, 15%)',

    turqoise: {
      100: '#EAFBFB',
      200: '#C2F1EF',
      300: '#8EE8E4',
      500: '#29D1C9',
      600: '#01C5BC',
      700: '#01A8A0'
    },

    gray: {
      100: '#FAFAFA',
      200: '#EDEDED',
      300: '#DBDBDB',
      400: '#C5C5C5',
      500: '#ADACAC',
      600: '#919090',
      700: '#7D7C7C',
      800: '#605F5F',
      900: '#424242'
    },

    error: {
      100: '#FFF4F5',
      200: '#FBDEE1 ',
      300: '#F4B6BD',
      400: '#E87C88',
      500: '#E25163',
      600: '#DA283D',
      700: '#C31E31',
      800: '#AB1628',
      900: '#930F1F',
      1000: '#7D0816'
    }
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
      '4xl': 1920,
      // 새 디자인 적용
      Small: 360,
      Medium: 1024,
      Large: 1440
    }
  }
};
