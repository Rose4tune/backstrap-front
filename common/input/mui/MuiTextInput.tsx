import TextField, { OutlinedTextFieldProps } from "@mui/material/TextField";
import type { InputLabelProps } from "@mui/material/InputLabel";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export interface MuiOutlinedTextInputProps
  extends Omit<OutlinedTextFieldProps, "variant" | "color"> {
  color?: string;
  labelColor?: string;
  borderColor?: string;
}

const MuiOutlinedTextInput = (
  props: MuiOutlinedTextInputProps
): JSX.Element => {
  const {
    InputProps,
    InputLabelProps,
    color = "#000000",
    labelColor = "#000000",
    borderColor = "#D7D7D7",
    size = "small",
    ...textFieldProps
  } = props;

  const theme = createTheme({
    palette: {
      primary: {
        main: color,
      },
      error: {
        main: "#EF6969",
      },
    },
    typography: {
      fontFamily: [
        "Pretendard",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        '"Noto Sans"',
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ].join(","),
    },
    breakpoints: {
      values: {
        xs: 360,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1360, // 2xl
        "2xl": 1920,
        "3xl": 2560,
        "4xl": 3840,
      },
    },
    components: {
      MuiFormControl: {
        styleOverrides: {
          root: {
            ":hover label": {
              color,
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: ({ theme, ownerState }) => ({
            height: ownerState?.size === "medium" ? 53 : 50,
            [theme.breakpoints.up("xl")]: {
              height: ownerState?.size === "medium" ? 67 : undefined,
            },
          }),
          input: ({ theme, ownerState }) => ({
            height: ownerState?.size === "medium" ? 53 : 50,
            paddingTop: `0 !important`,
            paddingBottom: `0 !important`,
            paddingLeft:
              ownerState?.size === "medium" ? `16px !important` : undefined,
            paddingRight:
              ownerState?.size === "medium" ? `16px !important` : undefined,
            [theme.breakpoints.up("xl")]: {
              height: ownerState?.size === "medium" ? 67 : undefined,
              paddingLeft:
                ownerState?.size === "medium" ? `20px !important` : undefined,
              paddingRight:
                ownerState?.size === "medium" ? `20px !important` : undefined,
            },
          }),
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme, ownerState }) => ({
            fontSize: ownerState?.size === "medium" ? 20 : 16,
            borderRadius: 10,
            ":hover .MuiOutlinedInput-notchedOutline": {
              borderColor: color,
            },
            [theme.breakpoints.up("xl")]: {
              fontSize: ownerState?.size === "medium" ? 24 : undefined,
            },
          }),
          notchedOutline: {
            borderWidth: `1px !important`,
            borderStyle: "solid",
            borderColor,
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: ({ theme, ownerState }) => ({
            fontSize: ownerState?.size === "small" ? 30 : 16,
            fontWeight: 300,
            transform:
              ownerState?.size === "small"
                ? "translate(16px, 6px) scale(1)"
                : "translate(14px, 14px) scale(1)",
            color: labelColor,
            [theme.breakpoints.up("xl")]: {
              transform:
                ownerState?.size === "small"
                  ? "translate(18px, 12px) scale(1)"
                  : undefined,
            },
          }),
          shrink: ({ theme, ownerState }) => ({
            fontWeight: 700,
            transform:
              ownerState?.size === "small"
                ? "translate(16px, -10px) scale(0.45)"
                : "translate(14px, -9px) scale(0.75)",
            [theme.breakpoints.up("xl")]: {
              transform:
                ownerState?.size === "small"
                  ? "translate(18px, -10px) scale(0.5)"
                  : undefined,
            },
          }),
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <TextField
        variant="outlined"
        color="primary"
        fullWidth
        size={size}
        InputProps={{
          size,
          ...InputProps,
        }}
        InputLabelProps={
          {
            size,
            ...InputLabelProps,
          } as InputLabelProps
        }
        {...textFieldProps}
      />
    </ThemeProvider>
  );
};

export default MuiOutlinedTextInput;
