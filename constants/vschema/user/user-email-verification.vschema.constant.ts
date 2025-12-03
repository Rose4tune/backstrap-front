import * as Yup from "yup";

import { EMAIL_VSCHEMA } from "../common.vschema.constant";

export const NAME_VSCHEMA = Yup.string().required("이름을 입력해주세요");

export const USER_EMAIL_VERIFICATION_VSCHEMA = Yup.object().shape({
  name: NAME_VSCHEMA,
  email: EMAIL_VSCHEMA.required("이메일을 입력해주세요."),
  isEmailVerified: Yup.boolean().required("").isTrue(""),
});
