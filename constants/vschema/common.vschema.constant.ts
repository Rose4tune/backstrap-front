import * as Yup from "yup";

export const EMAIL_VSCHEMA =
  Yup.string().email("올바른 이메일 형식이 아닙니다.");
