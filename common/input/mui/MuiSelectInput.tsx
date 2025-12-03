import React from "react";

import SvgIcon from "@mui/material/SvgIcon";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export interface MuiSelectInputProps extends BaseInputProps {
  readonly options?: SelectOption[];
}

const MuiSelectInput = (props: MuiSelectInputProps): JSX.Element => {
  const { value, onChange, options } = props;

  const [isOpen, setIsOpen] = React.useState(false);

  const theme = createTheme({
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
    components: {
      MuiSelect: {
        styleOverrides: {
          select: {
            padding: `0 16px 0 8px !important`,
            textAlign: "center",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            cursor: "pointer",
          },
          notchedOutline: () => ({
            borderColor: "#E5E5EB !important",
            borderWidth: "1px !important",
          }),
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: ({ ownerState }) => ({
            backgroundColor: ownerState?.selected
              ? "#EFF6F6 !important"
              : undefined,
            "&:hover": {
              backgroundColor: "#EFF6F6 !important",
            },
          }),
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Select
        color="primary"
        size="small"
        variant="outlined"
        value={value}
        onOpen={() => {
          setIsOpen(true);
        }}
        onClose={() => {
          setIsOpen(false);
        }}
        sx={{
          minWidth: 50,
          height: 32,
          px: 0,
          backgroundColor: isOpen ? "#EFF6F6" : undefined,
        }}
        MenuProps={{
          disablePortal: true,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          anchorReference: "anchorEl",
          sx: {
            maxHeight: 120,
          },
          PaperProps: {
            sx: {
              mt: 1,
              borderRadius: 0,
              boxShadow: "0 0 8px 0 rgba(0, 0, 0, 0.1)",
            },
          },
          MenuListProps: {
            sx: {
              p: 0,
            },
          },
        }}
        inputProps={{
          onChange,
          sx: {
            fontSize: 11,
            fontWeight: 500,
            "& .MuiInputAdornment-root": {
              m: 0,
            },
          },
        }}
        IconComponent={() => {
          return (
            <SvgIcon
              sx={{
                width: 9,
                height: 5,
                position: "absolute",
                right: 6,
                flexShrink: 0,
                pointerEvents: "none",
              }}
              viewBox="0 0 9 5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.14868 0H7.90312C8.33189 0 8.56177 0.504311 8.28053 0.827961L5.01977 4.58043C4.82495 4.80462 4.4788 4.81056 4.2764 4.59318L0.782729 0.840709C0.48502 0.520947 0.711779 0 1.14868 0Z"
                fill="black"
              />
            </SvgIcon>
          );
        }}
      >
        {options?.map((option, index) => (
          <MenuItem
            key={index}
            value={option.value as string | number}
            sx={{
              fontSize: 11,
              fontWeight: 500,
              minHeight: 28,
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </ThemeProvider>
  );
};

export default MuiSelectInput;
