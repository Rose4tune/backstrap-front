import "moment/locale/ko";
import momentTz from "moment-timezone";

import { DATE_FORMAT_DISPLAY_MM_DD_A_HH_MI } from "@constants/common/date.constant";

import { getLocalTimezone } from "./timezone.util";

export const formatDateDisplay = (
  date: Date | string | number,
  format = DATE_FORMAT_DISPLAY_MM_DD_A_HH_MI,
  timeZone = getLocalTimezone(),
  locale = "ko"
): string => {
  const dateObj = new Date(date);

  return momentTz.tz(dateObj, timeZone).locale(locale).format(format);
};
