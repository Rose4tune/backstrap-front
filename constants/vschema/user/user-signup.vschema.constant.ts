import * as Yup from "yup";

import { StudentType } from "@generated/graphql";

import { EMAIL_VSCHEMA } from "../common.vschema.constant";
import {
  PASSWORD_VSCHEMA,
  PASSWORD_CONFIRM_VSCHEMA,
} from "./user-password.vschema.constant";

export const NAME_VSCHEMA = Yup.string().required("닉네임을 입력해주세요.");
export const IS_NAME_DUPLICATE_VSCHEMA =
  Yup.boolean().isFalse("이미 사용중인 닉네임입니다.");
export const REAL_NAME_VSCHEMA =
  Yup.string().required("이름(실명)을 입력해주세요.");
export const STUDENT_TYPE_VSCHEMA = Yup.string()
  .required()
  .oneOf(Object.values(StudentType));

export const USER_SIGNUP_EMAIL_VSCHEMA = Yup.object().shape({
  name: NAME_VSCHEMA,
  isNameDuplicate: IS_NAME_DUPLICATE_VSCHEMA,
  realName: REAL_NAME_VSCHEMA,
  studentType: STUDENT_TYPE_VSCHEMA,
  email: EMAIL_VSCHEMA.required("이메일을 입력해주세요."),
  isEmailVerified: Yup.boolean().required().isTrue(),
  password: PASSWORD_VSCHEMA.required("비밀번호를 입력해주세요."),
  passwordConfirm:
    PASSWORD_CONFIRM_VSCHEMA.required("비밀번호를 다시 입력해주세요."),
});

export const USER_SIGNUP_SOCIAL_VSCHEMA = Yup.object().shape({
  name: NAME_VSCHEMA,
  isNameDuplicate: IS_NAME_DUPLICATE_VSCHEMA,
  realName: REAL_NAME_VSCHEMA,
  studentType: STUDENT_TYPE_VSCHEMA,
});
