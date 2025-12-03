import { FAEntityFileRegisterDto } from './FAEntityFileRegisterDto';
import { StudentType, TermsType } from './UserRegisterDTO';

export type EntityStatus = 'ACTIVE' | 'BLOCKED' | 'DELETED' | 'INVALID' | 'SEARCHABLE';
export type SchoolVerificationStatus = 'APPROVED' | ' IN_REVIEW' | 'NONE' | 'REJECTED';
export interface UserEditDto {
  uuid?: string;
  email?: string;
  name?: string;
  realName?: string;
  phone?: string;
  password?: string;
  currentPassword?: string;
  profileImageUrl?: string;
  entityStatus?: EntityStatus;
  description?: string;
  fcmToken?: string;
  schoolName?: string;
  major?: string;
  labName?: string;
  labResearchTopic?: string;
  admissionYear?: number;
  isPushNotificationOn?: boolean;
  schoolVerificationStatus?: SchoolVerificationStatus;
  schoolType?: string;
  schoolUuid?: string;
  studentType?: StudentType;
  files?: FAEntityFileRegisterDto[];
  bankName?: string;
  accountNumber?: string;
  bankUserName?: string;
  agreedTerms?: TermsType[];
}
