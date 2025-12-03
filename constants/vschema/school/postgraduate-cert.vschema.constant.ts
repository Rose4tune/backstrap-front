import * as Yup from "yup";

export const POSTGRADUATE_CERT_VSCHEMA = Yup.object().shape({
  degreeCollege: Yup.string().required('소속 학교명을 입력해주세요.'),
  degreeMajor: Yup.string().required('소속 학과명을 입력해주세요.'),
  labName: Yup.string().required("소속 연구실을 입력해주세요."),
  researchTitle: Yup.string().required("연구 주제를 입력해주세요."),
  isHomeCollege: Yup.boolean().required("소속 연구실을 입력해주세요."),
  degreeCourseType: Yup.string().required("소속 연구실을 입력해주세요."),
  bachelorCollege: Yup.string(),
  bachelorMajor: Yup.string(),
  files: Yup.array()
    .required("학위 정보 확인을 위한 증빙 자료를 제출해주세요.")
    .min(1, "학위 정보 확인을 위한 증빙 자료를 제출해주세요."),
})
