import { FAEntityFileRegisterDto } from './FAEntityFileRegisterDto';

export type GenderType = 'FEMALE' | 'MALE' | 'NONE';
export type InterestCategory = 'BUSINESS' | 'POLITICS' | 'SPORT';
export enum StudentType {
  NONE = 'NONE',
  UNDERGRADUATE = 'UNDERGRADUATE',
  POSTDOCTOR = 'POSTDOCTOR',
  MASTER = 'MASTER',
  DOCTOR = 'DOCTOR',
  PHD = 'PHD',
  PROFESSOR = 'PROFESSOR'
}

//수정필요
export const studentTypeMap: Record<string, StudentType> = {
  학사: StudentType.UNDERGRADUATE,
  석사: StudentType.MASTER,
  박사: StudentType.PHD,
  포닥: StudentType.POSTDOCTOR,
  교수: StudentType.PROFESSOR
};

export type SocialProvider = 'APP' | 'APPLE' | 'FACEBOOK' | 'KAKAOTALK';
export type UserStatus = 'ACTIVATED' | 'DEACTIVATED' | 'NOT_VERIFIED';
export type TermsType =
  | 'COMMUNITY_RULE'
  | 'MARKETING'
  | 'PERSONAL_INFO_USE'
  | 'SERVICE_USE';

export type FileType = 'MENTOR_CERTIFICATE' | 'SCHOOL_CERTIFICATE';

export interface UserRegisterDto {
  email?: string;
  name?: string;
  realName?: string;
  profileImageUrl?: string;
  password?: string;
  birth?: string; // e.g., "920301"
  gender?: GenderType;
  phone?: string;
  interestCategories?: InterestCategory[]; // Set in Java, but array in JSON
  studentType?: StudentType;
  provider?: SocialProvider;
  providerToken?: string;
  providerId?: string; // Deprecated
  status?: UserStatus;
  fcmToken?: string;
  schoolName?: string;
  major?: string;
  labName?: string;
  labResearchTopic?: string;
  admissionYear?: number;
  isPushNotificationOn?: boolean;
  files?: FAEntityFileRegisterDto[];
  agreedTerms?: TermsType[];
}
