import React from "react";
import { useClickAway } from "react-use";

import koLocale from "date-fns/locale/ko";

import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import { formatDateDisplay } from "@utils/common/date.util";

import { DATE_FORMAT_DISPLAY_YYYY_MM_DD } from "@constants/common/date.constant";

const CELL_SIZE = 28;
const CALENDAR_SIZE = 210;
const INPUT_SIZE = 118;

export interface MuiDatePickerInputProps extends Omit<BaseInputProps, "value"> {
  value?: BaseInputProps["value"] | Date;

  onOpen?: () => void;
}

const MuiDatePickerInput = (props: MuiDatePickerInputProps): JSX.Element => {
  const { name, value, onChange, onOpen } = props;

  const [isOpen, setIsOpen] = React.useState(false);

  const ref = React.useRef<HTMLDivElement>(null);

  useClickAway(ref, () => {
    setIsOpen(false);
  });

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
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: isOpen ? "#EFF6F6" : undefined,
          },
          notchedOutline: () => ({
            borderColor: "#E5E5EB !important",
            borderWidth: "1px !important",
          }),
        },
      },
      MuiInputAdornment: {
        styleOverrides: {
          positionEnd: {
            paddingLeft: 4,
            paddingRight: 4,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: 0,
          },
        },
      },
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      onOpen?.call(null);
    }
  }, [isOpen]);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={koLocale}
      >
        <div ref={ref} className="relative">
          <DesktopDatePicker
            inputFormat="yyyy년 MM월 dd일"
            disableMaskedInput
            value={
              value &&
              (value instanceof Date ||
                typeof value === "string" ||
                typeof value === "number")
                ? new Date(value)
                : undefined
            }
            onChange={(dateValue) => {
              onChange?.call(null, {
                target: {
                  name,
                  value: dateValue?.toString(),
                },
              } as any);
            }}
            open={isOpen}
            onOpen={() => {
              setIsOpen(true);
            }}
            onClose={() => {
              setIsOpen(false);
            }}
            views={["day"]}
            closeOnSelect
            showDaysOutsideCurrentMonth
            disablePast
            ignoreInvalidInputs
            reduceAnimations
            renderInput={({
              // unused props
              error: _,
              disabled: __,

              InputProps,
              ...params
            }) => {
              return (
                <TextField
                  {...params}
                  value={
                    value &&
                    (typeof value === "string" || value instanceof Date) &&
                    formatDateDisplay(
                      new Date(value),
                      DATE_FORMAT_DISPLAY_YYYY_MM_DD
                    )
                  }
                  size="small"
                  disabled
                  onClick={() => {
                    setIsOpen((prev) => !prev);
                  }}
                  sx={{
                    width: INPUT_SIZE,
                  }}
                  variant="outlined"
                  InputProps={{
                    ...InputProps,
                    disabled: true,
                    sx: {
                      fontSize: 11,
                      fontWeight: 500,
                      pr: 1.5,
                      "& .MuiInputAdornment-root": {
                        m: 0,
                      },
                    },
                    inputProps: {
                      sx: {
                        pl: 1,
                        textAlign: "center",
                        cursor: "pointer",
                      },
                    },
                  }}
                />
              );
            }}
            PopperProps={{
              disablePortal: true,
              placement: "bottom",
              sx: {
                position: "absolute !important",
                top: `36px !important`,
              },
            }}
            PaperProps={{
              sx: {
                borderRadius: 0,
                boxShadow: "0 0 8px 0 rgba(0, 0, 0, 0.1)",
              },
            }}
            OpenPickerButtonProps={{
              onClick: () => {
                setIsOpen((prev) => !prev);
              },
            }}
            TransitionComponent={(transitionProps) => (
              <Box
                {...transitionProps}
                sx={{
                  "& > div": {
                    minWidth: CALENDAR_SIZE,
                  },
                  "& .MuiCalendarPicker-root": {
                    width: CALENDAR_SIZE,
                    '& div[role="presentation"]': {
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#157974",
                    },
                    "& > div:first-of-type": {
                      mt: 1,
                      mb: 0,
                      pl: 1.5,
                      pr: 1,
                    },
                  },
                  "& > div > div, & > div > div > div": {
                    width: CALENDAR_SIZE,
                  },
                  "& .MuiTypography-caption": {
                    width: CELL_SIZE,
                    margin: 0,
                    height: 24,
                    fontWeight: 400,
                    fontSize: 11,
                    color: "#727272",
                  },
                  "& .PrivatePickersSlideTransition-root": {
                    minHeight: "auto",
                    '& [role="grid"]': {
                      position: "static",
                      pb: 1,
                    },
                    '& [role="row"]': {
                      margin: 0,
                    },
                  },
                  "& .MuiPickersDay-dayWithMargin": {
                    margin: 0,
                  },
                  "& .MuiPickersDay-root": {
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    fontSize: 11,
                    fontWeight: 500,
                    "&.Mui-selected": {
                      color: "#000000",
                      backgroundColor: "#EFF6F6 !important",
                    },
                    "&.Mui-disabled": {
                      color: "#BFBFBF",
                      fontWeight: 400,
                    },
                    "&:hover": {
                      backgroundColor: "#F6F6F6 !important",
                    },
                    "&.MuiPickersDay-today": {
                      border: "none",
                      fontSize: 13,
                      fontWeight: 700,
                      textDecoration: "underline",
                    },
                    "&.MuiPickersDay-dayOutsideMonth": {
                      color: "#BFBFBF",
                      fontWeight: 400,
                    },
                  },
                  "& .MuiPickersArrowSwitcher-spacer": {
                    width: 0,
                  },
                }}
              />
            )}
            components={{
              LeftArrowButton: (props) => (
                <Button
                  {...props}
                  sx={{
                    color: "#A6A6A6",
                    padding: 0,
                    minWidth: 0,
                    width: "auto",
                  }}
                />
              ),
              RightArrowButton: (props) => (
                <Button
                  {...props}
                  sx={{
                    color: "#A6A6A6",
                    padding: 0,
                    minWidth: 0,
                    width: "auto",
                  }}
                />
              ),
              OpenPickerIcon: () => (
                <SvgIcon
                  sx={{
                    width: 9,
                    height: 5,
                  }}
                  viewBox="0 0 9 5"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={(evt) => {
                    evt.stopPropagation();

                    setIsOpen((prev) => !prev);
                  }}
                >
                  <path
                    d="M1.14868 0H7.90312C8.33189 0 8.56177 0.504311 8.28053 0.827961L5.01977 4.58043C4.82495 4.80462 4.4788 4.81056 4.2764 4.59318L0.782729 0.840709C0.48502 0.520947 0.711779 0 1.14868 0Z"
                    fill="black"
                  />
                </SvgIcon>
              ),
              SwitchViewButton: () => null,
            }}
          />
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default MuiDatePickerInput;
