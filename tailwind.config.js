module.exports = {
  mode: 'jit',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './elements/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
    './common/**/*.{js,ts,jsx,tsx, scss}',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    screens: {
      xs: '360px',
      m: '550px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
      '3xl': '1536px',
      '4xl': '1920px',

      //Renewal
      std: '1440px',
      std1: '1600px'
    },

    backgroundColor: theme => ({
      ...theme('colors'),
      primary: '#00CBBC',
      'primary-light': '#EFF6F6',
      'primary-dark': '#157974',
      'primary-dark-light': '#D5E8E7',
      'point-blue': '#6990EF',
      'point-red': '#EF6969',
      grey1: '#F6F6F6',
      grey2: '#D7D7D7',
      grey3: '#BFBFBF',
      grey4: '#A6A6A6',
      grey5: '#727272',
      ////////Renewal//////////////

      normal: '#10E4D5',
      hover: '#2DDACE',
      click: '#22C6BB',
      'bagstrap-50': '#B9E8E5',
      'bagstrap-30': '#CFF4F2',
      'bagstrap-10': '#EBFCFB',

      black: '#000000',
      'gray-90': '#464D57',
      'gray-70': '#818791',
      'gray-60': '#A7ADB6',
      'gray-50': '#C9CED8',
      'gray-40': '#E5E9F1',
      'gray-30': '#F4F4FB',
      'gray-20': '#F8F8FB',
      white: '#FFFFFF',
      dim: 'rgba(0,0,0,0.4)',
      yellow: '#FFDD00',
      'yellow-50': '#FFF196',

      red: '#FF2E3E',
      'red-80': '#FF8D96',
      'red-50': '#FFD0D0',
      'red-10': '#FBF4F4',

      'text-normal': '#171719',
      'timetable-red': {
        10: '#EF4452',
        20: '#FF7978',
        30: '#FF9C00',
        40: '#FFC33A',
        50: '#54D25D',
        60: '#547ED2',
      },
      'timetable-blue': {
        10: '#4A46BC',
        20: '#4A44EF',
        30: '#0090FF',
        40: '#3ACEFF',
        50: '#78AEFF',
        60: '#547ED2',
      },
      'timetable-green': {
        10: '#308A47',
        20: '#3CA466',
        30: '#4AAD63',
        40: '#11A366',
        50: '#1DBB81',
        60: '#7BCC9B',
      },
      'timetable-purple': {
        10: '#442994',
        20: '#6648C3',
        30: '#785FC3',
        40: '#7B65E1',
        50: '#A17ED6',
        60: '#C1A5EC',
      },
    }),
    borderColor: theme => ({
      ...theme('colors'),
      DEFAULT: theme('colors.gray.200', 'currentColor'),
      primary: '#00CBBC',
      'primary-light': '#EFF6F6',
      'primary-dark': '#157974',
      'primary-dark-light': '#D5E8E7',
      'point-blue': '#6990EF',
      'point-red': '#EF6969',
      grey1: '#F6F6F6',
      grey2: '#D7D7D7',
      grey3: '#BFBFBF',
      grey4: '#A6A6A6',
      grey5: '#727272',
      ////////Renewal//////////////

      normal: '#10E4D5',
      hover: '#2DDACE',
      click: '#22C6BB',
      'bagstrap-50': '#B9E8E5',
      'bagstrap-10': '#EBFCFB',

      black: '#000000',
      'gray-90': '#464D57',
      'gray-70': '#818791',
      'gray-60': '#A7ADB6',
      'gray-50': '#C9CED8',
      'gray-40': '#E5E9F1',
      'gray-30': '#F4F4FB',
      'gray-20': '#F8F8FB',
      white: '#FFFFFF',
      yellow: '#FFDD00',
      'yellow-50': '#FFF196',

      red: '#FF2E3E',
      'red-80': '#FF8D96',
      'red-50': '#FFD0D0',
      'red-10': '#FBF4F4',

      'text-normal': '#171719',
      'timetable-red': {
        10: '#EF4452',
        20: '#FF7978',
        30: '#FF9C00',
        40: '#FFC33A',
        50: '#54D25D',
        60: '#547ED2',
      },
      'timetable-blue': {
        10: '#4A46BC',
        20: '#4A44EF',
        30: '#0090FF',
        40: '#3ACEFF',
        50: '#78AEFF',
        60: '#547ED2',
      },
      'timetable-green': {
        10: '#308A47',
        20: '#3CA466',
        30: '#4AAD63',
        40: '#11A366',
        50: '#1DBB81',
        60: '#7BCC9B',
      },
      'timetable-purple': {
        10: '#442994',
        20: '#6648C3',
        30: '#785FC3',
        40: '#7B65E1',
        50: '#A17ED6',
        60: '#C1A5EC',
      },
    }),
    textColor: theme => ({
      ...theme('colors'),
      primary: '#00CBBC',
      primary: '#00CBBC',
      'primary-light': '#EFF6F6',
      'primary-dark': '#157974',
      'primary-dark-light': '#D5E8E7',
      'point-blue': '#6990EF',
      'point-red': '#EF6969',
      grey1: '#F6F6F6',
      grey2: '#D7D7D7',
      grey3: '#BFBFBF',
      grey4: '#A6A6A6',
      grey5: '#727272',

      ////////Renewal//////////////
      normal: '#10E4D5',
      hover: '#2DDACE',
      click: '#22C6BB',
      'bagstrap-50': '#B9E8E5',
      'bagstrap-10': '#EBFCFB',

      black: '#000000',
      'gray-90': '#464D57',
      'gray-70': '#818791',
      'gray-60': '#A7ADB6',
      'gray-50': '#C9CED8',
      'gray-40': '#E5E9F1',
      'gray-30': '#F4F4FB',
      'gray-20': '#F8F8FB',
      white: '#FFFFFF',
      yellow: '#FFDD00',
      'yellow-50': '#FFF196',

      red: '#FF2E3E',
      'red-80': '#FF8D96',
      'red-50': '#FFD0D0',
      'red-10': '#FBF4F4',

      'text-normal': '#171719',
      'timetable-red': {
        10: '#EF4452',
        20: '#FF7978',
        30: '#FF9C00',
        40: '#FFC33A',
        50: '#54D25D',
        60: '#547ED2',
      },
      'timetable-blue': {
        10: '#4A46BC',
        20: '#4A44EF',
        30: '#0090FF',
        40: '#3ACEFF',
        50: '#78AEFF',
        60: '#547ED2',
      },
      'timetable-green': {
        10: '#308A47',
        20: '#3CA466',
        30: '#4AAD63',
        40: '#11A366',
        50: '#1DBB81',
        60: '#7BCC9B',
      },
      'timetable-purple': {
        10: '#442994',
        20: '#6648C3',
        30: '#785FC3',
        40: '#7B65E1',
        50: '#A17ED6',
        60: '#C1A5EC',
      },
    }),
    fontSize: {
      tiny: '.625rem', // 16 * 0.625 = 10px
      tiny: '.625rem', // 16 * 0.625 = 10px
      xs: ['0.75rem'],
      sm: ['0.875rem'],
      base: ['1rem'],
      lg: ['1.125rem'],
      xl: ['1.25rem'],
      '2xl': ['1.5rem'],
      '3xl': ['1.875rem'],
      '4xl': ['2.25rem'],
      '5xl': ['3rem'],
      '6xl': ['3.75rem'],
      '7xl': ['4.5rem'],
      '8xl': ['6rem'],
      '9xl': ['8rem'],

      ////////Renewal//////////////

      'bold-36': ['2.25rem', { lineHeight: '2.75rem', fontWeight: '700' }],
      'bold-32': ['1.75rem', { lineHeight: '2.25rem', fontWeight: '700' }],
      'bold-24': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }],
      'bold-20': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '700' }],
      'bold-18': ['1.125rem', { lineHeight: '1.5rem', fontWeight: '700' }],
      'bold-16': ['1rem', { lineHeight: '1.25rem', fontWeight: '700' }],
      'bold-14': ['0.875rem', { lineHeight: '1.125rem', fontWeight: '700' }],
      'bold-12': ['0.75rem', { lineHeight: '1.125rem', fontWeight: '700' }],

      'semibold-22': ['1.375rem', { lineHeight: '1.75rem', fontWeight: '600' }],
      'semibold-18': ['1.125rem', { lineHeight: '1.625rem', fontWeight: '600' }],
      'semibold-16': ['1rem', { lineHeight: '1.5rem', fontWeight: '600' }],
      'semibold-14': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '600' }],
      'semibold-12': ['0.75rem', { lineHeight: '1.125rem', fontWeight: '600' }],
      'semibold-10': ['0.625rem', { lineHeight: '0.75rem', fontWeight: '600' }],

      'med-20': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '500' }],
      'med-16': ['1rem', { lineHeight: '1.5rem', fontWeight: '500' }],
      'med-14': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500' }],
      'med-12': ['0.75rem', { lineHeight: '1.125rem', fontWeight: '500' }],

      'reg-16': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
      'reg-14': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
      'reg-12': ['0.75rem', { lineHeight: '1.125rem', fontWeight: '400' }]
    },
    fontFamily: {
      sans: [
        'Wanted Sans Variable',
        'Wanted Sans',
        'Apple SD Gothic Neo',
        'Pretendard',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        '"Noto Sans"',
        'Noto Sans KR',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"'
      ],
      serif: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      mono: [
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        '"Liberation Mono"',
        '"Courier New"',
        'monospace'
      ]
    },
    extend: {
      keyframes: {
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-6px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'fade-in': {
          '0%': {
            opacity: 0
          },
          '100%': {
            opacity: 100
          }
        },

        'fade-out': {
          '0%': {
            opacity: 100
          },
          '100%': {
            opacity: 0
          }
        }
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.5s ease-in-out',
        'fade-in': 'fade-in 0.5s ease-in',
        'fade-out': 'fade-out 0.5s ease-out'
      },
      height: {
        13: '52px'
      }
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('child', '& > *');
      addVariant('child-hover', '& > *:hover');
      addVariant('child-odd', '& > *:nth-child(odd)');
      addVariant('child-even', '& > *:nth-child(even)');
    },
    require('tailwind-scrollbar'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp')
  ],
};
