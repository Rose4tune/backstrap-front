import * as Yup from "yup";

export const SCHOOL_CERT_VSCHEMA = Yup.object().shape({
  schoolName: Yup.string().required("소속 학교명을 입력해주세요."),
  major: Yup.string().required("소속 학과명을 입력해주세요."),
  files: Yup.array()
    .required("학위 정보 확인을 위한 증빙 자료를 제출해주세요.")
    .min(1, "학위 정보 확인을 위한 증빙 자료를 제출해주세요."),
});
