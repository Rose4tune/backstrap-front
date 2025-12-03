import * as Yup from "yup";

const PASSWORD_REGEX = /[a-zA-Z0-9!@#$&*~]{8,20}/g

export const PASSWORD_VSCHEMA = Yup.string().min(
  8,
  "8자리 이상으로 입력해주세요."
).matches(PASSWORD_REGEX, "영문, 숫자, 특수문자(~,!,@,#,$,&,*)만 사용 가능합니다.");

export const PASSWORD_CONFIRM_VSCHEMA = Yup.string().oneOf(
  [Yup.ref("password"), null],
  "비밀번호가 일치하지 않습니다."
);

export const USER_PASSWORD_CHANGE_VSCHEMA = Yup.object().shape({
  password: PASSWORD_VSCHEMA.required("비밀번호를 입력해주세요."),
  passwordConfirm:
    PASSWORD_CONFIRM_VSCHEMA.required("비밀번호를 다시 입력해주세요."),
});

export const USER_PASSWORD_RESET_VSCHEMA = Yup.object().shape({
  password: PASSWORD_VSCHEMA.required("비밀번호를 입력해주세요."),
  passwordConfirm:
    PASSWORD_CONFIRM_VSCHEMA.required("비밀번호를 다시 입력해주세요."),
});
