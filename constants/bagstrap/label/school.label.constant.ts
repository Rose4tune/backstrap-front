import { SchoolVerificationStatus } from "@generated/graphql";

export const SCHOOL_VERIFICATION_STATUS_LABEL = {
  [SchoolVerificationStatus.None]: "미인증",
  [SchoolVerificationStatus.InReview]: "처리 중입니다.",
  [SchoolVerificationStatus.Approved]: "승인",
  [SchoolVerificationStatus.Rejected]: "미인증",
};

export const SCHOOL_TYPE_LABEL = {
  HOME: '자대 진학',
  AWAY: '타대 진학', 
} as const
