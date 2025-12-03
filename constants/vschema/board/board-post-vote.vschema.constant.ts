import * as Yup from "yup";
import addMinutes from "date-fns/addMinutes";
import isAfter from "date-fns/isAfter";

import { isNotEmpty } from "@utils/common/base.util";
import { encodeDeadlineValues } from "@utils/bagstrap/board/vote.util";

export const BOARD_POST_VOTE_ITEM_VSCHEMA = Yup.object().shape({
  id: Yup.string().required(),
  value: Yup.string().optional(),
});

export const BOARD_POST_VOTE_VSCHEMA = Yup.object().shape({
  title: Yup.string().required("제목을 입력해주세요."),
  items: Yup.array()
    .of(BOARD_POST_VOTE_ITEM_VSCHEMA.required())
    .min(1, "최소 1개의 항목을 작성해주세요.")
    .test(
      "test_items_empty",
      "최소 1개의 항목을 작성해주세요.",
      (value) => value?.some((item) => isNotEmpty(item.value)) ?? false
    )
    .required(),
  isMultiSelect: Yup.boolean().optional(),
  deadlineValues: Yup.object()
    .shape({
      date: Yup.date(),
      ampm: Yup.string().oneOf(["am", "pm"]),
      hour: Yup.number().integer().min(1).max(12),
      minute: Yup.number().integer().min(0).max(60),
    })
    .test(
      "test_deadline_values",
      "마감시간은 최소 30분 이후로 설정해주세요.",
      (value) => {
        const { date, ampm, hour, minute } = value || {};

        return date != null && ampm != null && hour != null && minute != null
          ? isAfter(
              encodeDeadlineValues({ date, ampm, hour, minute }),
              addMinutes(new Date(), 29)
            )
          : true;
      }
    )
    .optional(),
});
