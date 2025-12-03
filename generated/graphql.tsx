import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  LocalDate: any;
  LocalDateTime: any;
  LocalTime: any;
  Long: any;
  Map_LocalDate_List_EntityStatisticsViewDtoScalar: any;
  Map_LocalDate_List_UserViewDtoScalar: any;
  Map_String_StringScalar: any;
  UNREPRESENTABLE: any;
};

export type AnnounceEditDtoInput = {
  changeLog?: InputMaybe<Scalars['String']>;
  company?: InputMaybe<Scalars['String']>;
  content?: InputMaybe<Scalars['String']>;
  entityStatus?: InputMaybe<EntityStatus>;
  imageUrl?: InputMaybe<Scalars['String']>;
  labKeywordUuids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title?: InputMaybe<Scalars['String']>;
  totiKeywordUuids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  uuid: Scalars['String'];
};

export type AnnounceFetchDtoInput = {
  announceType?: InputMaybe<AnnounceType>;
  entityStatus?: InputMaybe<EntityStatus>;
  paginationRequestDto: PaginationRequestDto_StringInput;
  sortType?: InputMaybe<AnnounceSortType>;
};

export type AnnounceKeywordResponse = {
  __typename?: 'AnnounceKeywordResponse';
  code: Scalars['String'];
  name: Scalars['String'];
  uuid: Scalars['String'];
};

export enum AnnounceKeywordType {
  Lab = 'LAB',
  Toti = 'TOTI'
}

export type AnnounceMutationResponse = {
  __typename?: 'AnnounceMutationResponse';
  entityStatus: EntityStatus;
  uuid: Scalars['String'];
};

export type AnnouncePaginationResponse = {
  __typename?: 'AnnouncePaginationResponse';
  cursor?: Maybe<Scalars['String']>;
  data: Array<Maybe<AnnounceResponse>>;
  page: Scalars['Long'];
  totalCount: Scalars['Long'];
};

export type AnnounceRegisterDtoInput = {
  announceType: AnnounceType;
  company?: InputMaybe<Scalars['String']>;
  content: Scalars['String'];
  entityStatus?: InputMaybe<EntityStatus>;
  imageUrl?: InputMaybe<Scalars['String']>;
  labKeywordUuids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title?: InputMaybe<Scalars['String']>;
  totiKeywordUuids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type AnnounceResponse = {
  __typename?: 'AnnounceResponse';
  announceType?: Maybe<AnnounceType>;
  company?: Maybe<Scalars['String']>;
  content: Scalars['String'];
  createdBy: Scalars['String'];
  createdDate: Scalars['LocalDateTime'];
  entityStatus: EntityStatus;
  imageUrl?: Maybe<Scalars['String']>;
  labKeywords: Array<Maybe<AnnounceKeywordResponse>>;
  lastModifiedBy: Scalars['String'];
  lastModifiedDate: Scalars['LocalDateTime'];
  title?: Maybe<Scalars['String']>;
  totiKeywords: Array<Maybe<AnnounceKeywordResponse>>;
  uuid: Scalars['String'];
};

export enum AnnounceSortType {
  Recent = 'RECENT',
  Register = 'REGISTER'
}

export enum AnnounceType {
  All = 'ALL',
  EmployLab = 'EMPLOY_LAB',
  ExamSchool = 'EXAM_SCHOOL'
}

export type AppRole = {
  __typename?: 'AppRole';
  permissions?: Maybe<Array<Maybe<Scalars['String']>>>;
  roleId: Scalars['String'];
};

export type AppRoleViewDto = {
  __typename?: 'AppRoleViewDto';
  roleId?: Maybe<Scalars['String']>;
};

export enum BannerAction {
  ExternalLink = 'EXTERNAL_LINK',
  InternalLink = 'INTERNAL_LINK',
  None = 'NONE'
}

export enum BannerType {
  Big = 'BIG',
  None = 'NONE',
  Small = 'SMALL'
}

export type BannerViewDto = {
  __typename?: 'BannerViewDto';
  action?: Maybe<BannerAction>;
  actionValue?: Maybe<Scalars['String']>;
  backgroundColor: Scalars['Int'];
  createdBy?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  description?: Maybe<Scalars['String']>;
  displayOrder: Scalars['Int'];
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  endDate: Scalars['Long'];
  entityStatus?: Maybe<EntityStatus>;
  imageUrl?: Maybe<Scalars['String']>;
  indexBackgroundColor: Scalars['Int'];
  indexColor: Scalars['Int'];
  indexStrokeColor: Scalars['Int'];
  lastModifiedBy?: Maybe<Scalars['String']>;
  lastModifiedDate?: Maybe<Scalars['LocalDateTime']>;
  startDate: Scalars['Long'];
  title?: Maybe<Scalars['String']>;
  type?: Maybe<BannerType>;
  uuid: Scalars['String'];
};

export type BlindDateApplicationFetchDtoInput = {
  age?: InputMaybe<Scalars['Int']>;
  ageMax?: InputMaybe<Scalars['Int']>;
  ageMin?: InputMaybe<Scalars['Int']>;
  entityStatus?: InputMaybe<EntityStatus>;
  gender?: InputMaybe<Scalars['Boolean']>;
  longDistance?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  note?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  round?: InputMaybe<Scalars['Int']>;
  sameCollege?: InputMaybe<Scalars['Boolean']>;
  sameGender?: InputMaybe<Scalars['Boolean']>;
};

export type BlindDateApplicationRegisterDtoInput = {
  age?: InputMaybe<Scalars['Int']>;
  ageMax?: InputMaybe<Scalars['Int']>;
  ageMin?: InputMaybe<Scalars['Int']>;
  entityStatus?: InputMaybe<EntityStatus>;
  gender?: InputMaybe<Scalars['Boolean']>;
  longDistance?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  note?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  round?: InputMaybe<Scalars['Int']>;
  sameCollege?: InputMaybe<Scalars['Boolean']>;
  sameGender?: InputMaybe<Scalars['Boolean']>;
};

export type BlindDateApplicationResponse = {
  __typename?: 'BlindDateApplicationResponse';
  age: Scalars['Int'];
  ageMax: Scalars['Int'];
  ageMin: Scalars['Int'];
  gender: Scalars['Boolean'];
  longDistance: Scalars['Boolean'];
  name: Scalars['String'];
  note: Scalars['String'];
  phoneNumber: Scalars['String'];
  round: Scalars['Int'];
  sameCollege: Scalars['Boolean'];
  sameGender: Scalars['Boolean'];
  userUuid: Scalars['String'];
  uuid: Scalars['String'];
};

export type BlindDateMatchRegisterDtoInput = {
  entityStatus?: InputMaybe<EntityStatus>;
  receiverId: Scalars['Long'];
  round: Scalars['Long'];
  senderId: Scalars['Long'];
};

export type BlockInteractionRegisterDtoInput = {
  entityStatus?: InputMaybe<EntityStatus>;
  parentEntityType: EntityType;
  parentEntityUuid: Scalars['String'];
  targetEntityType: EntityType;
  targetEntityUuid: Scalars['String'];
};

export type BoardEditDtoInput = {
  categoryUuid?: InputMaybe<Scalars['String']>;
  changeLog?: InputMaybe<Scalars['String']>;
  content?: InputMaybe<Scalars['String']>;
  entityStatus?: InputMaybe<EntityStatus>;
  files?: InputMaybe<Array<InputMaybe<FaEntityFileRegisterDtoInput>>>;
  isAnonymous?: InputMaybe<Scalars['Boolean']>;
  isDisplayTop?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
  uuid: Scalars['String'];
};

export type BoardEntityView = {
  __typename?: 'BoardEntityView';
  boardKeywords?: Maybe<Array<Maybe<BoardKeywordViewDto>>>;
  bookmarkCount?: Maybe<Scalars['Long']>;
  category?: Maybe<FaGroupEntityView>;
  content: Scalars['String'];
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  createdUserId?: Maybe<Scalars['Long']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  files?: Maybe<Array<Maybe<FaEntityFileEntityView>>>;
  hotBoard?: Maybe<Scalars['Boolean']>;
  isAnonymous: Scalars['Boolean'];
  isBookmarkedByMe?: Maybe<Scalars['Boolean']>;
  isLikedByMe?: Maybe<Scalars['Boolean']>;
  likeCount?: Maybe<Scalars['Long']>;
  mentorUuid?: Maybe<Scalars['String']>;
  popularCount?: Maybe<Scalars['Long']>;
  reviewCount?: Maybe<Scalars['Long']>;
  title: Scalars['String'];
  user?: Maybe<UserEntityView>;
  userReports?: Maybe<Array<Maybe<UserReportEntityView>>>;
  uuid: Scalars['String'];
  version: Scalars['Int'];
  vote?: Maybe<VoteEntityView>;
};

export type BoardFetchDtoInput = {
  boardType?: InputMaybe<BoardType>;
  dateRange?: InputMaybe<DateRangeInput>;
  entityStatus?: InputMaybe<EntityStatus>;
  fetchType?: InputMaybe<BoardFetchType>;
  groupUuid?: InputMaybe<Scalars['String']>;
  isDisplayTop?: InputMaybe<Scalars['Boolean']>;
  keywordUuids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  paginationRequestDto: PaginationRequestDto_StringInput;
  searchKeyword?: InputMaybe<Scalars['String']>;
  sortType?: InputMaybe<BoardSortType>;
  userUuid?: InputMaybe<Scalars['String']>;
};

export enum BoardFetchType {
  Like = 'LIKE',
  MyScrap = 'MY_SCRAP',
  Review = 'REVIEW'
}

export type BoardKeywordViewDto = {
  __typename?: 'BoardKeywordViewDto';
  createdBy?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  displayOrder?: Maybe<Scalars['Int']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  keyword?: Maybe<FaGroupViewDto>;
  lastModifiedBy?: Maybe<Scalars['String']>;
  lastModifiedDate?: Maybe<Scalars['LocalDateTime']>;
  uuid: Scalars['String'];
};

export type BoardPaginationResultDto = {
  __typename?: 'BoardPaginationResultDto';
  cursor?: Maybe<Scalars['String']>;
  data: Array<Maybe<BoardEntityView>>;
  page: Scalars['Long'];
  totalCount: Scalars['Long'];
};

export type BoardRegisterDtoInput = {
  boardType?: InputMaybe<BoardType>;
  categoryUuid?: InputMaybe<Scalars['String']>;
  content: Scalars['String'];
  entityStatus?: InputMaybe<EntityStatus>;
  files?: InputMaybe<Array<InputMaybe<FaEntityFileRegisterDtoInput>>>;
  isAnonymous?: InputMaybe<Scalars['Boolean']>;
  keywordUuids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title: Scalars['String'];
  version?: InputMaybe<Scalars['Int']>;
  voteRegisterDto?: InputMaybe<VoteRegisterDtoInput>;
};

export enum BoardSortType {
  Like = 'LIKE',
  Popular = 'POPULAR',
  Recent = 'RECENT'
}

export enum BoardType {
  Toty = 'TOTY'
}

export type CategoryRefEntityView = {
  __typename?: 'CategoryRefEntityView';
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  leaf?: Maybe<Scalars['Boolean']>;
  scraped?: Maybe<Scalars['Boolean']>;
  uuid: Scalars['String'];
};

export type CategoryRefRegisterDtoInput = {
  code?: InputMaybe<Scalars['String']>;
  entityStatus?: InputMaybe<EntityStatus>;
  name: Scalars['String'];
  parentId?: InputMaybe<Scalars['Long']>;
  type: Scalars['String'];
};

export type CategoryRefViewDto = {
  __typename?: 'CategoryRefViewDto';
  code?: Maybe<Scalars['String']>;
  isLeaf?: Maybe<Scalars['Boolean']>;
  isScraped?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  parentId?: Maybe<Scalars['Long']>;
  treeLeft?: Maybe<Scalars['Long']>;
  treeLevel?: Maybe<Scalars['Long']>;
  treeRight?: Maybe<Scalars['Long']>;
  uuid: Scalars['String'];
};

export type ConfigDto = {
  __typename?: 'ConfigDto';
  androidMinVersion?: Maybe<Scalars['String']>;
  iosMinVersion?: Maybe<Scalars['String']>;
};

export type CustomCourseEntityView = {
  __typename?: 'CustomCourseEntityView';
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  dayAndTimeRanges?: Maybe<Array<Maybe<DayAndTimeRange>>>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  professors?: Maybe<Scalars['String']>;
  roomName?: Maybe<Scalars['String']>;
  subjectName?: Maybe<Scalars['String']>;
  timeTableUuid?: Maybe<Scalars['String']>;
  uuid: Scalars['String'];
};

export type CustomCourseRegisterDtoInput = {
  dayAndTimeRanges: Array<InputMaybe<DayAndTimeRangeInput>>;
  entityStatus?: InputMaybe<EntityStatus>;
  professors: Scalars['String'];
  roomName?: InputMaybe<Scalars['String']>;
  subjectName: Scalars['String'];
  timeTableUuid: Scalars['String'];
};

export type DateRangeInput = {
  fromDate: Scalars['LocalDate'];
  toDate?: InputMaybe<Scalars['LocalDate']>;
};

export type DateTimeRangeInput = {
  fromDate: Scalars['LocalDateTime'];
  toDate?: InputMaybe<Scalars['LocalDateTime']>;
};

export type DayAndTimeRange = {
  __typename?: 'DayAndTimeRange';
  dayOfWeek?: Maybe<DayOfWeek>;
  timeRange?: Maybe<TimeRange>;
};

export type DayAndTimeRangeInput = {
  dayOfWeek?: InputMaybe<DayOfWeek>;
  timeRange?: InputMaybe<TimeRangeInput>;
};

export enum DayOfWeek {
  Friday = 'FRIDAY',
  Monday = 'MONDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY',
  Thursday = 'THURSDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY'
}

export enum DegreeCourseType {
  Joint = 'JOINT',
  Master = 'MASTER',
  Philosophy = 'PHILOSOPHY'
}

export enum Direction {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type EntityStatisticsFetchDtoInput = {
  dateRange: DateRangeInput;
  entityStatisticsType: EntityStatisticsType;
  parentEntityType: EntityType;
  parentEntityUuid?: InputMaybe<Scalars['String']>;
};

export type EntityStatisticsRegisterDtoInput = {
  entityStatisticsType: EntityStatisticsType;
  entityStatus?: InputMaybe<EntityStatus>;
  parentEntityType: EntityType;
  parentEntityUuid: Scalars['String'];
};

export enum EntityStatisticsType {
  View = 'VIEW'
}

export type EntityStatisticsViewDto = {
  __typename?: 'EntityStatisticsViewDto';
  createdBy?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatisticsType: EntityStatisticsType;
  entityStatus?: Maybe<EntityStatus>;
  lastModifiedBy?: Maybe<Scalars['String']>;
  lastModifiedDate?: Maybe<Scalars['LocalDateTime']>;
  parentEntityType: EntityType;
  parentEntityUuid: Scalars['String'];
  user: UserViewDto;
  uuid: Scalars['String'];
};

export type EntityStatisticsViewMapDto = {
  __typename?: 'EntityStatisticsViewMapDto';
  createdBy?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  dateAndEntityStatistics?: Maybe<Scalars['Map_LocalDate_List_EntityStatisticsViewDtoScalar']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  lastModifiedBy?: Maybe<Scalars['String']>;
  lastModifiedDate?: Maybe<Scalars['LocalDateTime']>;
  uuid: Scalars['String'];
};

export enum EntityStatus {
  Active = 'ACTIVE',
  Blocked = 'BLOCKED',
  Deleted = 'DELETED',
  Invalid = 'INVALID',
  Searchable = 'SEARCHABLE'
}

export enum EntityType {
  Board = 'BOARD',
  CategoryRef = 'CATEGORY_REF',
  FaGroup = 'FA_GROUP',
  Review = 'REVIEW',
  Room = 'ROOM',
  SchoolBoard = 'SCHOOL_BOARD',
  SchoolReview = 'SCHOOL_REVIEW',
  SchoolVerification = 'SCHOOL_VERIFICATION',
  TotiAnswer = 'TOTI_ANSWER',
  TotiComment = 'TOTI_COMMENT',
  TotiMentor = 'TOTI_MENTOR',
  TotiQuestion = 'TOTI_QUESTION',
  User = 'USER',
  UserMessage = 'USER_MESSAGE'
}

export type FaEntityFileEntityView = {
  __typename?: 'FAEntityFileEntityView';
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  description?: Maybe<Scalars['String']>;
  displayOrder?: Maybe<Scalars['Int']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  file?: Maybe<FileEntityView>;
  parentEntityId?: Maybe<Scalars['Long']>;
  parentEntityType?: Maybe<EntityType>;
  uuid: Scalars['String'];
};

export type FaEntityFileRegisterDtoInput = {
  description?: InputMaybe<Scalars['String']>;
  displayOrder: Scalars['Int'];
  fileType?: InputMaybe<FileType>;
  fileUuid: Scalars['String'];
};

export type FaEntityFileViewDto = {
  __typename?: 'FAEntityFileViewDto';
  createdBy?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  description?: Maybe<Scalars['String']>;
  displayOrder?: Maybe<Scalars['Int']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  file?: Maybe<FileViewDto>;
  lastModifiedBy?: Maybe<Scalars['String']>;
  lastModifiedDate?: Maybe<Scalars['LocalDateTime']>;
  parentEntityId?: Maybe<Scalars['Long']>;
  parentEntityType?: Maybe<EntityType>;
  uuid: Scalars['String'];
};

export type FaEntityFileViewDtoInput = {
  createdBy?: InputMaybe<Scalars['String']>;
  createdDate?: InputMaybe<Scalars['LocalDateTime']>;
  description?: InputMaybe<Scalars['String']>;
  displayOrder?: InputMaybe<Scalars['Int']>;
  entityStatus?: InputMaybe<EntityStatus>;
  file?: InputMaybe<FileViewDtoInput>;
  lastModifiedBy?: InputMaybe<Scalars['String']>;
  lastModifiedDate?: InputMaybe<Scalars['LocalDateTime']>;
  parentEntityId?: InputMaybe<Scalars['Long']>;
  parentEntityType?: InputMaybe<EntityType>;
  uuid?: InputMaybe<Scalars['String']>;
};

export type FaEntityGroupViewDto = {
  __typename?: 'FAEntityGroupViewDto';
  createdBy?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  displayOrder?: Maybe<Scalars['Int']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  group?: Maybe<FaGroupViewDto>;
  lastModifiedBy?: Maybe<Scalars['String']>;
  lastModifiedDate?: Maybe<Scalars['LocalDateTime']>;
  parentEntityId?: Maybe<Scalars['Long']>;
  parentEntityType?: Maybe<EntityType>;
  uuid: Scalars['String'];
};

export type FaEntityGroupViewDtoInput = {
  createdBy?: InputMaybe<Scalars['String']>;
  createdDate?: InputMaybe<Scalars['LocalDateTime']>;
  displayOrder?: InputMaybe<Scalars['Int']>;
  entityStatus?: InputMaybe<EntityStatus>;
  group?: InputMaybe<FaGroupViewDtoInput>;
  lastModifiedBy?: InputMaybe<Scalars['String']>;
  lastModifiedDate?: InputMaybe<Scalars['LocalDateTime']>;
  parentEntityId?: InputMaybe<Scalars['Long']>;
  parentEntityType?: InputMaybe<EntityType>;
  uuid?: InputMaybe<Scalars['String']>;
};

export type FaGroupEntityView = {
  __typename?: 'FAGroupEntityView';
  code?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  description?: Maybe<Scalars['String']>;
  displayOrder?: Maybe<Scalars['Int']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  iconUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  subGroupType?: Maybe<FaSubGroupType>;
  uuid: Scalars['String'];
  writable?: Maybe<Scalars['Boolean']>;
};

export type FaGroupFetchDtoInput = {
  entityStatus?: InputMaybe<EntityStatus>;
  groupType: FaGroupType;
  paginationRequestDto: PaginationRequestDto_StringInput;
  reviewType?: InputMaybe<ReviewType>;
  sortType: GroupSortType;
};

export type FaGroupPaginationResultDto = {
  __typename?: 'FAGroupPaginationResultDto';
  cursor?: Maybe<Scalars['String']>;
  data: Array<Maybe<FaGroupViewDto>>;
  page: Scalars['Long'];
  totalCount: Scalars['Long'];
};

export type FaGroupRegisterDtoInput = {
  code: Scalars['String'];
  entityStatus?: InputMaybe<EntityStatus>;
  groupType: FaGroupType;
  name: Scalars['String'];
};

export enum FaGroupType {
  Board = 'BOARD',
  MentorKeyword = 'MENTOR_KEYWORD',
  RestaurantBusinessType = 'RESTAURANT_BUSINESS_TYPE',
  ReviewRestaurantProperty = 'REVIEW_RESTAURANT_PROPERTY',
  Tag = 'TAG'
}

export type FaGroupViewDto = {
  __typename?: 'FAGroupViewDto';
  code?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  description?: Maybe<Scalars['String']>;
  displayOrder?: Maybe<Scalars['Int']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  iconUrl?: Maybe<Scalars['String']>;
  lastModifiedBy?: Maybe<Scalars['String']>;
  lastModifiedDate?: Maybe<Scalars['LocalDateTime']>;
  name?: Maybe<Scalars['String']>;
  subGroupType?: Maybe<FaSubGroupType>;
  uuid: Scalars['String'];
  writable?: Maybe<Scalars['Boolean']>;
};

export type FaGroupViewDtoInput = {
  code?: InputMaybe<Scalars['String']>;
  createdBy?: InputMaybe<Scalars['String']>;
  createdDate?: InputMaybe<Scalars['LocalDateTime']>;
  description?: InputMaybe<Scalars['String']>;
  displayOrder?: InputMaybe<Scalars['Int']>;
  entityStatus?: InputMaybe<EntityStatus>;
  iconUrl?: InputMaybe<Scalars['String']>;
  lastModifiedBy?: InputMaybe<Scalars['String']>;
  lastModifiedDate?: InputMaybe<Scalars['LocalDateTime']>;
  name?: InputMaybe<Scalars['String']>;
  subGroupType?: InputMaybe<FaSubGroupType>;
  uuid?: InputMaybe<Scalars['String']>;
};

export enum FaSubGroupType {
  AfterCourseJob = 'AFTER_COURSE_JOB',
  General = 'GENERAL',
  Major = 'MAJOR',
  Professional = 'PROFESSIONAL'
}

export enum FaUploadScope {
  All = 'ALL',
  Me = 'ME'
}

export type FileEntityView = {
  __typename?: 'FileEntityView';
  contentType?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  name?: Maybe<Scalars['String']>;
  s3Key?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  uuid: Scalars['String'];
};

export enum FileType {
  MentorCertificate = 'MENTOR_CERTIFICATE',
  SchoolCertificate = 'SCHOOL_CERTIFICATE'
}

export type FileViewDto = {
  __typename?: 'FileViewDto';
  contentType?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  lastModifiedBy?: Maybe<Scalars['String']>;
  lastModifiedDate?: Maybe<Scalars['LocalDateTime']>;
  name?: Maybe<Scalars['String']>;
  s3Key?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  uuid: Scalars['String'];
};

export type FileViewDtoInput = {
  contentType?: InputMaybe<Scalars['String']>;
  createdBy?: InputMaybe<Scalars['String']>;
  createdDate?: InputMaybe<Scalars['LocalDateTime']>;
  entityStatus?: InputMaybe<EntityStatus>;
  lastModifiedBy?: InputMaybe<Scalars['String']>;
  lastModifiedDate?: InputMaybe<Scalars['LocalDateTime']>;
  name?: InputMaybe<Scalars['String']>;
  s3Key?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
  uuid?: InputMaybe<Scalars['String']>;
};

export enum GenderType {
  Female = 'FEMALE',
  Male = 'MALE',
  None = 'NONE'
}

export enum GroupSortType {
  Popular = 'POPULAR',
  Recent = 'RECENT'
}

export enum InterestCategory {
  Business = 'BUSINESS',
  Politics = 'POLITICS',
  Sport = 'SPORT'
}

export type LabKeywordResponse = {
  __typename?: 'LabKeywordResponse';
  code: Scalars['String'];
  name: Scalars['String'];
  uuid: Scalars['String'];
};

export type MailVerificationDto = {
  __typename?: 'MailVerificationDto';
  createdBy?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  desc?: Maybe<Scalars['String']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  expiredAt?: Maybe<Scalars['LocalDateTime']>;
  lastModifiedBy?: Maybe<Scalars['String']>;
  lastModifiedDate?: Maybe<Scalars['LocalDateTime']>;
  status?: Maybe<MailVerificationStatus>;
  user?: Maybe<UserViewDto>;
  uuid: Scalars['String'];
  verifiedAt?: Maybe<Scalars['LocalDateTime']>;
};

export enum MailVerificationStatus {
  Sent = 'SENT',
  Unsent = 'UNSENT',
  Verified = 'VERIFIED'
}

export enum MajorCategory {
  ArtsAndPhysicalEducation = 'ARTS_AND_PHYSICAL_EDUCATION',
  Engineering = 'ENGINEERING',
  Humanities = 'HUMANITIES',
  MedicalAndPharmaceutical = 'MEDICAL_AND_PHARMACEUTICAL',
  NaturalSciences = 'NATURAL_SCIENCES',
  SocialSciences = 'SOCIAL_SCIENCES',
  Unknown = 'UNKNOWN'
}

/** Mutation root */
export type Mutation = {
  __typename?: 'Mutation';
  applySchoolVerification: Scalars['Boolean'];
  closePopUp: Scalars['Boolean'];
  createAdminUser: UserEntityView;
  createUser: UserEntityView;
  createUserAppRole?: Maybe<UserAppRoleViewDto>;
  deleteBoard: Scalars['Boolean'];
  deleteInfoBoard: Scalars['Boolean'];
  deleteNotice: Scalars['Boolean'];
  deleteReview: Scalars['Boolean'];
  deleteRoom: Scalars['Boolean'];
  deleteTimeTable: Scalars['Boolean'];
  deleteUserInteraction: Scalars['Boolean'];
  editAnnounce: AnnounceMutationResponse;
  editAnnounces: Array<Maybe<AnnounceMutationResponse>>;
  editBoard: BoardEntityView;
  editBoards: Array<Maybe<BoardEntityView>>;
  editNotice: NoticeEntityView;
  editNotices: Array<Maybe<NoticeEntityView>>;
  editPopUp: PopUpEntityView;
  editPopUps: Array<Maybe<PopUpEntityView>>;
  editReview: ReviewViewDto;
  editReviews: Array<Maybe<ReviewViewDto>>;
  editSchoolCourse: SchoolCourseEntityView;
  editSchoolCourses: Array<Maybe<SchoolCourseEntityView>>;
  editSeller: SellerResponse;
  editTimeTable: TimeTableEntityView;
  editTotiAnswer: TotiAnswerMutationResponse;
  editTotiAnswers: Array<Maybe<TotiAnswerMutationResponse>>;
  editTotiComment: TotiCommentMutationResponse;
  editTotiComments: Array<Maybe<TotiCommentMutationResponse>>;
  editTotiMentor: TotiMentorMutationResponse;
  editTotiMentors: Array<Maybe<TotiMentorMutationResponse>>;
  editTotiQuestion: TotiQuestionMutationResponse;
  editTotiQuestions: Array<Maybe<TotiQuestionMutationResponse>>;
  editUser: UserEntityView;
  editUserMessage: UserMessageViewDto;
  editUserNotification: UserNotificationViewDto;
  editUsers: Array<Maybe<UserEntityView>>;
  editVote?: Maybe<VoteEntityView>;
  fixBoardTop: Scalars['Boolean'];
  log: Scalars['Boolean'];
  makeUnsearchable: Scalars['Boolean'];
  matchBlindDate: Scalars['Boolean'];
  readAllUserNotification: Scalars['Boolean'];
  registerAllNotification: Scalars['Boolean'];
  registerAnnounce: AnnounceMutationResponse;
  registerBlindDateApplication: Scalars['Boolean'];
  registerBlockInteraction: Scalars['Boolean'];
  registerBoard: BoardEntityView;
  registerBoardNotification: Scalars['Boolean'];
  registerCategoryRef: CategoryRefViewDto;
  registerEntityStatistics: EntityStatisticsViewDto;
  registerFAGroup: FaGroupViewDto;
  registerInfoBoard: Scalars['Boolean'];
  registerInfoBoards: Scalars['Boolean'];
  registerNotice: NoticeEntityView;
  registerNotificationBySchool?: Maybe<NotificationViewDto>;
  registerPopUp: PopUpEntityView;
  registerReview: ReviewViewDto;
  registerSchoolType?: Maybe<SchoolTypeEntityView>;
  registerSchoolVerification: Scalars['Boolean'];
  registerSeller?: Maybe<SellerResponse>;
  registerTimeTable: TimeTableEntityView;
  registerTotiAnswer: TotiAnswerMutationResponse;
  registerTotiComment: TotiCommentMutationResponse;
  registerTotiKeywordWithUser: Scalars['Boolean'];
  registerTotiMentor: TotiMentorMutationResponse;
  registerTotiQuestion: TotiQuestionMutationResponse;
  registerUserInteraction: UserInteractionMutationResponse;
  registerUserMessage: UserMessageViewDto;
  registerUserReport: UserReportEntityView;
  remapSchoolCoursesTimeByType: Scalars['Boolean'];
  removeAnnounce: Scalars['Boolean'];
  removeTotiAnswer: Scalars['Boolean'];
  removeTotiComment: Scalars['Boolean'];
  removeTotiKeywordWithUser: Scalars['Boolean'];
  removeTotiMentor: Scalars['Boolean'];
  removeTotiQuestion: Scalars['Boolean'];
  resetUserPassword: UserEntityView;
  sendNotification?: Maybe<NotificationViewDto>;
  sendPushNotification: Scalars['Boolean'];
  sendResetPasswordEmail: Scalars['Boolean'];
  sendVerificationCode: MailVerificationDto;
  setDefaultProfileImage: Scalars['Boolean'];
  subscribeNotificationTopicBySchool?: Maybe<Scalars['String']>;
  unregisterUser: UserEntityView;
  updateUserStatus: Array<Maybe<UserEntityView>>;
  upsertSearchKeyword: Scalars['Boolean'];
  verifyCode: MailVerificationDto;
};


/** Mutation root */
export type MutationApplySchoolVerificationArgs = {
  applyDto?: InputMaybe<SchoolVerificationApplyDtoInput>;
};


/** Mutation root */
export type MutationClosePopUpArgs = {
  popUpUuid?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationCreateAdminUserArgs = {
  registerDto?: InputMaybe<UserRegisterDtoInput>;
};


/** Mutation root */
export type MutationCreateUserArgs = {
  registerDto?: InputMaybe<UserRegisterDtoInput>;
};


/** Mutation root */
export type MutationCreateUserAppRoleArgs = {
  registerDto?: InputMaybe<UserAppRoleRegisterDtoInput>;
};


/** Mutation root */
export type MutationDeleteBoardArgs = {
  uuid?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationDeleteInfoBoardArgs = {
  boardUuid?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationDeleteNoticeArgs = {
  uuid?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationDeleteReviewArgs = {
  reviewUuid?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationDeleteRoomArgs = {
  uuid?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationDeleteTimeTableArgs = {
  uuid?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationDeleteUserInteractionArgs = {
  userInteractionDeleteDto?: InputMaybe<UserInteractionDeleteDtoInput>;
};


/** Mutation root */
export type MutationEditAnnounceArgs = {
  editDto?: InputMaybe<AnnounceEditDtoInput>;
};


/** Mutation root */
export type MutationEditAnnouncesArgs = {
  editDtos?: InputMaybe<Array<InputMaybe<AnnounceEditDtoInput>>>;
};


/** Mutation root */
export type MutationEditBoardArgs = {
  editDto?: InputMaybe<BoardEditDtoInput>;
};


/** Mutation root */
export type MutationEditBoardsArgs = {
  editDtos?: InputMaybe<Array<InputMaybe<BoardEditDtoInput>>>;
};


/** Mutation root */
export type MutationEditNoticeArgs = {
  editDto?: InputMaybe<NoticeEditDtoInput>;
};


/** Mutation root */
export type MutationEditNoticesArgs = {
  editDtos?: InputMaybe<Array<InputMaybe<NoticeEditDtoInput>>>;
};


/** Mutation root */
export type MutationEditPopUpArgs = {
  editDto?: InputMaybe<PopUpEditDtoInput>;
};


/** Mutation root */
export type MutationEditPopUpsArgs = {
  editDtos?: InputMaybe<Array<InputMaybe<PopUpEditDtoInput>>>;
};


/** Mutation root */
export type MutationEditReviewArgs = {
  editDto?: InputMaybe<ReviewEditDtoInput>;
};


/** Mutation root */
export type MutationEditReviewsArgs = {
  editDtos?: InputMaybe<Array<InputMaybe<ReviewEditDtoInput>>>;
};


/** Mutation root */
export type MutationEditSchoolCourseArgs = {
  editDto?: InputMaybe<SchoolCourseEditDtoInput>;
};


/** Mutation root */
export type MutationEditSchoolCoursesArgs = {
  editDtos?: InputMaybe<Array<InputMaybe<SchoolCourseEditDtoInput>>>;
};


/** Mutation root */
export type MutationEditSellerArgs = {
  editDto?: InputMaybe<SellerEditDtoInput>;
};


/** Mutation root */
export type MutationEditTimeTableArgs = {
  editDto?: InputMaybe<TimeTableEditDtoInput>;
};


/** Mutation root */
export type MutationEditTotiAnswerArgs = {
  editDto?: InputMaybe<TotiAnswerEditDtoInput>;
};


/** Mutation root */
export type MutationEditTotiAnswersArgs = {
  editDtos?: InputMaybe<Array<InputMaybe<TotiAnswerEditDtoInput>>>;
};


/** Mutation root */
export type MutationEditTotiCommentArgs = {
  editDto?: InputMaybe<TotiCommentEditDtoInput>;
};


/** Mutation root */
export type MutationEditTotiCommentsArgs = {
  editDtos?: InputMaybe<Array<InputMaybe<TotiCommentEditDtoInput>>>;
};


/** Mutation root */
export type MutationEditTotiMentorArgs = {
  editDto?: InputMaybe<TotiMentorEditDtoInput>;
};


/** Mutation root */
export type MutationEditTotiMentorsArgs = {
  editDtos?: InputMaybe<Array<InputMaybe<TotiMentorEditDtoInput>>>;
};


/** Mutation root */
export type MutationEditTotiQuestionArgs = {
  editDto?: InputMaybe<TotiQuestionEditDtoInput>;
};


/** Mutation root */
export type MutationEditTotiQuestionsArgs = {
  editDtos?: InputMaybe<Array<InputMaybe<TotiQuestionEditDtoInput>>>;
};


/** Mutation root */
export type MutationEditUserArgs = {
  editDto?: InputMaybe<UserEditDtoInput>;
};


/** Mutation root */
export type MutationEditUserMessageArgs = {
  editDto?: InputMaybe<UserMessageEditDtoInput>;
};


/** Mutation root */
export type MutationEditUserNotificationArgs = {
  editDto?: InputMaybe<UserNotificationEditDtoInput>;
};


/** Mutation root */
export type MutationEditUsersArgs = {
  editDtos?: InputMaybe<Array<InputMaybe<UserEditDtoInput>>>;
};


/** Mutation root */
export type MutationEditVoteArgs = {
  editDto?: InputMaybe<VoteEditDtoInput>;
};


/** Mutation root */
export type MutationFixBoardTopArgs = {
  boardUuid?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationLogArgs = {
  log?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationMakeUnsearchableArgs = {
  uuid?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationMatchBlindDateArgs = {
  registerDtos?: InputMaybe<Array<InputMaybe<BlindDateMatchRegisterDtoInput>>>;
};


/** Mutation root */
export type MutationRegisterAllNotificationArgs = {
  registerDto?: InputMaybe<NotificationAllRegisterDtoInput>;
};


/** Mutation root */
export type MutationRegisterAnnounceArgs = {
  registerDto?: InputMaybe<AnnounceRegisterDtoInput>;
};


/** Mutation root */
export type MutationRegisterBlindDateApplicationArgs = {
  registerDto?: InputMaybe<BlindDateApplicationRegisterDtoInput>;
};


/** Mutation root */
export type MutationRegisterBlockInteractionArgs = {
  registerDto?: InputMaybe<BlockInteractionRegisterDtoInput>;
};


/** Mutation root */
export type MutationRegisterBoardArgs = {
  registerDto?: InputMaybe<BoardRegisterDtoInput>;
};


/** Mutation root */
export type MutationRegisterBoardNotificationArgs = {
  boardUuid?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationRegisterCategoryRefArgs = {
  registerDto?: InputMaybe<CategoryRefRegisterDtoInput>;
};


/** Mutation root */
export type MutationRegisterEntityStatisticsArgs = {
  entityStatisticsRegisterDto?: InputMaybe<EntityStatisticsRegisterDtoInput>;
};


/** Mutation root */
export type MutationRegisterFaGroupArgs = {
  registerDto?: InputMaybe<FaGroupRegisterDtoInput>;
};


/** Mutation root */
export type MutationRegisterInfoBoardArgs = {
  boardUuid?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationRegisterInfoBoardsArgs = {
  boardUuids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


/** Mutation root */
export type MutationRegisterNoticeArgs = {
  registerDto?: InputMaybe<NoticeRegisterDtoInput>;
};


/** Mutation root */
export type MutationRegisterNotificationBySchoolArgs = {
  registerDto?: InputMaybe<NotificationBySchoolRegisterDtoInput>;
};


/** Mutation root */
export type MutationRegisterPopUpArgs = {
  registerDto?: InputMaybe<PopUpRegisterDtoInput>;
};


/** Mutation root */
export type MutationRegisterReviewArgs = {
  registerDto?: InputMaybe<ReviewRegisterDtoInput>;
};


/** Mutation root */
export type MutationRegisterSchoolTypeArgs = {
  registerDto?: InputMaybe<SchoolTypeRegisterDtoInput>;
};


/** Mutation root */
export type MutationRegisterSchoolVerificationArgs = {
  registerDto?: InputMaybe<SchoolVerificationRegisterDtoInput>;
};


/** Mutation root */
export type MutationRegisterSellerArgs = {
  registerDto?: InputMaybe<SellerRegisterDtoInput>;
};


/** Mutation root */
export type MutationRegisterTimeTableArgs = {
  registerDto?: InputMaybe<TimeTableRegisterDtoInput>;
};


/** Mutation root */
export type MutationRegisterTotiAnswerArgs = {
  registerDto?: InputMaybe<TotiAnswerRegisterDtoInput>;
};


/** Mutation root */
export type MutationRegisterTotiCommentArgs = {
  registerDto?: InputMaybe<TotiCommentRegisterDtoInput>;
};


/** Mutation root */
export type MutationRegisterTotiKeywordWithUserArgs = {
  registerDto?: InputMaybe<TotiKeywordUserRegisterDtoInput>;
};


/** Mutation root */
export type MutationRegisterTotiMentorArgs = {
  registerDto?: InputMaybe<TotiMentorRegisterDtoInput>;
};


/** Mutation root */
export type MutationRegisterTotiQuestionArgs = {
  registerDto?: InputMaybe<TotiQuestionRegisterDtoInput>;
};


/** Mutation root */
export type MutationRegisterUserInteractionArgs = {
  userInteractionRegisterDto?: InputMaybe<UserInteractionRegisterDtoInput>;
};


/** Mutation root */
export type MutationRegisterUserMessageArgs = {
  registerDto?: InputMaybe<UserMessageRegisterDtoInput>;
};


/** Mutation root */
export type MutationRegisterUserReportArgs = {
  registerDto?: InputMaybe<UserReportRegisterDtoInput>;
};


/** Mutation root */
export type MutationRemapSchoolCoursesTimeByTypeArgs = {
  categoryRefType?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationRemoveAnnounceArgs = {
  uuid?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationRemoveTotiAnswerArgs = {
  uuid?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationRemoveTotiCommentArgs = {
  uuid?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationRemoveTotiKeywordWithUserArgs = {
  userUuid?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationRemoveTotiMentorArgs = {
  uuid?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationRemoveTotiQuestionArgs = {
  uuid?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationResetUserPasswordArgs = {
  email?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationSendNotificationArgs = {
  registerDto?: InputMaybe<NotificationRegisterDtoInput>;
};


/** Mutation root */
export type MutationSendPushNotificationArgs = {
  requestDto?: InputMaybe<PushNotificationRequestDtoInput>;
};


/** Mutation root */
export type MutationSendResetPasswordEmailArgs = {
  email?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationSendVerificationCodeArgs = {
  email?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationSubscribeNotificationTopicBySchoolArgs = {
  schoolUuid?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationUnregisterUserArgs = {
  reason?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationUpdateUserStatusArgs = {
  userStatus?: InputMaybe<UserStatus>;
  userUuids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


/** Mutation root */
export type MutationUpsertSearchKeywordArgs = {
  upsertDto?: InputMaybe<SearchKeywordUpsertDtoInput>;
};


/** Mutation root */
export type MutationVerifyCodeArgs = {
  code?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
};

export type NoticeEditDtoInput = {
  changeLog?: InputMaybe<Scalars['String']>;
  content?: InputMaybe<Scalars['String']>;
  entityStatus?: InputMaybe<EntityStatus>;
  title?: InputMaybe<Scalars['String']>;
  uuid: Scalars['String'];
};

export type NoticeEntityView = {
  __typename?: 'NoticeEntityView';
  content: Scalars['String'];
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  createdUserId?: Maybe<Scalars['Long']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  isLikedByMe?: Maybe<Scalars['Boolean']>;
  likeCount?: Maybe<Scalars['Long']>;
  title: Scalars['String'];
  uuid: Scalars['String'];
};

export type NoticeFetchDtoInput = {
  dateRange?: InputMaybe<DateRangeInput>;
  entityStatus?: InputMaybe<EntityStatus>;
  fetchType?: InputMaybe<NoticeFetchType>;
  paginationRequestDto: PaginationRequestDto_StringInput;
  searchKeyword?: InputMaybe<Scalars['String']>;
  sortType?: InputMaybe<NoticeSortType>;
};

export enum NoticeFetchType {
  Like = 'LIKE'
}

export type NoticePaginationResultDto = {
  __typename?: 'NoticePaginationResultDto';
  cursor?: Maybe<Scalars['String']>;
  data: Array<Maybe<NoticeEntityView>>;
  page: Scalars['Long'];
  totalCount: Scalars['Long'];
};

export type NoticeRegisterDtoInput = {
  content: Scalars['String'];
  entityStatus?: InputMaybe<EntityStatus>;
  title: Scalars['String'];
};

export enum NoticeSortType {
  Like = 'LIKE',
  Recent = 'RECENT'
}

export type NotificationAllRegisterDtoInput = {
  actionUrl?: InputMaybe<Scalars['String']>;
  content: Scalars['String'];
  entityStatus?: InputMaybe<EntityStatus>;
  iconUrl?: InputMaybe<Scalars['String']>;
  parentEntityType?: InputMaybe<EntityType>;
  parentEntityUuid?: InputMaybe<Scalars['String']>;
  pushOnly?: InputMaybe<Scalars['Boolean']>;
  title: Scalars['String'];
};

export type NotificationBySchoolRegisterDtoInput = {
  actionUrl?: InputMaybe<Scalars['String']>;
  content: Scalars['String'];
  data?: InputMaybe<Scalars['String']>;
  entityStatus?: InputMaybe<EntityStatus>;
  entityType?: InputMaybe<EntityType>;
  iconUrl?: InputMaybe<Scalars['String']>;
  schoolUuid: Scalars['String'];
  senderUuid?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

export type NotificationRegisterDtoInput = {
  actionUrl?: InputMaybe<Scalars['String']>;
  content: Scalars['String'];
  data?: InputMaybe<Scalars['String']>;
  entityStatus?: InputMaybe<EntityStatus>;
  entityType?: InputMaybe<EntityType>;
  iconUrl?: InputMaybe<Scalars['String']>;
  notificationType: NotificationType;
  senderUuid?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
  userNotifications: Array<InputMaybe<UserNotificationRegisterDtoInput>>;
};

export enum NotificationType {
  All = 'ALL',
  ApproveSchoolVerify = 'APPROVE_SCHOOL_VERIFY',
  BoardBookmark = 'BOARD_BOOKMARK',
  BoardLike = 'BOARD_LIKE',
  BoardReview = 'BOARD_REVIEW',
  Follow = 'FOLLOW',
  General = 'GENERAL',
  MentoringReviewed = 'MENTORING_REVIEWED',
  RejectSchoolVerify = 'REJECT_SCHOOL_VERIFY',
  ReviewBoard = 'REVIEW_BOARD',
  ReviewBookmark = 'REVIEW_BOOKMARK',
  ReviewLike = 'REVIEW_LIKE',
  ReviewReview = 'REVIEW_REVIEW',
  SchoolBoardBookmark = 'SCHOOL_BOARD_BOOKMARK',
  SchoolBoardLike = 'SCHOOL_BOARD_LIKE',
  SchoolBoardReview = 'SCHOOL_BOARD_REVIEW',
  SchoolNotice = 'SCHOOL_NOTICE',
  SchoolReviewBoard = 'SCHOOL_REVIEW_BOARD',
  SchoolReviewBookmark = 'SCHOOL_REVIEW_BOOKMARK',
  SchoolReviewLike = 'SCHOOL_REVIEW_LIKE',
  SchoolReviewReview = 'SCHOOL_REVIEW_REVIEW',
  TotiQuestionAnswer = 'TOTI_QUESTION_ANSWER',
  UserChat = 'USER_CHAT',
  UserMessage = 'USER_MESSAGE'
}

export type NotificationViewDto = {
  __typename?: 'NotificationViewDto';
  actionUrl?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  data?: Maybe<Scalars['String']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  entityType?: Maybe<EntityType>;
  iconUrl?: Maybe<Scalars['String']>;
  lastModifiedBy?: Maybe<Scalars['String']>;
  lastModifiedDate?: Maybe<Scalars['LocalDateTime']>;
  notificationType?: Maybe<NotificationType>;
  sender?: Maybe<UserViewDto>;
  title?: Maybe<Scalars['String']>;
  uuid: Scalars['String'];
};

export type NotificationViewDtoInput = {
  actionUrl?: InputMaybe<Scalars['String']>;
  content?: InputMaybe<Scalars['String']>;
  createdBy?: InputMaybe<Scalars['String']>;
  createdDate?: InputMaybe<Scalars['LocalDateTime']>;
  data?: InputMaybe<Scalars['String']>;
  entityStatus?: InputMaybe<EntityStatus>;
  entityType?: InputMaybe<EntityType>;
  iconUrl?: InputMaybe<Scalars['String']>;
  lastModifiedBy?: InputMaybe<Scalars['String']>;
  lastModifiedDate?: InputMaybe<Scalars['LocalDateTime']>;
  notificationType?: InputMaybe<NotificationType>;
  sender?: InputMaybe<UserViewDtoInput>;
  title?: InputMaybe<Scalars['String']>;
  uuid?: InputMaybe<Scalars['String']>;
};

export type Page_UserEntityView = {
  __typename?: 'Page_UserEntityView';
  content?: Maybe<Array<Maybe<UserEntityView>>>;
  first: Scalars['Boolean'];
  last: Scalars['Boolean'];
  number: Scalars['Int'];
  numberOfElements: Scalars['Int'];
  pageable?: Maybe<Pageable>;
  size: Scalars['Int'];
  sort?: Maybe<Sort>;
  totalElements: Scalars['Long'];
  totalPages: Scalars['Int'];
};

export type Pageable = {
  __typename?: 'Pageable';
  offset: Scalars['Long'];
  pageNumber: Scalars['Int'];
  pageSize: Scalars['Int'];
  paged: Scalars['Boolean'];
  sort?: Maybe<Sort>;
  unpaged: Scalars['Boolean'];
};

export type PaginationRequestDto_ReviewViewDtoInput = {
  count: Scalars['Int'];
  cursor?: InputMaybe<ReviewViewDtoInput>;
  page?: InputMaybe<Scalars['Int']>;
};

export type PaginationRequestDto_StringInput = {
  count: Scalars['Int'];
  cursor?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
};

export type PaginationRequestDto_UserNotificationViewDtoInput = {
  count: Scalars['Int'];
  cursor?: InputMaybe<UserNotificationViewDtoInput>;
  page?: InputMaybe<Scalars['Int']>;
};

export type PaperHelperFetchDtoInput = {
  paginationRequestDto?: InputMaybe<PaginationRequestDto_StringInput>;
};

export type PaperHelperViewDto = {
  __typename?: 'PaperHelperViewDto';
  category?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  description?: Maybe<Scalars['String']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  lastModifiedBy?: Maybe<Scalars['String']>;
  lastModifiedDate?: Maybe<Scalars['LocalDateTime']>;
  link_url?: Maybe<Scalars['String']>;
  logo_url?: Maybe<Scalars['String']>;
  thumbnail_url?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  uuid: Scalars['String'];
};

export type PopUpEditDtoInput = {
  changeLog?: InputMaybe<Scalars['String']>;
  dateRange?: InputMaybe<DateTimeRangeInput>;
  entityStatus?: InputMaybe<EntityStatus>;
  imageUrl?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
  uuid: Scalars['String'];
};

export type PopUpEntityView = {
  __typename?: 'PopUpEntityView';
  buttonText: Scalars['String'];
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  createdUserId?: Maybe<Scalars['Long']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  endDate: Scalars['LocalDateTime'];
  entityStatus?: Maybe<EntityStatus>;
  imageUrl: Scalars['String'];
  startDate: Scalars['LocalDateTime'];
  title: Scalars['String'];
  url: Scalars['String'];
  uuid: Scalars['String'];
};

export type PopUpFetchDtoInput = {
  count?: InputMaybe<Scalars['Long']>;
  dateRange?: InputMaybe<DateTimeRangeInput>;
  entityStatus?: InputMaybe<EntityStatus>;
  page?: InputMaybe<Scalars['Long']>;
};

export type PopUpPaginationResultDto = {
  __typename?: 'PopUpPaginationResultDto';
  cursor?: Maybe<Scalars['String']>;
  data: Array<Maybe<PopUpEntityView>>;
  page: Scalars['Long'];
  totalCount: Scalars['Long'];
};

export type PopUpRegisterDtoInput = {
  dateRange: DateTimeRangeInput;
  entityStatus?: InputMaybe<EntityStatus>;
  imageUrl?: InputMaybe<Scalars['String']>;
  majorCategories?: InputMaybe<Array<InputMaybe<MajorCategory>>>;
  title: Scalars['String'];
  url?: InputMaybe<Scalars['String']>;
};

export type PushNotificationRequestDtoInput = {
  actionUrl?: InputMaybe<Scalars['String']>;
  body?: InputMaybe<Scalars['String']>;
  data?: InputMaybe<Scalars['Map_String_StringScalar']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  parentEntityType?: InputMaybe<EntityType>;
  parentEntityUuid?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  tokens?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  topic?: InputMaybe<Scalars['String']>;
  topicCondition?: InputMaybe<Scalars['String']>;
};

/** Query root */
export type Query = {
  __typename?: 'Query';
  FAGroupByCode: FaGroupViewDto;
  FAGroupByTypeAndName: FaGroupViewDto;
  FAGroupByUuid: FaGroupViewDto;
  FAGroups: Array<Maybe<FaGroupViewDto>>;
  FAGroupsByCursor: FaGroupPaginationResultDto;
  FAGroupsByType: Array<Maybe<FaGroupViewDto>>;
  activatedUsersByDateRange: UserStatisticsViewDto;
  announce?: Maybe<AnnounceResponse>;
  announceKeywords: Array<Maybe<AnnounceKeywordResponse>>;
  announcesByCursor?: Maybe<AnnouncePaginationResponse>;
  announcesByPaging?: Maybe<AnnouncePaginationResponse>;
  banners: Array<Maybe<BannerViewDto>>;
  blindDateApplications?: Maybe<Array<Maybe<BlindDateApplicationResponse>>>;
  blindDateApplicationsBy?: Maybe<Array<Maybe<BlindDateApplicationResponse>>>;
  blindDateNaechinsoDateGuideMessage?: Maybe<Scalars['String']>;
  blindDateNaechinsoFormLink?: Maybe<Scalars['String']>;
  blindDateNaechinsoTitle?: Maybe<Scalars['String']>;
  board: BoardEntityView;
  boardByReview: BoardEntityView;
  boardsByCursor: BoardPaginationResultDto;
  boardsByPaging: BoardPaginationResultDto;
  categories: Array<CategoryRefViewDto>;
  checkEmailExists: Scalars['Boolean'];
  checkPassword: Scalars['Boolean'];
  config: ConfigDto;
  entityStatistics: EntityStatisticsViewMapDto;
  existsEmail: Scalars['Boolean'];
  existsNickName: Scalars['Boolean'];
  favoriteTimeTable?: Maybe<TimeTableEntityView>;
  findAdminUserByEmail: UserEntityView;
  findUserByEmail: Scalars['Boolean'];
  hashId?: Maybe<Scalars['String']>;
  id: Scalars['Long'];
  infoBoardsByCursor: BoardPaginationResultDto;
  labKeywords?: Maybe<Array<Maybe<LabKeywordResponse>>>;
  me: UserEntityView;
  myTotiMentor?: Maybe<TotiMentorKeywordResponse>;
  notice: NoticeEntityView;
  noticesByCursor: NoticePaginationResultDto;
  noticesByPaging: NoticePaginationResultDto;
  paperHelpers?: Maybe<Array<Maybe<PaperHelperViewDto>>>;
  popUpsBy: PopUpPaginationResultDto;
  recentSearchKeywords?: Maybe<Array<Maybe<SearchKeywordViewDto>>>;
  review: ReviewViewDto;
  reviewsByCursor: ReviewPaginationResultDto;
  reviewsByPaging: ReviewPaginationResultDto;
  room: RoomEntityView;
  roomsByCursor: RoomPaginationResultDto;
  schoolCourse: SchoolCourseEntityView;
  schoolCoursesByCategory: Array<Maybe<SchoolCourseEntityView>>;
  schoolCoursesByCursor: SchoolCoursePaginationResultDto;
  schoolCoursesByPaging: SchoolCoursePaginationResultDto;
  schoolList?: Maybe<Array<Maybe<SchoolTypeEntityView>>>;
  schoolVerification?: Maybe<SchoolVerificationResponse>;
  schoolVerifications?: Maybe<SchoolVerificationPaginationResponse>;
  sellers?: Maybe<SellerPaginationResponse>;
  targetPopUp: PopUpEntityView;
  tests: TestResultDto;
  timeTable: TimeTableEntityView;
  timeTableTemplates: Array<Maybe<TimeTableTemplate>>;
  timeTables: Array<Maybe<TimeTableEntityView>>;
  topFixedBoard: BoardEntityView;
  totiAnswer?: Maybe<TotiAnswerResponse>;
  totiAnswersByCursor?: Maybe<TotiAnswerPaginationResponse>;
  totiAnswersByPaging?: Maybe<TotiAnswerPaginationResponse>;
  totiComment?: Maybe<TotiCommentResponse>;
  totiCommentsByCursor?: Maybe<TotiCommentPaginationResponse>;
  totiCommentsByPaging?: Maybe<TotiCommentPaginationResponse>;
  totiKeywords?: Maybe<Array<Maybe<TotiKeywordResponse>>>;
  totiKeywordsUser?: Maybe<Array<Maybe<TotiKeywordResponse>>>;
  totiMentor?: Maybe<TotiMentorKeywordResponse>;
  totiMentorsByCursor?: Maybe<TotiMentorPaginationResponse>;
  totiMentorsByPaging?: Maybe<TotiMentorPaginationResponse>;
  totiMentorsKeywordByCursor?: Maybe<TotiMentorKeywordPaginationResponse>;
  totiQuestion?: Maybe<TotiQuestionDetailResponse>;
  totiQuestionAnswerByCursor?: Maybe<TotiQuestionAnswerPaginationResponse>;
  totiQuestionsByCursor?: Maybe<TotiQuestionPaginationResponse>;
  totiQuestionsByPaging?: Maybe<TotiQuestionPaginationResponse>;
  unreadMessageCount: Scalars['Long'];
  user: UserEntityView;
  userAppRole?: Maybe<UserAppRoleViewDto>;
  userAppRoles?: Maybe<Array<Maybe<AppRole>>>;
  userInteraction: UserInteractionResponse;
  userInteractionsByCursor: UserInteractionPaginationResponse;
  userInteractionsByPaging?: Maybe<UserInteractionPaginationResponse>;
  userMessagesByCursor: UserMessagePaginationResultDto;
  userMessagesByPaging: UserMessagePaginationResultDto;
  userNotificationCount: Scalars['Long'];
  userNotificationsByCursor: UserNotificationPaginationResultDto;
  userNotificationsByPaging: UserNotificationPaginationResultDto;
  userReport: UserReportEntityView;
  usersByCursor: UserPaginationResultDto;
  usersByFilter: Array<Maybe<UserEntityView>>;
  usersByFilterWithPagination: Page_UserEntityView;
  usersByPaging: UserPaginationResultDto;
  vote?: Maybe<VoteEntityView>;
};


/** Query root */
export type QueryFaGroupByCodeArgs = {
  code?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryFaGroupByTypeAndNameArgs = {
  groupType?: InputMaybe<FaGroupType>;
  name?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryFaGroupByUuidArgs = {
  uuid?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryFaGroupsByCursorArgs = {
  fetchDto?: InputMaybe<FaGroupFetchDtoInput>;
};


/** Query root */
export type QueryFaGroupsByTypeArgs = {
  groupType?: InputMaybe<FaGroupType>;
};


/** Query root */
export type QueryActivatedUsersByDateRangeArgs = {
  dateRange?: InputMaybe<DateRangeInput>;
};


/** Query root */
export type QueryAnnounceArgs = {
  announceUuid?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryAnnounceKeywordsArgs = {
  type?: InputMaybe<AnnounceKeywordType>;
};


/** Query root */
export type QueryAnnouncesByCursorArgs = {
  fetchDto?: InputMaybe<AnnounceFetchDtoInput>;
};


/** Query root */
export type QueryAnnouncesByPagingArgs = {
  fetchDto?: InputMaybe<AnnounceFetchDtoInput>;
};


/** Query root */
export type QueryBlindDateApplicationsByArgs = {
  fetchDto?: InputMaybe<BlindDateApplicationFetchDtoInput>;
};


/** Query root */
export type QueryBoardArgs = {
  uuid?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryBoardByReviewArgs = {
  reviewUuid?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryBoardsByCursorArgs = {
  fetchDto?: InputMaybe<BoardFetchDtoInput>;
};


/** Query root */
export type QueryBoardsByPagingArgs = {
  fetchDto?: InputMaybe<BoardFetchDtoInput>;
};


/** Query root */
export type QueryCategoriesArgs = {
  parentUuid?: InputMaybe<Scalars['String']>;
  schoolTypeUuid?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryCheckEmailExistsArgs = {
  email?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryCheckPasswordArgs = {
  password?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryEntityStatisticsArgs = {
  fetchDto?: InputMaybe<EntityStatisticsFetchDtoInput>;
};


/** Query root */
export type QueryExistsEmailArgs = {
  email?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryExistsNickNameArgs = {
  nickname?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryFavoriteTimeTableArgs = {
  fetchDto?: InputMaybe<TimeTableFetchDtoInput>;
};


/** Query root */
export type QueryFindAdminUserByEmailArgs = {
  email?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryFindUserByEmailArgs = {
  email?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryHashIdArgs = {
  id: Scalars['Long'];
};


/** Query root */
export type QueryIdArgs = {
  uuid?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryInfoBoardsByCursorArgs = {
  fetchDto?: InputMaybe<BoardFetchDtoInput>;
};


/** Query root */
export type QueryNoticeArgs = {
  uuid?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryNoticesByCursorArgs = {
  fetchDto?: InputMaybe<NoticeFetchDtoInput>;
};


/** Query root */
export type QueryNoticesByPagingArgs = {
  fetchDto?: InputMaybe<NoticeFetchDtoInput>;
};


/** Query root */
export type QueryPaperHelpersArgs = {
  fetchDto?: InputMaybe<PaperHelperFetchDtoInput>;
};


/** Query root */
export type QueryPopUpsByArgs = {
  fetchDto?: InputMaybe<PopUpFetchDtoInput>;
};


/** Query root */
export type QueryRecentSearchKeywordsArgs = {
  fetchDto?: InputMaybe<SearchKeywordFetchDtoInput>;
};


/** Query root */
export type QueryReviewArgs = {
  reviewUuid?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryReviewsByCursorArgs = {
  fetchDto?: InputMaybe<ReviewFetchDtoInput>;
};


/** Query root */
export type QueryReviewsByPagingArgs = {
  reviewFetchDto?: InputMaybe<ReviewFetchDtoInput>;
};


/** Query root */
export type QueryRoomArgs = {
  uuid?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryRoomsByCursorArgs = {
  fetchDto?: InputMaybe<RoomFetchDtoInput>;
};


/** Query root */
export type QuerySchoolCourseArgs = {
  schoolCourseUuid?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QuerySchoolCoursesByCategoryArgs = {
  categoryUuid?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QuerySchoolCoursesByCursorArgs = {
  fetchDto?: InputMaybe<SchoolCourseFetchDtoInput>;
};


/** Query root */
export type QuerySchoolCoursesByPagingArgs = {
  schoolCourseFetchDto?: InputMaybe<SchoolCourseFetchDtoInput>;
};


/** Query root */
export type QuerySchoolListArgs = {
  fetchDto?: InputMaybe<SchoolTypeFetchDtoInput>;
};


/** Query root */
export type QuerySchoolVerificationsArgs = {
  fetchDto?: InputMaybe<SchoolVerificationFetchDtoInput>;
};


/** Query root */
export type QuerySellersArgs = {
  paginationRequestDto?: InputMaybe<SellerPaginationFetchDtoInput>;
};


/** Query root */
export type QueryTestsArgs = {
  fetchDto?: InputMaybe<TestFetchDtoInput>;
  page: Scalars['Int'];
};


/** Query root */
export type QueryTimeTableArgs = {
  uuid?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryTimeTablesArgs = {
  fetchDto?: InputMaybe<TimeTableFetchDtoInput>;
};


/** Query root */
export type QueryTotiAnswerArgs = {
  answerUuid?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryTotiAnswersByCursorArgs = {
  fetchDto?: InputMaybe<TotiAnswerFetchDtoInput>;
};


/** Query root */
export type QueryTotiAnswersByPagingArgs = {
  fetchDto?: InputMaybe<TotiAnswerFetchDtoInput>;
};


/** Query root */
export type QueryTotiCommentArgs = {
  commentUuid?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryTotiCommentsByCursorArgs = {
  fetchDto?: InputMaybe<TotiCommentFetchDtoInput>;
};


/** Query root */
export type QueryTotiCommentsByPagingArgs = {
  fetchDto?: InputMaybe<TotiCommentFetchDtoInput>;
};


/** Query root */
export type QueryTotiKeywordsUserArgs = {
  userUuid?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryTotiMentorArgs = {
  mentorUuid?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryTotiMentorsByCursorArgs = {
  fetchDto?: InputMaybe<TotiMentorFetchDtoInput>;
};


/** Query root */
export type QueryTotiMentorsByPagingArgs = {
  fetchDto?: InputMaybe<TotiMentorFetchDtoInput>;
};


/** Query root */
export type QueryTotiMentorsKeywordByCursorArgs = {
  fetchDto?: InputMaybe<TotiMentorFetchDtoInput>;
};


/** Query root */
export type QueryTotiQuestionArgs = {
  uuid?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryTotiQuestionAnswerByCursorArgs = {
  fetchDto?: InputMaybe<TotiQuestionAnswerFetchDtoInput>;
};


/** Query root */
export type QueryTotiQuestionsByCursorArgs = {
  fetchDto?: InputMaybe<TotiQuestionFetchDtoInput>;
};


/** Query root */
export type QueryTotiQuestionsByPagingArgs = {
  fetchDto?: InputMaybe<TotiQuestionFetchDtoInput>;
};


/** Query root */
export type QueryUserArgs = {
  uuid?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryUserAppRoleArgs = {
  uuid?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryUserInteractionArgs = {
  userInteractionUuid?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryUserInteractionsByCursorArgs = {
  fetchDto?: InputMaybe<UserInteractionFetchDtoInput>;
};


/** Query root */
export type QueryUserInteractionsByPagingArgs = {
  fetchDto?: InputMaybe<UserInteractionFetchDtoInput>;
};


/** Query root */
export type QueryUserMessagesByCursorArgs = {
  fetchDto?: InputMaybe<UserMessageFetchDtoInput>;
};


/** Query root */
export type QueryUserMessagesByPagingArgs = {
  fetchDto?: InputMaybe<UserMessageFetchDtoInput>;
};


/** Query root */
export type QueryUserNotificationsByCursorArgs = {
  fetchDto?: InputMaybe<UserNotificationFetchDtoInput>;
};


/** Query root */
export type QueryUserNotificationsByPagingArgs = {
  fetchDto?: InputMaybe<UserNotificationFetchDtoInput>;
};


/** Query root */
export type QueryUserReportArgs = {
  uuid?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryUsersByCursorArgs = {
  userFetchDto?: InputMaybe<UserFetchDtoInput>;
};


/** Query root */
export type QueryUsersByFilterArgs = {
  paymentStatuses?: InputMaybe<Array<InputMaybe<UserPaymentStatus>>>;
  searchFilterDto?: InputMaybe<UserSearchFilterDtoInput>;
  userStatuses?: InputMaybe<Array<InputMaybe<UserStatus>>>;
};


/** Query root */
export type QueryUsersByFilterWithPaginationArgs = {
  page: Scalars['Int'];
  paymentStatuses?: InputMaybe<Array<InputMaybe<UserPaymentStatus>>>;
  searchFilterDto?: InputMaybe<UserSearchFilterDtoInput>;
  size: Scalars['Int'];
  userStatuses?: InputMaybe<Array<InputMaybe<UserStatus>>>;
};


/** Query root */
export type QueryUsersByPagingArgs = {
  userFetchDto?: InputMaybe<UserFetchDtoInput>;
};


/** Query root */
export type QueryVoteArgs = {
  uuid?: InputMaybe<Scalars['String']>;
};

export type ReviewEditDtoInput = {
  changeLog?: InputMaybe<Scalars['String']>;
  content?: InputMaybe<Scalars['String']>;
  entityStatus?: InputMaybe<EntityStatus>;
  files?: InputMaybe<Array<InputMaybe<FaEntityFileRegisterDtoInput>>>;
  isAnonymous?: InputMaybe<Scalars['Boolean']>;
  parentEntityUuid?: InputMaybe<Scalars['String']>;
  rating?: InputMaybe<Scalars['BigDecimal']>;
  uuid: Scalars['String'];
};

export type ReviewFetchDtoInput = {
  entityStatus?: InputMaybe<EntityStatus>;
  groupUuid?: InputMaybe<Scalars['String']>;
  paginationRequestDto: PaginationRequestDto_ReviewViewDtoInput;
  parentEntityType?: InputMaybe<EntityType>;
  parentEntityUuid?: InputMaybe<Scalars['String']>;
  reviewType?: InputMaybe<ReviewType>;
  sortType?: InputMaybe<ReviewSortType>;
  userInteractionType?: InputMaybe<UserInteractionType>;
  userUuid?: InputMaybe<Scalars['String']>;
};

export type ReviewPaginationResultDto = {
  __typename?: 'ReviewPaginationResultDto';
  cursor?: Maybe<Scalars['String']>;
  data: Array<Maybe<ReviewViewDto>>;
  page: Scalars['Long'];
  totalCount: Scalars['Long'];
};

export type ReviewRegisterDtoInput = {
  content?: InputMaybe<Scalars['String']>;
  entityStatus?: InputMaybe<EntityStatus>;
  files?: InputMaybe<Array<InputMaybe<FaEntityFileRegisterDtoInput>>>;
  groupRegisterRequest?: InputMaybe<Scalars['String']>;
  isAnonymous?: InputMaybe<Scalars['Boolean']>;
  parentEntityType: EntityType;
  parentEntityUuid: Scalars['String'];
  parentReviewUuid?: InputMaybe<Scalars['String']>;
  rating?: InputMaybe<Scalars['BigDecimal']>;
  uploadScope?: InputMaybe<FaUploadScope>;
};

export enum ReviewSortType {
  Old = 'OLD',
  Popular = 'POPULAR',
  Recent = 'RECENT'
}

export enum ReviewType {
  Board = 'BOARD',
  Mentor = 'MENTOR',
  Mentoring = 'MENTORING',
  SchoolCourse = 'SCHOOL_COURSE'
}

export type ReviewViewDto = {
  __typename?: 'ReviewViewDto';
  bookmarkCount?: Maybe<Scalars['Long']>;
  childReviewCount?: Maybe<Scalars['Long']>;
  childReviews?: Maybe<Array<Maybe<ReviewViewDto>>>;
  content?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  files?: Maybe<Array<Maybe<FaEntityFileViewDto>>>;
  groups?: Maybe<Array<Maybe<FaEntityGroupViewDto>>>;
  isAnonymous?: Maybe<Scalars['Boolean']>;
  isBlock?: Maybe<Scalars['Boolean']>;
  isBookmarkedByMe?: Maybe<Scalars['Boolean']>;
  isLikedByMe?: Maybe<Scalars['Boolean']>;
  lastModifiedBy?: Maybe<Scalars['String']>;
  lastModifiedDate?: Maybe<Scalars['LocalDateTime']>;
  likeCount?: Maybe<Scalars['Long']>;
  parentEntityType?: Maybe<EntityType>;
  parentEntityUuid?: Maybe<Scalars['String']>;
  parentReviewUuid?: Maybe<Scalars['String']>;
  rating?: Maybe<Scalars['BigDecimal']>;
  reviewType?: Maybe<ReviewType>;
  user?: Maybe<UserViewDto>;
  userIdForFieldSecurityValidation?: Maybe<Scalars['Long']>;
  userReports?: Maybe<Array<Maybe<UserReportViewDto>>>;
  uuid: Scalars['String'];
};

export type ReviewViewDtoInput = {
  bookmarkCount?: InputMaybe<Scalars['Long']>;
  childReviews?: InputMaybe<Array<InputMaybe<ReviewViewDtoInput>>>;
  content?: InputMaybe<Scalars['String']>;
  createdBy?: InputMaybe<Scalars['String']>;
  createdDate?: InputMaybe<Scalars['LocalDateTime']>;
  entityStatus?: InputMaybe<EntityStatus>;
  files?: InputMaybe<Array<InputMaybe<FaEntityFileViewDtoInput>>>;
  groups?: InputMaybe<Array<InputMaybe<FaEntityGroupViewDtoInput>>>;
  isAnonymous?: InputMaybe<Scalars['Boolean']>;
  isBlock?: InputMaybe<Scalars['Boolean']>;
  isBookmarkedByMe?: InputMaybe<Scalars['Boolean']>;
  isLikedByMe?: InputMaybe<Scalars['Boolean']>;
  lastModifiedBy?: InputMaybe<Scalars['String']>;
  lastModifiedDate?: InputMaybe<Scalars['LocalDateTime']>;
  likeCount?: InputMaybe<Scalars['Long']>;
  parentEntityType?: InputMaybe<EntityType>;
  parentEntityUuid?: InputMaybe<Scalars['String']>;
  parentReviewUuid?: InputMaybe<Scalars['String']>;
  rating?: InputMaybe<Scalars['BigDecimal']>;
  reviewType?: InputMaybe<ReviewType>;
  user?: InputMaybe<UserViewDtoInput>;
  userReports?: InputMaybe<Array<InputMaybe<UserReportViewDtoInput>>>;
  uuid?: InputMaybe<Scalars['String']>;
};

export type RoomEntityView = {
  __typename?: 'RoomEntityView';
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  isAnonymous?: Maybe<Scalars['Boolean']>;
  lastMessage?: Maybe<UserMessageEntityView>;
  parentEntityType?: Maybe<EntityType>;
  parentUuid?: Maybe<Scalars['String']>;
  partner?: Maybe<UserEntityView>;
  uuid: Scalars['String'];
};

export type RoomFetchDtoInput = {
  entityStatus?: InputMaybe<EntityStatus>;
  paginationRequestDto: PaginationRequestDto_StringInput;
  userUuid?: InputMaybe<Scalars['String']>;
};

export type RoomPaginationResultDto = {
  __typename?: 'RoomPaginationResultDto';
  cursor?: Maybe<Scalars['String']>;
  data: Array<Maybe<RoomEntityView>>;
  page: Scalars['Long'];
  totalCount: Scalars['Long'];
};

export type SchoolCourseEditDtoInput = {
  academyYear?: InputMaybe<Scalars['Int']>;
  changeLog?: InputMaybe<Scalars['String']>;
  code?: InputMaybe<Scalars['String']>;
  divisionCode?: InputMaybe<Scalars['String']>;
  engSubjectName?: InputMaybe<Scalars['String']>;
  entityStatus?: InputMaybe<EntityStatus>;
  extras?: InputMaybe<Scalars['String']>;
  grade?: InputMaybe<Scalars['BigDecimal']>;
  isClosed?: InputMaybe<Scalars['Boolean']>;
  kindsCode?: InputMaybe<Scalars['String']>;
  kindsName?: InputMaybe<Scalars['String']>;
  practiceDivisionCode?: InputMaybe<Scalars['String']>;
  professors?: InputMaybe<Scalars['String']>;
  roomName?: InputMaybe<Scalars['String']>;
  semester?: InputMaybe<Scalars['String']>;
  studentYear?: InputMaybe<Scalars['Int']>;
  subjectName?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['String']>;
  uuid: Scalars['String'];
};

export type SchoolCourseEntityView = {
  __typename?: 'SchoolCourseEntityView';
  academyYear?: Maybe<Scalars['Int']>;
  categoryRefSchoolCourses?: Maybe<Array<Maybe<CategoryRefEntityView>>>;
  code?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  dayAndTimeRanges?: Maybe<Array<Maybe<DayAndTimeRange>>>;
  divisionCode?: Maybe<Scalars['String']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  engSubjectName?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  extras?: Maybe<Scalars['String']>;
  grade?: Maybe<Scalars['BigDecimal']>;
  isClosed?: Maybe<Scalars['Boolean']>;
  kindsCode?: Maybe<Scalars['String']>;
  kindsName?: Maybe<Scalars['String']>;
  numBooking?: Maybe<Scalars['Int']>;
  planUrl?: Maybe<Scalars['String']>;
  practiceDivisionCode?: Maybe<Scalars['String']>;
  professors?: Maybe<Scalars['String']>;
  roomName?: Maybe<Scalars['String']>;
  semester?: Maybe<Scalars['String']>;
  studentYear?: Maybe<Scalars['Int']>;
  subDescription?: Maybe<Scalars['String']>;
  subjectName?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['String']>;
  userReports?: Maybe<Array<Maybe<UserReportEntityView>>>;
  uuid: Scalars['String'];
};

export type SchoolCourseFetchDtoInput = {
  categoryRefUuid?: InputMaybe<Scalars['String']>;
  entityStatus?: InputMaybe<EntityStatus>;
  paginationRequestDto?: InputMaybe<PaginationRequestDto_StringInput>;
  searchKeyword?: InputMaybe<SearchKeywordSearchDtoInput>;
  semesterType?: InputMaybe<SemesterType>;
  sortType?: InputMaybe<SchoolCourseSortType>;
  year?: InputMaybe<Scalars['Int']>;
};

export type SchoolCoursePaginationResultDto = {
  __typename?: 'SchoolCoursePaginationResultDto';
  cursor?: Maybe<Scalars['String']>;
  data: Array<Maybe<SchoolCourseEntityView>>;
  page: Scalars['Long'];
  totalCount: Scalars['Long'];
};

export enum SchoolCourseSortType {
  BookingAsc = 'BOOKING_ASC',
  BookingDesc = 'BOOKING_DESC',
  RatingAsc = 'RATING_ASC',
  RatingDesc = 'RATING_DESC',
  SubjectName = 'SUBJECT_NAME'
}

export type SchoolTypeEntityView = {
  __typename?: 'SchoolTypeEntityView';
  code: Scalars['String'];
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  name: Scalars['String'];
  region: Scalars['String'];
  uuid: Scalars['String'];
};

export type SchoolTypeFetchDtoInput = {
  region?: InputMaybe<Scalars['String']>;
  sortType?: InputMaybe<SchoolTypeSortType>;
};

export type SchoolTypeRegisterDtoInput = {
  code: Scalars['String'];
  entityStatus?: InputMaybe<EntityStatus>;
  name: Scalars['String'];
  region: Scalars['String'];
};

export enum SchoolTypeSortType {
  Code = 'CODE',
  Name = 'NAME'
}

export type SchoolTypeViewDto = {
  __typename?: 'SchoolTypeViewDto';
  code?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  lastModifiedBy?: Maybe<Scalars['String']>;
  lastModifiedDate?: Maybe<Scalars['LocalDateTime']>;
  name?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
  uuid: Scalars['String'];
};

export type SchoolTypeViewDtoInput = {
  code?: InputMaybe<Scalars['String']>;
  createdBy?: InputMaybe<Scalars['String']>;
  createdDate?: InputMaybe<Scalars['LocalDateTime']>;
  entityStatus?: InputMaybe<EntityStatus>;
  lastModifiedBy?: InputMaybe<Scalars['String']>;
  lastModifiedDate?: InputMaybe<Scalars['LocalDateTime']>;
  name?: InputMaybe<Scalars['String']>;
  region?: InputMaybe<Scalars['String']>;
  uuid?: InputMaybe<Scalars['String']>;
};

export type SchoolVerificationApplyDtoInput = {
  entityStatus?: InputMaybe<EntityStatus>;
  major: Scalars['String'];
  schoolUuid: Scalars['String'];
  studentType: StudentType;
  uuid: Scalars['String'];
  verificationStatus: SchoolVerificationStatus;
};

export type SchoolVerificationFetchDtoInput = {
  entityStatus?: InputMaybe<EntityStatus>;
  paginationRequestDto: PaginationRequestDto_StringInput;
  verificationStatus?: InputMaybe<SchoolVerificationStatus>;
};

export type SchoolVerificationPaginationResponse = {
  __typename?: 'SchoolVerificationPaginationResponse';
  cursor?: Maybe<Scalars['String']>;
  data: Array<Maybe<SchoolVerificationResponse>>;
  page: Scalars['Long'];
  totalCount: Scalars['Long'];
};

export type SchoolVerificationRegisterDtoInput = {
  entityStatus?: InputMaybe<EntityStatus>;
  imageUrl: Scalars['String'];
  major: Scalars['String'];
  schoolName: Scalars['String'];
  studentType: StudentType;
};

export type SchoolVerificationResponse = {
  __typename?: 'SchoolVerificationResponse';
  appliedCategoryRefType: Scalars['String'];
  appliedMajor: Scalars['String'];
  appliedSchoolName: Scalars['String'];
  appliedSchoolType: Scalars['String'];
  appliedStudentType: StudentType;
  imageUrl: Scalars['String'];
  major: Scalars['String'];
  prevCategoryRefType: Scalars['String'];
  prevMajor: Scalars['String'];
  prevSchoolName: Scalars['String'];
  prevSchoolType: Scalars['String'];
  prevStudentType: StudentType;
  schoolName: Scalars['String'];
  schoolVerificationStatus: SchoolVerificationStatus;
  studentType: StudentType;
  userUuid: Scalars['String'];
  uuid: Scalars['String'];
};

export enum SchoolVerificationStatus {
  Approved = 'APPROVED',
  InReview = 'IN_REVIEW',
  None = 'NONE',
  Rejected = 'REJECTED'
}

export type SearchKeywordFetchDtoInput = {
  searchKeywordType?: InputMaybe<SearchKeywordType>;
  userUuid?: InputMaybe<Scalars['String']>;
};

export type SearchKeywordSearchDtoInput = {
  keyword?: InputMaybe<Scalars['String']>;
  searchKeywordType?: InputMaybe<SearchKeywordType>;
};

export enum SearchKeywordType {
  CoursePlace = 'COURSE_PLACE',
  ProfessorName = 'PROFESSOR_NAME',
  SubjectCode = 'SUBJECT_CODE',
  SubjectName = 'SUBJECT_NAME'
}

export type SearchKeywordUpsertDtoInput = {
  description?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  keyword?: InputMaybe<Scalars['String']>;
  searchKeywordType?: InputMaybe<SearchKeywordType>;
};

export type SearchKeywordViewDto = {
  __typename?: 'SearchKeywordViewDto';
  createdBy?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  description?: Maybe<Scalars['String']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  imageUrl?: Maybe<Scalars['String']>;
  keyword?: Maybe<Scalars['String']>;
  lastModifiedBy?: Maybe<Scalars['String']>;
  lastModifiedDate?: Maybe<Scalars['LocalDateTime']>;
  reviewCount?: Maybe<Scalars['Long']>;
  searchKeywordType?: Maybe<SearchKeywordType>;
  uuid: Scalars['String'];
};

export type SellerEditDtoInput = {
  description?: InputMaybe<Scalars['String']>;
  entityStatus?: InputMaybe<EntityStatus>;
  name?: InputMaybe<Scalars['String']>;
  sellerUuid: Scalars['String'];
};

export type SellerPaginationFetchDtoInput = {
  entityStatus?: InputMaybe<EntityStatus>;
  paginationRequestDto: PaginationRequestDto_StringInput;
  searchKeyword?: InputMaybe<Scalars['String']>;
};

export type SellerPaginationResponse = {
  __typename?: 'SellerPaginationResponse';
  cursor?: Maybe<Scalars['String']>;
  data: Array<Maybe<SellerResponse>>;
  page: Scalars['Long'];
  totalCount: Scalars['Long'];
};

export type SellerRegisterDtoInput = {
  description: Scalars['String'];
  entityStatus?: InputMaybe<EntityStatus>;
  name: Scalars['String'];
};

export type SellerResponse = {
  __typename?: 'SellerResponse';
  description: Scalars['String'];
  likeCount: Scalars['Long'];
  name: Scalars['String'];
  uuid: Scalars['String'];
};

export enum SemesterType {
  Fall = 'FALL',
  Spring = 'SPRING',
  Summer = 'SUMMER',
  Winter = 'WINTER'
}

export enum SocialProvider {
  App = 'APP',
  Apple = 'APPLE',
  Facebook = 'FACEBOOK',
  Kakaotalk = 'KAKAOTALK'
}

export type Sort = {
  __typename?: 'Sort';
  DEFAULT_DIRECTION?: Maybe<Direction>;
  empty: Scalars['Boolean'];
  sorted: Scalars['Boolean'];
  unsorted: Scalars['Boolean'];
};

export enum StudentType {
  Master = 'MASTER',
  None = 'NONE',
  Phd = 'PHD',
  Postdoctor = 'POSTDOCTOR',
  Postgrad = 'POSTGRAD',
  Professor = 'PROFESSOR',
  Undergraduate = 'UNDERGRADUATE'
}

export enum TermsType {
  CommunityRule = 'COMMUNITY_RULE',
  Marketing = 'MARKETING',
  PersonalInfoUse = 'PERSONAL_INFO_USE',
  ServiceUse = 'SERVICE_USE'
}

export type TestDto = {
  __typename?: 'TestDto';
  description?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type TestFetchDtoInput = {
  count: Scalars['Int'];
};

export type TestResultDto = {
  __typename?: 'TestResultDto';
  page: Scalars['Int'];
  tests?: Maybe<Array<Maybe<TestDto>>>;
};

export type TimeRange = {
  __typename?: 'TimeRange';
  fromTime?: Maybe<Scalars['LocalTime']>;
  toTime?: Maybe<Scalars['LocalTime']>;
};

export type TimeRangeInput = {
  fromTime?: InputMaybe<Scalars['LocalTime']>;
  toTime?: InputMaybe<Scalars['LocalTime']>;
};

export type TimeTableEditDtoInput = {
  changeLog?: InputMaybe<Scalars['String']>;
  customCourses?: InputMaybe<Array<InputMaybe<CustomCourseRegisterDtoInput>>>;
  entityStatus?: InputMaybe<EntityStatus>;
  isFavorite?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  timeTableSchoolCourses?: InputMaybe<Array<InputMaybe<TimeTableSchoolCourseRegisterDtoInput>>>;
  uuid: Scalars['String'];
};

export type TimeTableEntityView = {
  __typename?: 'TimeTableEntityView';
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  customCourses?: Maybe<Array<Maybe<CustomCourseEntityView>>>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  isFavorite?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  schoolCourses?: Maybe<Array<Maybe<SchoolCourseEntityView>>>;
  semester?: Maybe<SemesterType>;
  uuid: Scalars['String'];
  year?: Maybe<Scalars['Int']>;
  yearAndSemesterName?: Maybe<Scalars['String']>;
};

export type TimeTableFetchDtoInput = {
  semesterType?: InputMaybe<SemesterType>;
  userUuid?: InputMaybe<Scalars['String']>;
  year?: InputMaybe<Scalars['Int']>;
};

export type TimeTableRegisterDtoInput = {
  entityStatus?: InputMaybe<EntityStatus>;
  isFavorite?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
  semester: SemesterType;
  year: Scalars['Int'];
};

export type TimeTableSchoolCourseRegisterDtoInput = {
  displayOrder?: InputMaybe<Scalars['Int']>;
  entityStatus?: InputMaybe<EntityStatus>;
  schoolCourseUuid?: InputMaybe<Scalars['String']>;
  timeTableUuid?: InputMaybe<Scalars['String']>;
};

export type TimeTableTemplate = {
  __typename?: 'TimeTableTemplate';
  semester?: Maybe<SemesterType>;
  year?: Maybe<Scalars['Int']>;
};

export type TotiAnswerEditDtoInput = {
  changeLog?: InputMaybe<Scalars['String']>;
  content?: InputMaybe<Scalars['String']>;
  entityStatus?: InputMaybe<EntityStatus>;
  isChoice?: InputMaybe<Scalars['Boolean']>;
  uuid: Scalars['String'];
};

export type TotiAnswerFetchDtoInput = {
  entityStatus?: InputMaybe<EntityStatus>;
  isChoice?: InputMaybe<Scalars['Boolean']>;
  paginationRequestDto: PaginationRequestDto_StringInput;
  questionUuid?: InputMaybe<Scalars['String']>;
  sortType?: InputMaybe<TotiAnswerSortType>;
  userUuid?: InputMaybe<Scalars['String']>;
};

export type TotiAnswerMutationResponse = {
  __typename?: 'TotiAnswerMutationResponse';
  entityStatus: EntityStatus;
  userReports?: Maybe<Array<Maybe<UserReportEntityView>>>;
  uuid: Scalars['String'];
};

export type TotiAnswerPaginationResponse = {
  __typename?: 'TotiAnswerPaginationResponse';
  cursor?: Maybe<Scalars['String']>;
  data: Array<Maybe<TotiAnswerResponse>>;
  page: Scalars['Long'];
  totalCount: Scalars['Long'];
};

export type TotiAnswerRegisterDtoInput = {
  content: Scalars['String'];
  entityStatus?: InputMaybe<EntityStatus>;
  mentorUuid: Scalars['String'];
  totiQuestionUuid: Scalars['String'];
};

export type TotiAnswerResponse = {
  __typename?: 'TotiAnswerResponse';
  commentCount?: Maybe<Scalars['Int']>;
  content: Scalars['String'];
  createdBy: Scalars['String'];
  createdDate: Scalars['LocalDateTime'];
  entityStatus: EntityStatus;
  isChoice?: Maybe<Scalars['Boolean']>;
  lastModifiedBy: Scalars['String'];
  lastModifiedDate: Scalars['LocalDateTime'];
  likeCount?: Maybe<Scalars['Long']>;
  totiMentor?: Maybe<TotiMentorResponse>;
  totiQuestionUuid?: Maybe<Scalars['String']>;
  user: UserEntityView;
  userReports?: Maybe<Array<Maybe<UserReportEntityView>>>;
  uuid: Scalars['String'];
};

export enum TotiAnswerSortType {
  Recent = 'RECENT',
  Register = 'REGISTER'
}

export type TotiCommentEditDtoInput = {
  changeLog?: InputMaybe<Scalars['String']>;
  comment?: InputMaybe<Scalars['String']>;
  entityStatus?: InputMaybe<EntityStatus>;
  uuid: Scalars['String'];
};

export type TotiCommentFetchDtoInput = {
  entityStatus?: InputMaybe<EntityStatus>;
  paginationRequestDto: PaginationRequestDto_StringInput;
  parentEntityUuid?: InputMaybe<Scalars['String']>;
  sortType?: InputMaybe<TotiCommentSortType>;
  userUuid?: InputMaybe<Scalars['String']>;
};

export type TotiCommentMutationResponse = {
  __typename?: 'TotiCommentMutationResponse';
  entityStatus: EntityStatus;
  userReports?: Maybe<Array<Maybe<UserReportEntityView>>>;
  uuid: Scalars['String'];
};

export type TotiCommentPaginationResponse = {
  __typename?: 'TotiCommentPaginationResponse';
  cursor?: Maybe<Scalars['String']>;
  data: Array<Maybe<TotiCommentResponse>>;
  page: Scalars['Long'];
  totalCount: Scalars['Long'];
};

export type TotiCommentRegisterDtoInput = {
  comment: Scalars['String'];
  entityStatus?: InputMaybe<EntityStatus>;
  parentEntityUuid: Scalars['String'];
};

export type TotiCommentResponse = {
  __typename?: 'TotiCommentResponse';
  comment: Scalars['String'];
  createdBy: Scalars['String'];
  createdDate: Scalars['LocalDateTime'];
  entityStatus: EntityStatus;
  isLikedByMe?: Maybe<Scalars['Boolean']>;
  lastModifiedBy: Scalars['String'];
  lastModifiedDate: Scalars['LocalDateTime'];
  likeCount?: Maybe<Scalars['Long']>;
  parentEntityUuid: Scalars['String'];
  user: UserEntityView;
  userReports?: Maybe<Array<Maybe<UserReportEntityView>>>;
  uuid: Scalars['String'];
};

export enum TotiCommentSortType {
  Recent = 'RECENT',
  Register = 'REGISTER'
}

export type TotiKeywordResponse = {
  __typename?: 'TotiKeywordResponse';
  code: Scalars['String'];
  name: Scalars['String'];
  uuid: Scalars['String'];
};

export type TotiKeywordUserRegisterDtoInput = {
  entityStatus?: InputMaybe<EntityStatus>;
  totiKeywordUuids: Array<InputMaybe<Scalars['String']>>;
};

export type TotiMentorEditDtoInput = {
  applicationPass?: InputMaybe<Scalars['String']>;
  applicationUnpass?: InputMaybe<Scalars['String']>;
  bachelorCollege?: InputMaybe<Scalars['String']>;
  bachelorMajor?: InputMaybe<Scalars['String']>;
  changeLog?: InputMaybe<Scalars['String']>;
  degreeCollege?: InputMaybe<Scalars['String']>;
  degreeCourseType?: InputMaybe<DegreeCourseType>;
  degreeMajor?: InputMaybe<Scalars['String']>;
  entityStatus?: InputMaybe<EntityStatus>;
  isHomeCollege?: InputMaybe<Scalars['Boolean']>;
  labName?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  researchTitle?: InputMaybe<Scalars['String']>;
  uuid: Scalars['String'];
};

export type TotiMentorFetchDtoInput = {
  entityStatus?: InputMaybe<EntityStatus>;
  paginationRequestDto: PaginationRequestDto_StringInput;
  sortType?: InputMaybe<TotiMentorSortType>;
  userUuid?: InputMaybe<Scalars['String']>;
};

export type TotiMentorKeywordPaginationResponse = {
  __typename?: 'TotiMentorKeywordPaginationResponse';
  cursor?: Maybe<Scalars['String']>;
  data: Array<Maybe<TotiMentorKeywordResponse>>;
  page: Scalars['Long'];
  totalCount: Scalars['Long'];
};

export type TotiMentorKeywordResponse = {
  __typename?: 'TotiMentorKeywordResponse';
  createdBy: Scalars['String'];
  createdDate: Scalars['LocalDateTime'];
  entityStatus: EntityStatus;
  lastModifiedBy: Scalars['String'];
  lastModifiedDate: Scalars['LocalDateTime'];
  totiKeywords?: Maybe<Array<Maybe<TotiKeywordResponse>>>;
  totiMentor?: Maybe<TotiMentorResponse>;
  uuid: Scalars['String'];
};

export type TotiMentorMutationResponse = {
  __typename?: 'TotiMentorMutationResponse';
  entityStatus: EntityStatus;
  userReports?: Maybe<Array<Maybe<UserReportEntityView>>>;
  uuid: Scalars['String'];
};

export type TotiMentorPaginationResponse = {
  __typename?: 'TotiMentorPaginationResponse';
  cursor?: Maybe<Scalars['String']>;
  data: Array<Maybe<TotiMentorResponse>>;
  page: Scalars['Long'];
  totalCount: Scalars['Long'];
};

export type TotiMentorRegisterDtoInput = {
  applicationPass?: InputMaybe<Scalars['String']>;
  applicationUnpass?: InputMaybe<Scalars['String']>;
  bachelorCollege: Scalars['String'];
  bachelorMajor: Scalars['String'];
  degreeCollege: Scalars['String'];
  degreeCourseType: DegreeCourseType;
  degreeMajor: Scalars['String'];
  entityStatus?: InputMaybe<EntityStatus>;
  isHomeCollege?: InputMaybe<Scalars['Boolean']>;
  labName?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  researchTitle?: InputMaybe<Scalars['String']>;
};

export type TotiMentorResponse = {
  __typename?: 'TotiMentorResponse';
  applicationPass?: Maybe<Scalars['String']>;
  applicationUnpass?: Maybe<Scalars['String']>;
  bachelorCollege?: Maybe<Scalars['String']>;
  bachelorMajor?: Maybe<Scalars['String']>;
  createdBy: Scalars['String'];
  createdDate: Scalars['LocalDateTime'];
  degreeCollege: Scalars['String'];
  degreeCourseType: DegreeCourseType;
  degreeMajor: Scalars['String'];
  entityStatus: EntityStatus;
  isHomeCollege?: Maybe<Scalars['Boolean']>;
  labName?: Maybe<Scalars['String']>;
  lastModifiedBy: Scalars['String'];
  lastModifiedDate: Scalars['LocalDateTime'];
  name: Scalars['String'];
  researchTitle?: Maybe<Scalars['String']>;
  totiAnswerCount?: Maybe<Scalars['Int']>;
  user: UserEntityView;
  userReports?: Maybe<Array<Maybe<UserReportEntityView>>>;
  uuid: Scalars['String'];
};

export enum TotiMentorSortType {
  Popular = 'POPULAR',
  Recent = 'RECENT',
  Register = 'REGISTER'
}

export type TotiQuestionAnswerFetchDtoInput = {
  dateRange?: InputMaybe<DateRangeInput>;
  isChoiceAnswer?: InputMaybe<Scalars['Boolean']>;
  isCloseQuestion?: InputMaybe<Scalars['Boolean']>;
  keywordUuids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  paginationRequestDto: PaginationRequestDto_StringInput;
  queryType: TotiQuestionAnswerQueryType;
  searchTitle?: InputMaybe<Scalars['String']>;
  sortType: TotiQuestionAnswerSortType;
  userUuid?: InputMaybe<Scalars['String']>;
};

export type TotiQuestionAnswerPaginationResponse = {
  __typename?: 'TotiQuestionAnswerPaginationResponse';
  cursor?: Maybe<Scalars['String']>;
  data: Array<Maybe<TotiQuestionAnswerResponse>>;
  page: Scalars['Long'];
  totalCount: Scalars['Long'];
};

export enum TotiQuestionAnswerQueryType {
  General = 'GENERAL',
  Myanswer = 'MYANSWER',
  Myquestion = 'MYQUESTION',
  Totikeyword = 'TOTIKEYWORD',
  Userkeyword = 'USERKEYWORD'
}

export type TotiQuestionAnswerResponse = {
  __typename?: 'TotiQuestionAnswerResponse';
  answerCount?: Maybe<Scalars['Int']>;
  content: Scalars['String'];
  createdBy: Scalars['String'];
  createdDate: Scalars['LocalDateTime'];
  entityStatus: EntityStatus;
  isClose?: Maybe<Scalars['Boolean']>;
  lastModifiedBy: Scalars['String'];
  lastModifiedDate: Scalars['LocalDateTime'];
  notifyCount?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  topTotiAnswer?: Maybe<TotiAnswerResponse>;
  user: UserEntityView;
  uuid: Scalars['String'];
};

export enum TotiQuestionAnswerSortType {
  Recent = 'RECENT',
  Register = 'REGISTER'
}

export type TotiQuestionDetailResponse = {
  __typename?: 'TotiQuestionDetailResponse';
  answerCount?: Maybe<Scalars['Int']>;
  commentCount?: Maybe<Scalars['Int']>;
  content: Scalars['String'];
  createdBy: Scalars['String'];
  createdDate: Scalars['LocalDateTime'];
  entityStatus: EntityStatus;
  isClose?: Maybe<Scalars['Boolean']>;
  lastModifiedBy: Scalars['String'];
  lastModifiedDate: Scalars['LocalDateTime'];
  myAnswerNotify?: Maybe<Scalars['Boolean']>;
  notifyCount?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  totiKeywords: Array<Maybe<TotiKeywordResponse>>;
  user: UserEntityView;
  userReports?: Maybe<Array<Maybe<UserReportEntityView>>>;
  uuid: Scalars['String'];
  vote?: Maybe<VoteEntityView>;
};

export type TotiQuestionEditDtoInput = {
  changeLog?: InputMaybe<Scalars['String']>;
  content?: InputMaybe<Scalars['String']>;
  entityStatus?: InputMaybe<EntityStatus>;
  isClose?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
  totiKeywordUuids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  uuid: Scalars['String'];
};

export type TotiQuestionFetchDtoInput = {
  dateRange?: InputMaybe<DateRangeInput>;
  entityStatus?: InputMaybe<EntityStatus>;
  isClose?: InputMaybe<Scalars['Boolean']>;
  paginationRequestDto: PaginationRequestDto_StringInput;
  searchTitle?: InputMaybe<Scalars['String']>;
  sortType?: InputMaybe<TotiQuestionSortType>;
  userUuid?: InputMaybe<Scalars['String']>;
};

export type TotiQuestionMutationResponse = {
  __typename?: 'TotiQuestionMutationResponse';
  entityStatus: EntityStatus;
  userReports?: Maybe<Array<Maybe<UserReportEntityView>>>;
  uuid: Scalars['String'];
};

export type TotiQuestionPaginationResponse = {
  __typename?: 'TotiQuestionPaginationResponse';
  cursor?: Maybe<Scalars['String']>;
  data: Array<Maybe<TotiQuestionResponse>>;
  page: Scalars['Long'];
  totalCount: Scalars['Long'];
};

export type TotiQuestionRegisterDtoInput = {
  content: Scalars['String'];
  entityStatus?: InputMaybe<EntityStatus>;
  title?: InputMaybe<Scalars['String']>;
  totiKeywordUuids: Array<InputMaybe<Scalars['String']>>;
  voteRegisterDto?: InputMaybe<VoteRegisterDtoInput>;
};

export type TotiQuestionResponse = {
  __typename?: 'TotiQuestionResponse';
  answerCount?: Maybe<Scalars['Int']>;
  content: Scalars['String'];
  createdBy: Scalars['String'];
  createdDate: Scalars['LocalDateTime'];
  entityStatus: EntityStatus;
  isClose?: Maybe<Scalars['Boolean']>;
  lastModifiedBy: Scalars['String'];
  lastModifiedDate: Scalars['LocalDateTime'];
  notifyCount?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  totiKeywords: Array<Maybe<TotiKeywordResponse>>;
  user: UserEntityView;
  userReports?: Maybe<Array<Maybe<UserReportEntityView>>>;
  uuid: Scalars['String'];
};

export enum TotiQuestionSortType {
  Answer = 'ANSWER',
  Notify = 'NOTIFY',
  Recent = 'RECENT',
  Register = 'REGISTER'
}

export type UserAppRoleRegisterDtoInput = {
  appRoleUuid?: InputMaybe<Scalars['String']>;
  entityStatus?: InputMaybe<EntityStatus>;
  userUuid?: InputMaybe<Scalars['String']>;
};

export type UserAppRoleViewDto = {
  __typename?: 'UserAppRoleViewDto';
  appRole?: Maybe<AppRoleViewDto>;
  createdBy?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  lastModifiedBy?: Maybe<Scalars['String']>;
  lastModifiedDate?: Maybe<Scalars['LocalDateTime']>;
  user?: Maybe<UserViewDto>;
  uuid: Scalars['String'];
};

export type UserEditDtoInput = {
  accountNumber?: InputMaybe<Scalars['String']>;
  admissionYear?: InputMaybe<Scalars['Int']>;
  agreedTerms?: InputMaybe<Array<InputMaybe<TermsType>>>;
  bankName?: InputMaybe<Scalars['String']>;
  bankUserName?: InputMaybe<Scalars['String']>;
  changeLog?: InputMaybe<Scalars['String']>;
  currentPassword?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  entityStatus?: InputMaybe<EntityStatus>;
  fcmToken?: InputMaybe<Scalars['String']>;
  files?: InputMaybe<Array<InputMaybe<FaEntityFileRegisterDtoInput>>>;
  isPushNotificationOn?: InputMaybe<Scalars['Boolean']>;
  labName?: InputMaybe<Scalars['String']>;
  labResearchTopic?: InputMaybe<Scalars['String']>;
  major?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  profileImageUrl?: InputMaybe<Scalars['String']>;
  realName?: InputMaybe<Scalars['String']>;
  schoolName?: InputMaybe<Scalars['String']>;
  schoolType?: InputMaybe<Scalars['String']>;
  schoolUuid?: InputMaybe<Scalars['String']>;
  schoolVerificationStatus?: InputMaybe<SchoolVerificationStatus>;
  studentType?: InputMaybe<StudentType>;
  uuid?: InputMaybe<Scalars['String']>;
};

export type UserEntityView = {
  __typename?: 'UserEntityView';
  accountNumber?: Maybe<Scalars['String']>;
  admissionYear?: Maybe<Scalars['Int']>;
  bankName?: Maybe<Scalars['String']>;
  bankUserName?: Maybe<Scalars['String']>;
  birth?: Maybe<Scalars['String']>;
  categoryRefType?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  description?: Maybe<Scalars['String']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  emailToChange?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  files?: Maybe<Array<Maybe<FaEntityFileEntityView>>>;
  followId?: Maybe<Scalars['Long']>;
  gender?: Maybe<GenderType>;
  interestCategories?: Maybe<Array<Maybe<InterestCategory>>>;
  isAdmin?: Maybe<Scalars['Boolean']>;
  isBlocked?: Maybe<Scalars['Boolean']>;
  isFollowedByMe?: Maybe<Scalars['Boolean']>;
  isPushNotificationOn?: Maybe<Scalars['Boolean']>;
  labName?: Maybe<Scalars['String']>;
  labResearchTopic?: Maybe<Scalars['String']>;
  likeCount?: Maybe<Scalars['Long']>;
  major?: Maybe<Scalars['String']>;
  majorCategory?: Maybe<MajorCategory>;
  name?: Maybe<Scalars['String']>;
  paymentStatus?: Maybe<UserPaymentStatus>;
  phone?: Maybe<Scalars['String']>;
  profileImage?: Maybe<Scalars['String']>;
  profileImageUrl?: Maybe<Scalars['String']>;
  provider: SocialProvider;
  realName?: Maybe<Scalars['String']>;
  recentFollowDate?: Maybe<Scalars['LocalDateTime']>;
  reviewCount?: Maybe<Scalars['Long']>;
  school?: Maybe<SchoolTypeEntityView>;
  schoolCertificateFiles?: Maybe<Array<Maybe<FaEntityFileEntityView>>>;
  schoolName?: Maybe<Scalars['String']>;
  schoolType?: Maybe<Scalars['String']>;
  schoolVerificationStatus?: Maybe<SchoolVerificationStatus>;
  status?: Maybe<UserStatus>;
  studentType?: Maybe<StudentType>;
  totiQuestionCount?: Maybe<Scalars['Int']>;
  unregisteredReason?: Maybe<Scalars['String']>;
  userAvailablePrice?: Maybe<Scalars['Int']>;
  userReports?: Maybe<Array<Maybe<UserReportEntityView>>>;
  uuid: Scalars['String'];
};

export type UserFetchDtoInput = {
  email?: InputMaybe<Scalars['String']>;
  entityStatus?: InputMaybe<EntityStatus>;
  fetchType?: InputMaybe<UserFetchType>;
  major?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  paginationRequestDto?: InputMaybe<PaginationRequestDto_StringInput>;
  realName?: InputMaybe<Scalars['String']>;
  schoolUuid?: InputMaybe<Scalars['String']>;
  schoolVerificationStatuses?: InputMaybe<Array<InputMaybe<SchoolVerificationStatus>>>;
  sortType?: InputMaybe<UserSortType>;
  userUuid?: InputMaybe<Scalars['String']>;
};

export enum UserFetchType {
  Followed = 'FOLLOWED',
  Following = 'FOLLOWING'
}

export type UserInteractionDeleteDtoInput = {
  entityStatus?: InputMaybe<EntityStatus>;
  parentEntityType: EntityType;
  parentEntityUuid?: InputMaybe<Scalars['String']>;
  userInteractionType: UserInteractionType;
  userInteractionUuids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userUuid?: InputMaybe<Scalars['String']>;
};

export type UserInteractionFetchDtoInput = {
  paginationRequestDto: PaginationRequestDto_StringInput;
  parentEntityType?: InputMaybe<EntityType>;
  parentEntityUuid?: InputMaybe<Scalars['String']>;
  userInteractionType?: InputMaybe<UserInteractionType>;
  userUuid?: InputMaybe<Scalars['String']>;
};

export type UserInteractionMutationResponse = {
  __typename?: 'UserInteractionMutationResponse';
  entityStatus: EntityStatus;
  uuid: Scalars['String'];
};

export type UserInteractionPaginationResponse = {
  __typename?: 'UserInteractionPaginationResponse';
  cursor?: Maybe<Scalars['String']>;
  data: Array<Maybe<UserInteractionResponse>>;
  page: Scalars['Long'];
  totalCount: Scalars['Long'];
};

export type UserInteractionRegisterDtoInput = {
  entityStatus?: InputMaybe<EntityStatus>;
  parentEntityType: EntityType;
  parentEntityUuid: Scalars['String'];
  userInteractionType: UserInteractionType;
};

export type UserInteractionResponse = {
  __typename?: 'UserInteractionResponse';
  blockUserName?: Maybe<Scalars['String']>;
  createdBy: Scalars['String'];
  createdDate: Scalars['LocalDateTime'];
  entityStatus: EntityStatus;
  lastModifiedBy: Scalars['String'];
  lastModifiedDate: Scalars['LocalDateTime'];
  parentEntityType?: Maybe<EntityType>;
  parentEntityUuid: Scalars['String'];
  user: UserEntityView;
  userInteractionType?: Maybe<UserInteractionType>;
  uuid: Scalars['String'];
};

export enum UserInteractionType {
  Block = 'BLOCK',
  Follow = 'FOLLOW',
  Like = 'LIKE',
  Notify = 'NOTIFY',
  Scrap = 'SCRAP',
  View = 'VIEW'
}

export type UserMessageEditDtoInput = {
  changeLog?: InputMaybe<Scalars['String']>;
  entityStatus?: InputMaybe<EntityStatus>;
  isRead?: InputMaybe<Scalars['Boolean']>;
  uuid: Scalars['String'];
};

export type UserMessageEntityView = {
  __typename?: 'UserMessageEntityView';
  anonymous?: Maybe<Scalars['Boolean']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  isRead?: Maybe<Scalars['Boolean']>;
  message?: Maybe<Scalars['String']>;
  receiver?: Maybe<UserEntityView>;
  room?: Maybe<RoomEntityView>;
  sender?: Maybe<UserEntityView>;
  uuid: Scalars['String'];
};

export type UserMessageFetchDtoInput = {
  entityStatus?: InputMaybe<EntityStatus>;
  paginationRequestDto: PaginationRequestDto_StringInput;
  roomUuid?: InputMaybe<Scalars['String']>;
};

export type UserMessagePaginationResultDto = {
  __typename?: 'UserMessagePaginationResultDto';
  cursor?: Maybe<Scalars['String']>;
  data: Array<Maybe<UserMessageEntityView>>;
  page: Scalars['Long'];
  totalCount: Scalars['Long'];
};

export type UserMessageRegisterDtoInput = {
  entityStatus?: InputMaybe<EntityStatus>;
  message: Scalars['String'];
  parentEntityType: EntityType;
  parentEntityUuid: Scalars['String'];
};

export type UserMessageViewDto = {
  __typename?: 'UserMessageViewDto';
  createdBy?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  isAnonymous?: Maybe<Scalars['Boolean']>;
  isRead?: Maybe<Scalars['Boolean']>;
  lastModifiedBy?: Maybe<Scalars['String']>;
  lastModifiedDate?: Maybe<Scalars['LocalDateTime']>;
  message?: Maybe<Scalars['String']>;
  receiver?: Maybe<UserViewDto>;
  roomUuid?: Maybe<Scalars['String']>;
  sender?: Maybe<UserViewDto>;
  uuid: Scalars['String'];
};

export type UserNotificationEditDtoInput = {
  changeLog?: InputMaybe<Scalars['String']>;
  entityStatus?: InputMaybe<EntityStatus>;
  isRead?: InputMaybe<Scalars['Boolean']>;
  uuid: Scalars['String'];
};

export type UserNotificationFetchDtoInput = {
  entityStatus?: InputMaybe<EntityStatus>;
  paginationRequestDto: PaginationRequestDto_UserNotificationViewDtoInput;
  userUuid: Scalars['String'];
};

export type UserNotificationPaginationResultDto = {
  __typename?: 'UserNotificationPaginationResultDto';
  cursor?: Maybe<Scalars['String']>;
  data: Array<Maybe<UserNotificationViewDto>>;
  page: Scalars['Long'];
  totalCount: Scalars['Long'];
};

export type UserNotificationRegisterDtoInput = {
  entityStatus?: InputMaybe<EntityStatus>;
  userUuid: Scalars['String'];
};

export type UserNotificationViewDto = {
  __typename?: 'UserNotificationViewDto';
  createdBy?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  isRead?: Maybe<Scalars['Boolean']>;
  lastModifiedBy?: Maybe<Scalars['String']>;
  lastModifiedDate?: Maybe<Scalars['LocalDateTime']>;
  notification?: Maybe<NotificationViewDto>;
  user?: Maybe<UserViewDto>;
  uuid: Scalars['String'];
};

export type UserNotificationViewDtoInput = {
  createdBy?: InputMaybe<Scalars['String']>;
  createdDate?: InputMaybe<Scalars['LocalDateTime']>;
  entityStatus?: InputMaybe<EntityStatus>;
  isRead?: InputMaybe<Scalars['Boolean']>;
  lastModifiedBy?: InputMaybe<Scalars['String']>;
  lastModifiedDate?: InputMaybe<Scalars['LocalDateTime']>;
  notification?: InputMaybe<NotificationViewDtoInput>;
  user?: InputMaybe<UserViewDtoInput>;
  uuid?: InputMaybe<Scalars['String']>;
};

export type UserPaginationResultDto = {
  __typename?: 'UserPaginationResultDto';
  cursor?: Maybe<Scalars['String']>;
  data: Array<Maybe<UserEntityView>>;
  page: Scalars['Long'];
  totalCount: Scalars['Long'];
};

export enum UserPaymentStatus {
  None = 'NONE',
  PlanA = 'PLAN_A'
}

export type UserRegisterDtoInput = {
  admissionYear?: InputMaybe<Scalars['Int']>;
  agreedTerms?: InputMaybe<Array<InputMaybe<TermsType>>>;
  birth?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  entityStatus?: InputMaybe<EntityStatus>;
  fcmToken?: InputMaybe<Scalars['String']>;
  files?: InputMaybe<Array<InputMaybe<FaEntityFileRegisterDtoInput>>>;
  gender?: InputMaybe<GenderType>;
  interestCategories?: InputMaybe<Array<InputMaybe<InterestCategory>>>;
  isPushNotificationOn?: InputMaybe<Scalars['Boolean']>;
  labName?: InputMaybe<Scalars['String']>;
  labResearchTopic?: InputMaybe<Scalars['String']>;
  major?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  profileImageUrl?: InputMaybe<Scalars['String']>;
  provider?: InputMaybe<SocialProvider>;
  providerId?: InputMaybe<Scalars['String']>;
  providerToken?: InputMaybe<Scalars['String']>;
  realName?: InputMaybe<Scalars['String']>;
  schoolName?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<UserStatus>;
  studentType?: InputMaybe<StudentType>;
};

export type UserReportEntityView = {
  __typename?: 'UserReportEntityView';
  content?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  parentEntityType?: Maybe<EntityType>;
  parentEntityUuid?: Maybe<Scalars['String']>;
  reported: UserEntityView;
  reporter: UserEntityView;
  userReportType: UserReportType;
  uuid: Scalars['String'];
};

export type UserReportRegisterDtoInput = {
  content?: InputMaybe<Scalars['String']>;
  entityStatus?: InputMaybe<EntityStatus>;
  parentEntityType: EntityType;
  parentEntityUuid: Scalars['String'];
  reportedUuid: Scalars['String'];
  userReportType: UserReportType;
};

export enum UserReportType {
  Abuse = 'ABUSE',
  EditRequest = 'EDIT_REQUEST'
}

export type UserReportViewDto = {
  __typename?: 'UserReportViewDto';
  content?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  lastModifiedBy?: Maybe<Scalars['String']>;
  lastModifiedDate?: Maybe<Scalars['LocalDateTime']>;
  parentEntityType?: Maybe<EntityType>;
  parentEntityUuid?: Maybe<Scalars['String']>;
  reported: UserViewDto;
  reporter: UserViewDto;
  userReportType: UserReportType;
  uuid: Scalars['String'];
};

export type UserReportViewDtoInput = {
  content?: InputMaybe<Scalars['String']>;
  createdBy?: InputMaybe<Scalars['String']>;
  createdDate?: InputMaybe<Scalars['LocalDateTime']>;
  entityStatus?: InputMaybe<EntityStatus>;
  lastModifiedBy?: InputMaybe<Scalars['String']>;
  lastModifiedDate?: InputMaybe<Scalars['LocalDateTime']>;
  parentEntityType?: InputMaybe<EntityType>;
  parentEntityUuid?: InputMaybe<Scalars['String']>;
  reported?: InputMaybe<UserViewDtoInput>;
  reporter?: InputMaybe<UserViewDtoInput>;
  userReportType?: InputMaybe<UserReportType>;
  uuid?: InputMaybe<Scalars['String']>;
};

export type UserSearchFilterDtoInput = {
  key?: InputMaybe<UserSearchKeyType>;
  value?: InputMaybe<Scalars['String']>;
};

export enum UserSearchKeyType {
  Email = 'EMAIL',
  Name = 'NAME',
  Phone = 'PHONE'
}

export enum UserSortType {
  Foll0WRecent = 'FOLL0W_RECENT',
  Recent = 'RECENT',
  SchoolVerificationStatus = 'SCHOOL_VERIFICATION_STATUS'
}

export type UserStatisticsViewDto = {
  __typename?: 'UserStatisticsViewDto';
  createdBy?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  dateAndActivatedUsers?: Maybe<Scalars['Map_LocalDate_List_UserViewDtoScalar']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  lastModifiedBy?: Maybe<Scalars['String']>;
  lastModifiedDate?: Maybe<Scalars['LocalDateTime']>;
  uuid: Scalars['String'];
};

export enum UserStatus {
  Activated = 'ACTIVATED',
  Deactivated = 'DEACTIVATED',
  NotVerified = 'NOT_VERIFIED'
}

export type UserViewDto = {
  __typename?: 'UserViewDto';
  accountNumber?: Maybe<Scalars['String']>;
  bankName?: Maybe<Scalars['String']>;
  bankUserName?: Maybe<Scalars['String']>;
  birth?: Maybe<Scalars['String']>;
  categoryRefType?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  description?: Maybe<Scalars['String']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  emailToChange?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  files?: Maybe<Array<Maybe<FaEntityFileViewDto>>>;
  followId?: Maybe<Scalars['Long']>;
  followedByMe?: Maybe<Scalars['Boolean']>;
  gender?: Maybe<GenderType>;
  interestCategories?: Maybe<Array<Maybe<InterestCategory>>>;
  isAdmin?: Maybe<Scalars['Boolean']>;
  isBlocked?: Maybe<Scalars['Boolean']>;
  isFollowedByMe?: Maybe<Scalars['Boolean']>;
  isPushNotificationOn: Scalars['Boolean'];
  lastModifiedBy?: Maybe<Scalars['String']>;
  lastModifiedDate?: Maybe<Scalars['LocalDateTime']>;
  likeCount?: Maybe<Scalars['Long']>;
  major?: Maybe<Scalars['String']>;
  mentorUuid?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  paymentStatus?: Maybe<UserPaymentStatus>;
  phone?: Maybe<Scalars['String']>;
  profileImage?: Maybe<Scalars['String']>;
  profileImageUrl?: Maybe<Scalars['String']>;
  provider: SocialProvider;
  realName?: Maybe<Scalars['String']>;
  recentFollowDate?: Maybe<Scalars['LocalDateTime']>;
  reviewCount?: Maybe<Scalars['Long']>;
  school?: Maybe<SchoolTypeViewDto>;
  schoolCertificateFiles?: Maybe<Array<Maybe<FaEntityFileViewDto>>>;
  schoolName?: Maybe<Scalars['String']>;
  schoolType: Scalars['String'];
  schoolVerificationStatus: SchoolVerificationStatus;
  status?: Maybe<UserStatus>;
  studentType: StudentType;
  unregisteredReason?: Maybe<Scalars['String']>;
  userAvailablePrice?: Maybe<Scalars['Int']>;
  userReports?: Maybe<Array<Maybe<UserReportViewDto>>>;
  uuid: Scalars['String'];
};

export type UserViewDtoInput = {
  accountNumber?: InputMaybe<Scalars['String']>;
  bankName?: InputMaybe<Scalars['String']>;
  bankUserName?: InputMaybe<Scalars['String']>;
  birth?: InputMaybe<Scalars['String']>;
  categoryRefType?: InputMaybe<Scalars['String']>;
  createdBy?: InputMaybe<Scalars['String']>;
  createdDate?: InputMaybe<Scalars['LocalDateTime']>;
  description?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  emailToChange?: InputMaybe<Scalars['String']>;
  entityStatus?: InputMaybe<EntityStatus>;
  files?: InputMaybe<Array<InputMaybe<FaEntityFileViewDtoInput>>>;
  followId?: InputMaybe<Scalars['Long']>;
  gender?: InputMaybe<GenderType>;
  interestCategories?: InputMaybe<Array<InputMaybe<InterestCategory>>>;
  isAdmin?: InputMaybe<Scalars['Boolean']>;
  isBlocked?: InputMaybe<Scalars['Boolean']>;
  isFollowedByMe?: InputMaybe<Scalars['Boolean']>;
  isPushNotificationOn?: InputMaybe<Scalars['Boolean']>;
  lastModifiedBy?: InputMaybe<Scalars['String']>;
  lastModifiedDate?: InputMaybe<Scalars['LocalDateTime']>;
  likeCount?: InputMaybe<Scalars['Long']>;
  major?: InputMaybe<Scalars['String']>;
  mentorUuid?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  paymentStatus?: InputMaybe<UserPaymentStatus>;
  phone?: InputMaybe<Scalars['String']>;
  profileImage?: InputMaybe<Scalars['String']>;
  profileImageUrl?: InputMaybe<Scalars['String']>;
  provider?: InputMaybe<SocialProvider>;
  realName?: InputMaybe<Scalars['String']>;
  recentFollowDate?: InputMaybe<Scalars['LocalDateTime']>;
  reviewCount?: InputMaybe<Scalars['Long']>;
  school?: InputMaybe<SchoolTypeViewDtoInput>;
  schoolCertificateFiles?: InputMaybe<Array<InputMaybe<FaEntityFileViewDtoInput>>>;
  schoolName?: InputMaybe<Scalars['String']>;
  schoolType?: InputMaybe<Scalars['String']>;
  schoolVerificationStatus?: InputMaybe<SchoolVerificationStatus>;
  status?: InputMaybe<UserStatus>;
  studentType?: InputMaybe<StudentType>;
  unregisteredReason?: InputMaybe<Scalars['String']>;
  userAvailablePrice?: InputMaybe<Scalars['Int']>;
  userReports?: InputMaybe<Array<InputMaybe<UserReportViewDtoInput>>>;
  uuid?: InputMaybe<Scalars['String']>;
};

export type VoteEditDtoInput = {
  changeLog?: InputMaybe<Scalars['String']>;
  entityStatus?: InputMaybe<EntityStatus>;
  isDone?: InputMaybe<Scalars['Boolean']>;
  selectedContentUuids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  uuid: Scalars['String'];
};

export type VoteEntityView = {
  __typename?: 'VoteEntityView';
  contents: Array<Maybe<VoteItemEntityView>>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  deadline?: Maybe<Scalars['LocalDateTime']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  isDone: Scalars['Boolean'];
  numChoice: Scalars['Int'];
  numParticipant: Scalars['Int'];
  title: Scalars['String'];
  uuid: Scalars['String'];
};

export type VoteItemEntityView = {
  __typename?: 'VoteItemEntityView';
  content?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['LocalDateTime']>;
  elapsedCreatedDate?: Maybe<Scalars['String']>;
  entityStatus?: Maybe<EntityStatus>;
  isVoted?: Maybe<Scalars['Boolean']>;
  numVote?: Maybe<Scalars['Int']>;
  uuid: Scalars['String'];
};

export type VoteRegisterDtoInput = {
  contents: Array<InputMaybe<Scalars['String']>>;
  deadline?: InputMaybe<Scalars['LocalDateTime']>;
  entityStatus?: InputMaybe<EntityStatus>;
  numChoice: Scalars['Int'];
  parentEntityType?: InputMaybe<EntityType>;
  parentEntityUuid?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

export type NewAlarmCountQueryVariables = Exact<{ [key: string]: never; }>;


export type NewAlarmCountQuery = { __typename?: 'Query', userNotificationCount: any, unreadMessageCount: any };

export type AnnounceBaseFragment = { __typename?: 'AnnounceResponse', announceType?: AnnounceType | null, company?: string | null, content: string, createdBy: string, createdDate: any, entityStatus: EntityStatus, imageUrl?: string | null, lastModifiedBy: string, lastModifiedDate: any, title?: string | null, uuid: string, labKeywords: Array<{ __typename?: 'AnnounceKeywordResponse', code: string, name: string, uuid: string } | null>, totiKeywords: Array<{ __typename?: 'AnnounceKeywordResponse', code: string, name: string, uuid: string } | null> };

export type AnnouncesQueryVariables = Exact<{
  input: AnnounceFetchDtoInput;
}>;


export type AnnouncesQuery = { __typename?: 'Query', announcesByCursor?: { __typename?: 'AnnouncePaginationResponse', cursor?: string | null, page: any, totalCount: any, data: Array<{ __typename?: 'AnnounceResponse', announceType?: AnnounceType | null, company?: string | null, content: string, createdBy: string, createdDate: any, entityStatus: EntityStatus, imageUrl?: string | null, lastModifiedBy: string, lastModifiedDate: any, title?: string | null, uuid: string, labKeywords: Array<{ __typename?: 'AnnounceKeywordResponse', code: string, name: string, uuid: string } | null>, totiKeywords: Array<{ __typename?: 'AnnounceKeywordResponse', code: string, name: string, uuid: string } | null> } | null> } | null };

export type BannerBaseFragment = { __typename?: 'BannerViewDto', uuid: string };

export type BannerSummaryFragment = { __typename?: 'BannerViewDto', title?: string | null, description?: string | null, imageUrl?: string | null, action?: BannerAction | null, actionValue?: string | null, backgroundColor: number, indexBackgroundColor: number, indexColor: number, indexStrokeColor: number, uuid: string };

export type BannerDetailFragment = { __typename?: 'BannerViewDto', title?: string | null, description?: string | null, imageUrl?: string | null, action?: BannerAction | null, actionValue?: string | null, backgroundColor: number, indexBackgroundColor: number, indexColor: number, indexStrokeColor: number, uuid: string };

export type BannersQueryVariables = Exact<{ [key: string]: never; }>;


export type BannersQuery = { __typename?: 'Query', banners: Array<{ __typename?: 'BannerViewDto', title?: string | null, description?: string | null, imageUrl?: string | null, action?: BannerAction | null, actionValue?: string | null, backgroundColor: number, indexBackgroundColor: number, indexColor: number, indexStrokeColor: number, uuid: string } | null> };

export type RegisterBlockInteractionMutationVariables = Exact<{
  registerDto: BlockInteractionRegisterDtoInput;
}>;


export type RegisterBlockInteractionMutation = { __typename?: 'Mutation', registerBlockInteraction: boolean };

export type BoardBaseFragment = { __typename?: 'BoardEntityView', uuid: string };

export type BoardSummaryFragment = { __typename?: 'BoardEntityView', title: string, version: number, createdDate?: any | null, elapsedCreatedDate?: string | null, likeCount?: any | null, bookmarkCount?: any | null, reviewCount?: any | null, isAnonymous: boolean, content: string, uuid: string, files?: Array<{ __typename?: 'FAEntityFileEntityView', file?: { __typename?: 'FileEntityView', url?: string | null } | null } | null> | null, user?: { __typename?: 'UserEntityView', uuid: string, name?: string | null, schoolVerificationStatus?: SchoolVerificationStatus | null, school?: { __typename?: 'SchoolTypeEntityView', name: string } | null } | null, category?: { __typename?: 'FAGroupEntityView', uuid: string, name?: string | null } | null };

export type BoardDetailFragment = { __typename?: 'BoardEntityView', content: string, isBookmarkedByMe?: boolean | null, isLikedByMe?: boolean | null, title: string, version: number, createdDate?: any | null, elapsedCreatedDate?: string | null, likeCount?: any | null, bookmarkCount?: any | null, reviewCount?: any | null, isAnonymous: boolean, uuid: string, vote?: { __typename?: 'VoteEntityView', title: string, deadline?: any | null, isDone: boolean, numChoice: number, numParticipant: number, uuid: string, contents: Array<{ __typename?: 'VoteItemEntityView', uuid: string, content?: string | null, numVote?: number | null, isVoted?: boolean | null } | null> } | null, files?: Array<{ __typename?: 'FAEntityFileEntityView', uuid: string, displayOrder?: number | null, file?: { __typename?: 'FileEntityView', url?: string | null } | null } | null> | null, category?: { __typename?: 'FAGroupEntityView', uuid: string, code?: string | null, name?: string | null } | null, user?: { __typename?: 'UserEntityView', uuid: string, name?: string | null, schoolVerificationStatus?: SchoolVerificationStatus | null, school?: { __typename?: 'SchoolTypeEntityView', name: string } | null } | null };

export type RegisterBoardMutationVariables = Exact<{
  input: BoardRegisterDtoInput;
}>;


export type RegisterBoardMutation = { __typename?: 'Mutation', registerBoard: { __typename?: 'BoardEntityView', uuid: string } };

export type EditBoardMutationVariables = Exact<{
  input: BoardEditDtoInput;
}>;


export type EditBoardMutation = { __typename?: 'Mutation', editBoard: { __typename?: 'BoardEntityView', uuid: string } };

export type DeleteBoardMutationVariables = Exact<{
  uuid: Scalars['String'];
}>;


export type DeleteBoardMutation = { __typename?: 'Mutation', deleteBoard: boolean };

export type HomeBoardsQueryVariables = Exact<{
  uuidFree?: InputMaybe<Scalars['String']>;
  uuidSecret?: InputMaybe<Scalars['String']>;
}>;


export type HomeBoardsQuery = { __typename?: 'Query', boardsByCursorFree: { __typename?: 'BoardPaginationResultDto', data: Array<{ __typename?: 'BoardEntityView', title: string, version: number, createdDate?: any | null, elapsedCreatedDate?: string | null, likeCount?: any | null, bookmarkCount?: any | null, reviewCount?: any | null, isAnonymous: boolean, content: string, uuid: string, files?: Array<{ __typename?: 'FAEntityFileEntityView', file?: { __typename?: 'FileEntityView', url?: string | null } | null } | null> | null, user?: { __typename?: 'UserEntityView', uuid: string, name?: string | null, schoolVerificationStatus?: SchoolVerificationStatus | null, school?: { __typename?: 'SchoolTypeEntityView', name: string } | null } | null, category?: { __typename?: 'FAGroupEntityView', uuid: string, name?: string | null } | null } | null> }, boardsByCursorSecret: { __typename?: 'BoardPaginationResultDto', data: Array<{ __typename?: 'BoardEntityView', title: string, version: number, createdDate?: any | null, elapsedCreatedDate?: string | null, likeCount?: any | null, bookmarkCount?: any | null, reviewCount?: any | null, isAnonymous: boolean, content: string, uuid: string, files?: Array<{ __typename?: 'FAEntityFileEntityView', file?: { __typename?: 'FileEntityView', url?: string | null } | null } | null> | null, user?: { __typename?: 'UserEntityView', uuid: string, name?: string | null, schoolVerificationStatus?: SchoolVerificationStatus | null, school?: { __typename?: 'SchoolTypeEntityView', name: string } | null } | null, category?: { __typename?: 'FAGroupEntityView', uuid: string, name?: string | null } | null } | null> }, infoBoardsByCursor: { __typename?: 'BoardPaginationResultDto', data: Array<{ __typename?: 'BoardEntityView', title: string, version: number, createdDate?: any | null, elapsedCreatedDate?: string | null, likeCount?: any | null, bookmarkCount?: any | null, reviewCount?: any | null, isAnonymous: boolean, content: string, uuid: string, files?: Array<{ __typename?: 'FAEntityFileEntityView', file?: { __typename?: 'FileEntityView', url?: string | null } | null } | null> | null, user?: { __typename?: 'UserEntityView', uuid: string, name?: string | null, schoolVerificationStatus?: SchoolVerificationStatus | null, school?: { __typename?: 'SchoolTypeEntityView', name: string } | null } | null, category?: { __typename?: 'FAGroupEntityView', uuid: string, name?: string | null } | null } | null> } };

export type BoardQueryVariables = Exact<{
  uuid: Scalars['String'];
}>;


export type BoardQuery = { __typename?: 'Query', board: { __typename?: 'BoardEntityView', content: string, isBookmarkedByMe?: boolean | null, isLikedByMe?: boolean | null, title: string, version: number, createdDate?: any | null, elapsedCreatedDate?: string | null, likeCount?: any | null, bookmarkCount?: any | null, reviewCount?: any | null, isAnonymous: boolean, uuid: string, vote?: { __typename?: 'VoteEntityView', title: string, deadline?: any | null, isDone: boolean, numChoice: number, numParticipant: number, uuid: string, contents: Array<{ __typename?: 'VoteItemEntityView', uuid: string, content?: string | null, numVote?: number | null, isVoted?: boolean | null } | null> } | null, files?: Array<{ __typename?: 'FAEntityFileEntityView', uuid: string, displayOrder?: number | null, file?: { __typename?: 'FileEntityView', url?: string | null } | null } | null> | null, category?: { __typename?: 'FAGroupEntityView', uuid: string, code?: string | null, name?: string | null } | null, user?: { __typename?: 'UserEntityView', uuid: string, name?: string | null, schoolVerificationStatus?: SchoolVerificationStatus | null, school?: { __typename?: 'SchoolTypeEntityView', name: string } | null } | null } };

export type BoardMyQueryVariables = Exact<{
  uuid: Scalars['String'];
}>;


export type BoardMyQuery = { __typename?: 'Query', board: { __typename?: 'BoardEntityView', likeCount?: any | null, bookmarkCount?: any | null, isBookmarkedByMe?: boolean | null, isLikedByMe?: boolean | null, uuid: string, vote?: { __typename?: 'VoteEntityView', title: string, deadline?: any | null, isDone: boolean, numChoice: number, numParticipant: number, uuid: string, contents: Array<{ __typename?: 'VoteItemEntityView', uuid: string, content?: string | null, numVote?: number | null, isVoted?: boolean | null } | null> } | null } };

export type BoardsQueryVariables = Exact<{
  input: BoardFetchDtoInput;
}>;


export type BoardsQuery = { __typename?: 'Query', boardsByCursor: { __typename?: 'BoardPaginationResultDto', cursor?: string | null, page: any, totalCount: any, data: Array<{ __typename?: 'BoardEntityView', title: string, version: number, createdDate?: any | null, elapsedCreatedDate?: string | null, likeCount?: any | null, bookmarkCount?: any | null, reviewCount?: any | null, isAnonymous: boolean, content: string, uuid: string, files?: Array<{ __typename?: 'FAEntityFileEntityView', file?: { __typename?: 'FileEntityView', url?: string | null } | null } | null> | null, user?: { __typename?: 'UserEntityView', uuid: string, name?: string | null, schoolVerificationStatus?: SchoolVerificationStatus | null, school?: { __typename?: 'SchoolTypeEntityView', name: string } | null } | null, category?: { __typename?: 'FAGroupEntityView', uuid: string, name?: string | null } | null } | null> } };

export type BoardsDetailQueryVariables = Exact<{
  input: BoardFetchDtoInput;
}>;


export type BoardsDetailQuery = { __typename?: 'Query', boardsByCursor: { __typename?: 'BoardPaginationResultDto', cursor?: string | null, page: any, totalCount: any, data: Array<{ __typename?: 'BoardEntityView', content: string, isBookmarkedByMe?: boolean | null, isLikedByMe?: boolean | null, title: string, version: number, createdDate?: any | null, elapsedCreatedDate?: string | null, likeCount?: any | null, bookmarkCount?: any | null, reviewCount?: any | null, isAnonymous: boolean, uuid: string, vote?: { __typename?: 'VoteEntityView', title: string, deadline?: any | null, isDone: boolean, numChoice: number, numParticipant: number, uuid: string, contents: Array<{ __typename?: 'VoteItemEntityView', uuid: string, content?: string | null, numVote?: number | null, isVoted?: boolean | null } | null> } | null, files?: Array<{ __typename?: 'FAEntityFileEntityView', uuid: string, displayOrder?: number | null, file?: { __typename?: 'FileEntityView', url?: string | null } | null } | null> | null, category?: { __typename?: 'FAGroupEntityView', uuid: string, code?: string | null, name?: string | null } | null, user?: { __typename?: 'UserEntityView', uuid: string, name?: string | null, schoolVerificationStatus?: SchoolVerificationStatus | null, school?: { __typename?: 'SchoolTypeEntityView', name: string } | null } | null } | null> } };

export type FaGroupBaseFragment = { __typename?: 'FAGroupViewDto', uuid: string, code?: string | null };

export type FaGroupSummaryFragment = { __typename?: 'FAGroupViewDto', name?: string | null, description?: string | null, iconUrl?: string | null, subGroupType?: FaSubGroupType | null, writable?: boolean | null, uuid: string, code?: string | null };

export type FaGroupDetailFragment = { __typename?: 'FAGroupViewDto', name?: string | null, description?: string | null, iconUrl?: string | null, subGroupType?: FaSubGroupType | null, writable?: boolean | null, uuid: string, code?: string | null };

export type FaGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type FaGroupsQuery = { __typename?: 'Query', FAGroups: Array<{ __typename?: 'FAGroupViewDto', name?: string | null, description?: string | null, iconUrl?: string | null, subGroupType?: FaSubGroupType | null, writable?: boolean | null, uuid: string, code?: string | null } | null> };

export type HomeDataQueryVariables = Exact<{ [key: string]: never; }>;


export type HomeDataQuery = { __typename?: 'Query', banners: Array<{ __typename?: 'BannerViewDto', action?: BannerAction | null, actionValue?: string | null, description?: string | null, imageUrl?: string | null, indexColor: number, indexBackgroundColor: number, indexStrokeColor: number, uuid: string, createdDate?: any | null, title?: string | null, backgroundColor: number } | null> };

export type SendVerificationCodeMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type SendVerificationCodeMutation = { __typename?: 'Mutation', sendVerificationCode: { __typename?: 'MailVerificationDto', uuid: string, verifiedAt?: any | null, expiredAt?: any | null } };

export type VerifyCodeMutationVariables = Exact<{
  email: Scalars['String'];
  code: Scalars['String'];
}>;


export type VerifyCodeMutation = { __typename?: 'Mutation', verifyCode: { __typename?: 'MailVerificationDto', uuid: string, email?: string | null, verifiedAt?: any | null, expiredAt?: any | null } };

export type SendResetPasswordEmailMutationVariables = Exact<{
  email: Scalars['String'];
  name: Scalars['String'];
}>;


export type SendResetPasswordEmailMutation = { __typename?: 'Mutation', sendResetPasswordEmail: boolean };

export type MeSummaryFragment = { __typename?: 'UserEntityView', uuid: string, accountNumber?: string | null, email?: string | null, name?: string | null, realName?: string | null, provider: SocialProvider, profileImage?: string | null, profileImageUrl?: string | null, schoolVerificationStatus?: SchoolVerificationStatus | null, studentType?: StudentType | null, isAdmin?: boolean | null, school?: { __typename?: 'SchoolTypeEntityView', name: string, uuid: string } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'UserEntityView', uuid: string, accountNumber?: string | null, email?: string | null, name?: string | null, realName?: string | null, provider: SocialProvider, profileImage?: string | null, profileImageUrl?: string | null, schoolVerificationStatus?: SchoolVerificationStatus | null, studentType?: StudentType | null, isAdmin?: boolean | null, school?: { __typename?: 'SchoolTypeEntityView', name: string, uuid: string } | null } };

export type NoticeBaseFragment = { __typename?: 'NoticeEntityView', uuid: string };

export type NoticeDataFragment = { __typename?: 'NoticeEntityView', content: string, createdDate?: any | null, createdUserId?: any | null, elapsedCreatedDate?: string | null, entityStatus?: EntityStatus | null, isLikedByMe?: boolean | null, likeCount?: any | null, title: string, uuid: string };

export type RegisterNoticeMutationVariables = Exact<{
  input: NoticeRegisterDtoInput;
}>;


export type RegisterNoticeMutation = { __typename?: 'Mutation', registerNotice: { __typename?: 'NoticeEntityView', uuid: string } };

export type EditNoticeMutationVariables = Exact<{
  input: NoticeEditDtoInput;
}>;


export type EditNoticeMutation = { __typename?: 'Mutation', editNotice: { __typename?: 'NoticeEntityView', uuid: string } };

export type DeleteNoticeMutationVariables = Exact<{
  uuid?: InputMaybe<Scalars['String']>;
}>;


export type DeleteNoticeMutation = { __typename?: 'Mutation', deleteNotice: boolean };

export type NoticeQueryVariables = Exact<{
  uuid?: InputMaybe<Scalars['String']>;
}>;


export type NoticeQuery = { __typename?: 'Query', notice: { __typename?: 'NoticeEntityView', content: string, createdDate?: any | null, createdUserId?: any | null, elapsedCreatedDate?: string | null, entityStatus?: EntityStatus | null, isLikedByMe?: boolean | null, likeCount?: any | null, title: string, uuid: string } };

export type NoticesListQueryVariables = Exact<{
  input?: InputMaybe<NoticeFetchDtoInput>;
}>;


export type NoticesListQuery = { __typename?: 'Query', noticesByCursor: { __typename?: 'NoticePaginationResultDto', cursor?: string | null, totalCount: any, page: any, data: Array<{ __typename?: 'NoticeEntityView', content: string, createdDate?: any | null, createdUserId?: any | null, elapsedCreatedDate?: string | null, entityStatus?: EntityStatus | null, isLikedByMe?: boolean | null, likeCount?: any | null, title: string, uuid: string } | null> } };

export type NotificationBaseFragment = { __typename?: 'NotificationViewDto', uuid: string };

export type NotificationSummaryFragment = { __typename?: 'NotificationViewDto', title?: string | null, actionUrl?: string | null, iconUrl?: string | null, uuid: string };

export type NotificationDetailFragment = { __typename?: 'NotificationViewDto', content?: string | null, title?: string | null, actionUrl?: string | null, iconUrl?: string | null, uuid: string };

export type ReviewBaseFragment = { __typename?: 'ReviewViewDto', uuid: string };

export type ReviewSummaryFragment = { __typename?: 'ReviewViewDto', content?: string | null, isAnonymous?: boolean | null, isLikedByMe?: boolean | null, likeCount?: any | null, entityStatus?: EntityStatus | null, createdDate?: any | null, parentEntityType?: EntityType | null, parentEntityUuid?: string | null, parentReviewUuid?: string | null, uuid: string, user?: { __typename?: 'UserViewDto', uuid: string, name?: string | null, profileImage?: string | null, profileImageUrl?: string | null, schoolName?: string | null, schoolVerificationStatus: SchoolVerificationStatus, school?: { __typename?: 'SchoolTypeViewDto', name?: string | null } | null } | null, childReviews?: Array<{ __typename?: 'ReviewViewDto', content?: string | null, isAnonymous?: boolean | null, isLikedByMe?: boolean | null, likeCount?: any | null, entityStatus?: EntityStatus | null, createdDate?: any | null, parentEntityType?: EntityType | null, parentEntityUuid?: string | null, parentReviewUuid?: string | null, uuid: string, user?: { __typename?: 'UserViewDto', uuid: string, name?: string | null, profileImage?: string | null, profileImageUrl?: string | null, schoolVerificationStatus: SchoolVerificationStatus, schoolName?: string | null, school?: { __typename?: 'SchoolTypeViewDto', name?: string | null } | null } | null } | null> | null };

export type ReviewDetailFragment = { __typename?: 'ReviewViewDto', content?: string | null, isAnonymous?: boolean | null, isLikedByMe?: boolean | null, likeCount?: any | null, entityStatus?: EntityStatus | null, createdDate?: any | null, parentEntityType?: EntityType | null, parentEntityUuid?: string | null, parentReviewUuid?: string | null, uuid: string, user?: { __typename?: 'UserViewDto', uuid: string, name?: string | null, profileImage?: string | null, profileImageUrl?: string | null, schoolName?: string | null, schoolVerificationStatus: SchoolVerificationStatus, school?: { __typename?: 'SchoolTypeViewDto', name?: string | null } | null } | null, childReviews?: Array<{ __typename?: 'ReviewViewDto', content?: string | null, isAnonymous?: boolean | null, isLikedByMe?: boolean | null, likeCount?: any | null, entityStatus?: EntityStatus | null, createdDate?: any | null, parentEntityType?: EntityType | null, parentEntityUuid?: string | null, parentReviewUuid?: string | null, uuid: string, user?: { __typename?: 'UserViewDto', uuid: string, name?: string | null, profileImage?: string | null, profileImageUrl?: string | null, schoolVerificationStatus: SchoolVerificationStatus, schoolName?: string | null, school?: { __typename?: 'SchoolTypeViewDto', name?: string | null } | null } | null } | null> | null };

export type RegisterReviewMutationVariables = Exact<{
  input: ReviewRegisterDtoInput;
}>;


export type RegisterReviewMutation = { __typename?: 'Mutation', registerReview: { __typename?: 'ReviewViewDto', uuid: string } };

export type EditReviewMutationVariables = Exact<{
  input: ReviewEditDtoInput;
}>;


export type EditReviewMutation = { __typename?: 'Mutation', editReview: { __typename?: 'ReviewViewDto', uuid: string } };

export type DeleteReviewMutationVariables = Exact<{
  uuid: Scalars['String'];
}>;


export type DeleteReviewMutation = { __typename?: 'Mutation', deleteReview: boolean };

export type ReviewQueryVariables = Exact<{
  uuid: Scalars['String'];
}>;


export type ReviewQuery = { __typename?: 'Query', review: { __typename?: 'ReviewViewDto', content?: string | null, isAnonymous?: boolean | null, isLikedByMe?: boolean | null, likeCount?: any | null, entityStatus?: EntityStatus | null, createdDate?: any | null, parentEntityType?: EntityType | null, parentEntityUuid?: string | null, parentReviewUuid?: string | null, uuid: string, user?: { __typename?: 'UserViewDto', uuid: string, name?: string | null, profileImage?: string | null, profileImageUrl?: string | null, schoolName?: string | null, schoolVerificationStatus: SchoolVerificationStatus, school?: { __typename?: 'SchoolTypeViewDto', name?: string | null } | null } | null, childReviews?: Array<{ __typename?: 'ReviewViewDto', content?: string | null, isAnonymous?: boolean | null, isLikedByMe?: boolean | null, likeCount?: any | null, entityStatus?: EntityStatus | null, createdDate?: any | null, parentEntityType?: EntityType | null, parentEntityUuid?: string | null, parentReviewUuid?: string | null, uuid: string, user?: { __typename?: 'UserViewDto', uuid: string, name?: string | null, profileImage?: string | null, profileImageUrl?: string | null, schoolVerificationStatus: SchoolVerificationStatus, schoolName?: string | null, school?: { __typename?: 'SchoolTypeViewDto', name?: string | null } | null } | null } | null> | null } };

export type ReviewsQueryVariables = Exact<{
  input: ReviewFetchDtoInput;
}>;


export type ReviewsQuery = { __typename?: 'Query', reviewsByCursor: { __typename?: 'ReviewPaginationResultDto', cursor?: string | null, data: Array<{ __typename?: 'ReviewViewDto', content?: string | null, isAnonymous?: boolean | null, isLikedByMe?: boolean | null, likeCount?: any | null, entityStatus?: EntityStatus | null, createdDate?: any | null, parentEntityType?: EntityType | null, parentEntityUuid?: string | null, parentReviewUuid?: string | null, uuid: string, user?: { __typename?: 'UserViewDto', uuid: string, name?: string | null, profileImage?: string | null, profileImageUrl?: string | null, schoolName?: string | null, schoolVerificationStatus: SchoolVerificationStatus, school?: { __typename?: 'SchoolTypeViewDto', name?: string | null } | null } | null, childReviews?: Array<{ __typename?: 'ReviewViewDto', content?: string | null, isAnonymous?: boolean | null, isLikedByMe?: boolean | null, likeCount?: any | null, entityStatus?: EntityStatus | null, createdDate?: any | null, parentEntityType?: EntityType | null, parentEntityUuid?: string | null, parentReviewUuid?: string | null, uuid: string, user?: { __typename?: 'UserViewDto', uuid: string, name?: string | null, profileImage?: string | null, profileImageUrl?: string | null, schoolVerificationStatus: SchoolVerificationStatus, schoolName?: string | null, school?: { __typename?: 'SchoolTypeViewDto', name?: string | null } | null } | null } | null> | null } | null> } };

export type RoomBaseFragment = { __typename?: 'RoomEntityView', uuid: string };

export type RoomSummaryFragment = { __typename?: 'RoomEntityView', isAnonymous?: boolean | null, uuid: string, partner?: { __typename?: 'UserEntityView', uuid: string, accountNumber?: string | null, name?: string | null, profileImage?: string | null, profileImageUrl?: string | null, school?: { __typename?: 'SchoolTypeEntityView', name: string } | null } | null, lastMessage?: { __typename?: 'UserMessageEntityView', message?: string | null, isRead?: boolean | null, anonymous?: boolean | null, createdDate?: any | null, uuid: string, room?: { __typename?: 'RoomEntityView', uuid: string } | null, sender?: { __typename?: 'UserEntityView', uuid: string, accountNumber?: string | null, provider: SocialProvider, name?: string | null, profileImage?: string | null, profileImageUrl?: string | null, school?: { __typename?: 'SchoolTypeEntityView', code: string, name: string, region: string, uuid: string } | null } | null } | null };

export type RoomDetailFragment = { __typename?: 'RoomEntityView', isAnonymous?: boolean | null, uuid: string, partner?: { __typename?: 'UserEntityView', uuid: string, accountNumber?: string | null, name?: string | null, profileImage?: string | null, profileImageUrl?: string | null, school?: { __typename?: 'SchoolTypeEntityView', name: string } | null } | null, lastMessage?: { __typename?: 'UserMessageEntityView', message?: string | null, isRead?: boolean | null, anonymous?: boolean | null, createdDate?: any | null, uuid: string, room?: { __typename?: 'RoomEntityView', uuid: string } | null, sender?: { __typename?: 'UserEntityView', uuid: string, accountNumber?: string | null, provider: SocialProvider, name?: string | null, profileImage?: string | null, profileImageUrl?: string | null, school?: { __typename?: 'SchoolTypeEntityView', code: string, name: string, region: string, uuid: string } | null } | null } | null };

export type RoomQueryVariables = Exact<{
  uuid: Scalars['String'];
}>;


export type RoomQuery = { __typename?: 'Query', room: { __typename?: 'RoomEntityView', isAnonymous?: boolean | null, uuid: string, partner?: { __typename?: 'UserEntityView', uuid: string, accountNumber?: string | null, name?: string | null, profileImage?: string | null, profileImageUrl?: string | null, school?: { __typename?: 'SchoolTypeEntityView', name: string } | null } | null, lastMessage?: { __typename?: 'UserMessageEntityView', message?: string | null, isRead?: boolean | null, anonymous?: boolean | null, createdDate?: any | null, uuid: string, room?: { __typename?: 'RoomEntityView', uuid: string } | null, sender?: { __typename?: 'UserEntityView', uuid: string, accountNumber?: string | null, provider: SocialProvider, name?: string | null, profileImage?: string | null, profileImageUrl?: string | null, school?: { __typename?: 'SchoolTypeEntityView', code: string, name: string, region: string, uuid: string } | null } | null } | null } };

export type RoomsQueryVariables = Exact<{
  input: RoomFetchDtoInput;
}>;


export type RoomsQuery = { __typename?: 'Query', roomsByCursor: { __typename?: 'RoomPaginationResultDto', cursor?: string | null, data: Array<{ __typename?: 'RoomEntityView', isAnonymous?: boolean | null, uuid: string, partner?: { __typename?: 'UserEntityView', uuid: string, accountNumber?: string | null, name?: string | null, profileImage?: string | null, profileImageUrl?: string | null, school?: { __typename?: 'SchoolTypeEntityView', name: string } | null } | null, lastMessage?: { __typename?: 'UserMessageEntityView', message?: string | null, isRead?: boolean | null, anonymous?: boolean | null, createdDate?: any | null, uuid: string, room?: { __typename?: 'RoomEntityView', uuid: string } | null, sender?: { __typename?: 'UserEntityView', uuid: string, accountNumber?: string | null, provider: SocialProvider, name?: string | null, profileImage?: string | null, profileImageUrl?: string | null, school?: { __typename?: 'SchoolTypeEntityView', code: string, name: string, region: string, uuid: string } | null } | null } | null } | null> } };

export type BaseSchoolCourseFragment = { __typename?: 'SchoolCourseEntityView', academyYear?: number | null, code?: string | null, createdDate?: any | null, divisionCode?: string | null, elapsedCreatedDate?: string | null, engSubjectName?: string | null, entityStatus?: EntityStatus | null, extras?: string | null, grade?: any | null, isClosed?: boolean | null, kindsCode?: string | null, kindsName?: string | null, numBooking?: number | null, planUrl?: string | null, practiceDivisionCode?: string | null, professors?: string | null, roomName?: string | null, semester?: string | null, studentYear?: number | null, subDescription?: string | null, subjectName?: string | null, time?: string | null, uuid: string, categoryRefSchoolCourses?: Array<{ __typename?: 'CategoryRefEntityView', createdDate?: any | null, elapsedCreatedDate?: string | null, entityStatus?: EntityStatus | null, leaf?: boolean | null, scraped?: boolean | null, uuid: string } | null> | null, dayAndTimeRanges?: Array<{ __typename?: 'DayAndTimeRange', dayOfWeek?: DayOfWeek | null, timeRange?: { __typename?: 'TimeRange', fromTime?: any | null, toTime?: any | null } | null } | null> | null, userReports?: Array<{ __typename?: 'UserReportEntityView', uuid: string } | null> | null };

export type SchoolCoursesQueryVariables = Exact<{
  input?: InputMaybe<SchoolCourseFetchDtoInput>;
}>;


export type SchoolCoursesQuery = { __typename?: 'Query', schoolCoursesByCursor: { __typename?: 'SchoolCoursePaginationResultDto', cursor?: string | null, page: any, totalCount: any, data: Array<{ __typename?: 'SchoolCourseEntityView', academyYear?: number | null, code?: string | null, createdDate?: any | null, divisionCode?: string | null, elapsedCreatedDate?: string | null, engSubjectName?: string | null, entityStatus?: EntityStatus | null, extras?: string | null, grade?: any | null, isClosed?: boolean | null, kindsCode?: string | null, kindsName?: string | null, numBooking?: number | null, planUrl?: string | null, practiceDivisionCode?: string | null, professors?: string | null, roomName?: string | null, semester?: string | null, studentYear?: number | null, subDescription?: string | null, subjectName?: string | null, time?: string | null, uuid: string, categoryRefSchoolCourses?: Array<{ __typename?: 'CategoryRefEntityView', createdDate?: any | null, elapsedCreatedDate?: string | null, entityStatus?: EntityStatus | null, leaf?: boolean | null, scraped?: boolean | null, uuid: string } | null> | null, dayAndTimeRanges?: Array<{ __typename?: 'DayAndTimeRange', dayOfWeek?: DayOfWeek | null, timeRange?: { __typename?: 'TimeRange', fromTime?: any | null, toTime?: any | null } | null } | null> | null, userReports?: Array<{ __typename?: 'UserReportEntityView', uuid: string } | null> | null } | null> } };

export type TimeTableBaseFragment = { __typename?: 'TimeTableEntityView', entityStatus?: EntityStatus | null, isFavorite?: boolean | null, name?: string | null, semester?: SemesterType | null, uuid: string, year?: number | null, yearAndSemesterName?: string | null, customCourses?: Array<{ __typename?: 'CustomCourseEntityView', entityStatus?: EntityStatus | null, professors?: string | null, subjectName?: string | null, timeTableUuid?: string | null, uuid: string, dayAndTimeRanges?: Array<{ __typename?: 'DayAndTimeRange', dayOfWeek?: DayOfWeek | null, timeRange?: { __typename?: 'TimeRange', fromTime?: any | null, toTime?: any | null } | null } | null> | null } | null> | null, schoolCourses?: Array<{ __typename?: 'SchoolCourseEntityView', academyYear?: number | null, code?: string | null, divisionCode?: string | null, engSubjectName?: string | null, entityStatus?: EntityStatus | null, grade?: any | null, kindsCode?: string | null, kindsName?: string | null, numBooking?: number | null, practiceDivisionCode?: string | null, professors?: string | null, roomName?: string | null, semester?: string | null, studentYear?: number | null, subDescription?: string | null, subjectName?: string | null, time?: string | null, uuid: string, categoryRefSchoolCourses?: Array<{ __typename?: 'CategoryRefEntityView', entityStatus?: EntityStatus | null, leaf?: boolean | null, scraped?: boolean | null, uuid: string } | null> | null, dayAndTimeRanges?: Array<{ __typename?: 'DayAndTimeRange', dayOfWeek?: DayOfWeek | null, timeRange?: { __typename?: 'TimeRange', fromTime?: any | null, toTime?: any | null } | null } | null> | null } | null> | null };

export type RegisterTimeTableMutationVariables = Exact<{
  input?: InputMaybe<TimeTableRegisterDtoInput>;
}>;


export type RegisterTimeTableMutation = { __typename?: 'Mutation', registerTimeTable: { __typename?: 'TimeTableEntityView', entityStatus?: EntityStatus | null, isFavorite?: boolean | null, name?: string | null, semester?: SemesterType | null, uuid: string, year?: number | null, yearAndSemesterName?: string | null, customCourses?: Array<{ __typename?: 'CustomCourseEntityView', entityStatus?: EntityStatus | null, professors?: string | null, subjectName?: string | null, timeTableUuid?: string | null, uuid: string, dayAndTimeRanges?: Array<{ __typename?: 'DayAndTimeRange', dayOfWeek?: DayOfWeek | null, timeRange?: { __typename?: 'TimeRange', fromTime?: any | null, toTime?: any | null } | null } | null> | null } | null> | null, schoolCourses?: Array<{ __typename?: 'SchoolCourseEntityView', academyYear?: number | null, code?: string | null, divisionCode?: string | null, engSubjectName?: string | null, entityStatus?: EntityStatus | null, grade?: any | null, kindsCode?: string | null, kindsName?: string | null, numBooking?: number | null, practiceDivisionCode?: string | null, professors?: string | null, roomName?: string | null, semester?: string | null, studentYear?: number | null, subDescription?: string | null, subjectName?: string | null, time?: string | null, uuid: string, categoryRefSchoolCourses?: Array<{ __typename?: 'CategoryRefEntityView', entityStatus?: EntityStatus | null, leaf?: boolean | null, scraped?: boolean | null, uuid: string } | null> | null, dayAndTimeRanges?: Array<{ __typename?: 'DayAndTimeRange', dayOfWeek?: DayOfWeek | null, timeRange?: { __typename?: 'TimeRange', fromTime?: any | null, toTime?: any | null } | null } | null> | null } | null> | null } };

export type EditTimeTableMutationVariables = Exact<{
  input?: InputMaybe<TimeTableEditDtoInput>;
}>;


export type EditTimeTableMutation = { __typename?: 'Mutation', editTimeTable: { __typename?: 'TimeTableEntityView', entityStatus?: EntityStatus | null, isFavorite?: boolean | null, name?: string | null, semester?: SemesterType | null, uuid: string, year?: number | null, yearAndSemesterName?: string | null, customCourses?: Array<{ __typename?: 'CustomCourseEntityView', entityStatus?: EntityStatus | null, professors?: string | null, subjectName?: string | null, timeTableUuid?: string | null, uuid: string, dayAndTimeRanges?: Array<{ __typename?: 'DayAndTimeRange', dayOfWeek?: DayOfWeek | null, timeRange?: { __typename?: 'TimeRange', fromTime?: any | null, toTime?: any | null } | null } | null> | null } | null> | null, schoolCourses?: Array<{ __typename?: 'SchoolCourseEntityView', academyYear?: number | null, code?: string | null, divisionCode?: string | null, engSubjectName?: string | null, entityStatus?: EntityStatus | null, grade?: any | null, kindsCode?: string | null, kindsName?: string | null, numBooking?: number | null, practiceDivisionCode?: string | null, professors?: string | null, roomName?: string | null, semester?: string | null, studentYear?: number | null, subDescription?: string | null, subjectName?: string | null, time?: string | null, uuid: string, categoryRefSchoolCourses?: Array<{ __typename?: 'CategoryRefEntityView', entityStatus?: EntityStatus | null, leaf?: boolean | null, scraped?: boolean | null, uuid: string } | null> | null, dayAndTimeRanges?: Array<{ __typename?: 'DayAndTimeRange', dayOfWeek?: DayOfWeek | null, timeRange?: { __typename?: 'TimeRange', fromTime?: any | null, toTime?: any | null } | null } | null> | null } | null> | null } };

export type DeleteTimeTableMutationVariables = Exact<{
  uuid?: InputMaybe<Scalars['String']>;
}>;


export type DeleteTimeTableMutation = { __typename?: 'Mutation', deleteTimeTable: boolean };

export type TimeTablesQueryVariables = Exact<{
  input?: InputMaybe<TimeTableFetchDtoInput>;
}>;


export type TimeTablesQuery = { __typename?: 'Query', timeTables: Array<{ __typename?: 'TimeTableEntityView', entityStatus?: EntityStatus | null, isFavorite?: boolean | null, name?: string | null, semester?: SemesterType | null, uuid: string, year?: number | null, yearAndSemesterName?: string | null, customCourses?: Array<{ __typename?: 'CustomCourseEntityView', entityStatus?: EntityStatus | null, professors?: string | null, subjectName?: string | null, timeTableUuid?: string | null, uuid: string, dayAndTimeRanges?: Array<{ __typename?: 'DayAndTimeRange', dayOfWeek?: DayOfWeek | null, timeRange?: { __typename?: 'TimeRange', fromTime?: any | null, toTime?: any | null } | null } | null> | null } | null> | null, schoolCourses?: Array<{ __typename?: 'SchoolCourseEntityView', academyYear?: number | null, code?: string | null, divisionCode?: string | null, engSubjectName?: string | null, entityStatus?: EntityStatus | null, grade?: any | null, kindsCode?: string | null, kindsName?: string | null, numBooking?: number | null, practiceDivisionCode?: string | null, professors?: string | null, roomName?: string | null, semester?: string | null, studentYear?: number | null, subDescription?: string | null, subjectName?: string | null, time?: string | null, uuid: string, categoryRefSchoolCourses?: Array<{ __typename?: 'CategoryRefEntityView', entityStatus?: EntityStatus | null, leaf?: boolean | null, scraped?: boolean | null, uuid: string } | null> | null, dayAndTimeRanges?: Array<{ __typename?: 'DayAndTimeRange', dayOfWeek?: DayOfWeek | null, timeRange?: { __typename?: 'TimeRange', fromTime?: any | null, toTime?: any | null } | null } | null> | null } | null> | null } | null> };

export type TimeTableTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type TimeTableTemplatesQuery = { __typename?: 'Query', timeTableTemplates: Array<{ __typename?: 'TimeTableTemplate', semester?: SemesterType | null, year?: number | null } | null> };

export type RegisterTotiMentorMutationVariables = Exact<{
  input?: InputMaybe<TotiMentorRegisterDtoInput>;
}>;


export type RegisterTotiMentorMutation = { __typename?: 'Mutation', registerTotiMentor: { __typename?: 'TotiMentorMutationResponse', entityStatus: EntityStatus, uuid: string } };

export type UserBaseFragment = { __typename?: 'UserEntityView', uuid: string, accountNumber?: string | null };

export type UserSummaryFragment = { __typename?: 'UserEntityView', name?: string | null, profileImage?: string | null, profileImageUrl?: string | null, uuid: string, accountNumber?: string | null, school?: { __typename?: 'SchoolTypeEntityView', name: string } | null };

export type UserDetailFragment = { __typename?: 'UserEntityView', name?: string | null, profileImage?: string | null, profileImageUrl?: string | null, uuid: string, accountNumber?: string | null, school?: { __typename?: 'SchoolTypeEntityView', name: string } | null };

export type CreateUserMutationVariables = Exact<{
  input: UserRegisterDtoInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'UserEntityView', uuid: string, accountNumber?: string | null } };

export type EditUserMutationVariables = Exact<{
  input: UserEditDtoInput;
}>;


export type EditUserMutation = { __typename?: 'Mutation', editUser: { __typename?: 'UserEntityView', schoolVerificationStatus?: SchoolVerificationStatus | null, uuid: string, accountNumber?: string | null } };

export type ResetUserPasswordMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type ResetUserPasswordMutation = { __typename?: 'Mutation', resetUserPassword: { __typename?: 'UserEntityView', uuid: string } };

export type SetDefaultProfileImageMutationVariables = Exact<{ [key: string]: never; }>;


export type SetDefaultProfileImageMutation = { __typename?: 'Mutation', setDefaultProfileImage: boolean };

export type UserQueryVariables = Exact<{
  uuid: Scalars['String'];
}>;


export type UserQuery = { __typename?: 'Query', user: { __typename?: 'UserEntityView', name?: string | null, profileImage?: string | null, profileImageUrl?: string | null, uuid: string, accountNumber?: string | null, school?: { __typename?: 'SchoolTypeEntityView', name: string } | null } };

export type CheckPasswordQueryVariables = Exact<{
  password: Scalars['String'];
}>;


export type CheckPasswordQuery = { __typename?: 'Query', checkPassword: boolean };

export type ExistsNickNameQueryVariables = Exact<{
  nickname: Scalars['String'];
}>;


export type ExistsNickNameQuery = { __typename?: 'Query', existsNickName: boolean };

export type CheckEmailExistsQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type CheckEmailExistsQuery = { __typename?: 'Query', checkEmailExists: boolean };

export type RegisterUserInteractionMutationVariables = Exact<{
  input: UserInteractionRegisterDtoInput;
}>;


export type RegisterUserInteractionMutation = { __typename?: 'Mutation', registerUserInteraction: { __typename?: 'UserInteractionMutationResponse', uuid: string } };

export type DeleteUserInteractionMutationVariables = Exact<{
  input: UserInteractionDeleteDtoInput;
}>;


export type DeleteUserInteractionMutation = { __typename?: 'Mutation', deleteUserInteraction: boolean };

export type UserMessageBaseFragment = { __typename?: 'UserMessageEntityView', uuid: string };

export type UserMessageSummaryFragment = { __typename?: 'UserMessageEntityView', message?: string | null, isRead?: boolean | null, anonymous?: boolean | null, createdDate?: any | null, uuid: string, room?: { __typename?: 'RoomEntityView', uuid: string } | null, sender?: { __typename?: 'UserEntityView', uuid: string, accountNumber?: string | null, provider: SocialProvider, name?: string | null, profileImage?: string | null, profileImageUrl?: string | null, school?: { __typename?: 'SchoolTypeEntityView', code: string, name: string, region: string, uuid: string } | null } | null };

export type UserMessageDetailFragment = { __typename?: 'UserMessageEntityView', message?: string | null, isRead?: boolean | null, anonymous?: boolean | null, createdDate?: any | null, uuid: string, room?: { __typename?: 'RoomEntityView', uuid: string } | null, sender?: { __typename?: 'UserEntityView', uuid: string, accountNumber?: string | null, provider: SocialProvider, name?: string | null, profileImage?: string | null, profileImageUrl?: string | null, school?: { __typename?: 'SchoolTypeEntityView', code: string, name: string, region: string, uuid: string } | null } | null };

export type RegisterUserMessageMutationVariables = Exact<{
  input: UserMessageRegisterDtoInput;
}>;


export type RegisterUserMessageMutation = { __typename?: 'Mutation', registerUserMessage: { __typename?: 'UserMessageViewDto', uuid: string, roomUuid?: string | null } };

export type EditUserMessageMutationVariables = Exact<{
  input: UserMessageEditDtoInput;
}>;


export type EditUserMessageMutation = { __typename?: 'Mutation', editUserMessage: { __typename?: 'UserMessageViewDto', uuid: string } };

export type UnreadMessageCountQueryVariables = Exact<{ [key: string]: never; }>;


export type UnreadMessageCountQuery = { __typename?: 'Query', unreadMessageCount: any };

export type UserMessagesQueryVariables = Exact<{
  input: UserMessageFetchDtoInput;
}>;


export type UserMessagesQuery = { __typename?: 'Query', userMessagesByCursor: { __typename?: 'UserMessagePaginationResultDto', cursor?: string | null, data: Array<{ __typename?: 'UserMessageEntityView', message?: string | null, isRead?: boolean | null, anonymous?: boolean | null, createdDate?: any | null, uuid: string, room?: { __typename?: 'RoomEntityView', uuid: string } | null, sender?: { __typename?: 'UserEntityView', uuid: string, accountNumber?: string | null, provider: SocialProvider, name?: string | null, profileImage?: string | null, profileImageUrl?: string | null, school?: { __typename?: 'SchoolTypeEntityView', code: string, name: string, region: string, uuid: string } | null } | null } | null> } };

export type UserNotificationBaseFragment = { __typename?: 'UserNotificationViewDto', uuid: string };

export type UserNotificationSummaryFragment = { __typename?: 'UserNotificationViewDto', isRead?: boolean | null, createdDate?: any | null, elapsedCreatedDate?: string | null, uuid: string, notification?: { __typename?: 'NotificationViewDto', content?: string | null, title?: string | null, actionUrl?: string | null, iconUrl?: string | null, uuid: string } | null };

export type UserNotificationDetailFragment = { __typename?: 'UserNotificationViewDto', isRead?: boolean | null, createdDate?: any | null, elapsedCreatedDate?: string | null, uuid: string, notification?: { __typename?: 'NotificationViewDto', content?: string | null, title?: string | null, actionUrl?: string | null, iconUrl?: string | null, uuid: string } | null };

export type ReadAllUserNotificationMutationVariables = Exact<{ [key: string]: never; }>;


export type ReadAllUserNotificationMutation = { __typename?: 'Mutation', readAllUserNotification: boolean };

export type EditUserNotificationMutationVariables = Exact<{
  input: UserNotificationEditDtoInput;
}>;


export type EditUserNotificationMutation = { __typename?: 'Mutation', editUserNotification: { __typename?: 'UserNotificationViewDto', uuid: string } };

export type UserNotificationCountQueryVariables = Exact<{ [key: string]: never; }>;


export type UserNotificationCountQuery = { __typename?: 'Query', userNotificationCount: any };

export type UserNotificationsQueryVariables = Exact<{
  input: UserNotificationFetchDtoInput;
}>;


export type UserNotificationsQuery = { __typename?: 'Query', userNotificationsByCursor: { __typename?: 'UserNotificationPaginationResultDto', cursor?: string | null, data: Array<{ __typename?: 'UserNotificationViewDto', isRead?: boolean | null, createdDate?: any | null, elapsedCreatedDate?: string | null, uuid: string, notification?: { __typename?: 'NotificationViewDto', content?: string | null, title?: string | null, actionUrl?: string | null, iconUrl?: string | null, uuid: string } | null } | null> } };

export type UserReportBaseFragment = { __typename?: 'UserReportEntityView', uuid: string };

export type UserReportSummaryFragment = { __typename?: 'UserReportEntityView', content?: string | null, userReportType: UserReportType, createdDate?: any | null, uuid: string };

export type UserReportDetailFragment = { __typename?: 'UserReportEntityView', content?: string | null, userReportType: UserReportType, createdDate?: any | null, uuid: string, reporter: { __typename?: 'UserEntityView', name?: string | null, profileImage?: string | null, profileImageUrl?: string | null, uuid: string, accountNumber?: string | null, school?: { __typename?: 'SchoolTypeEntityView', name: string } | null }, reported: { __typename?: 'UserEntityView', name?: string | null, profileImage?: string | null, profileImageUrl?: string | null, uuid: string, accountNumber?: string | null, school?: { __typename?: 'SchoolTypeEntityView', name: string } | null } };

export type RegisterUserReportMutationVariables = Exact<{
  input: UserReportRegisterDtoInput;
}>;


export type RegisterUserReportMutation = { __typename?: 'Mutation', registerUserReport: { __typename?: 'UserReportEntityView', uuid: string } };

export type VoteBaseFragment = { __typename?: 'VoteEntityView', uuid: string };

export type VoteSummaryFragment = { __typename?: 'VoteEntityView', title: string, deadline?: any | null, isDone: boolean, numChoice: number, numParticipant: number, uuid: string };

export type VoteDetailFragment = { __typename?: 'VoteEntityView', title: string, deadline?: any | null, isDone: boolean, numChoice: number, numParticipant: number, uuid: string, contents: Array<{ __typename?: 'VoteItemEntityView', uuid: string, content?: string | null, numVote?: number | null, isVoted?: boolean | null } | null> };

export type EditVoteMutationVariables = Exact<{
  input: VoteEditDtoInput;
}>;


export type EditVoteMutation = { __typename?: 'Mutation', editVote?: { __typename?: 'VoteEntityView', uuid: string } | null };

export type CategoriesQueryVariables = Exact<{
  parentUuid?: InputMaybe<Scalars['String']>;
  schoolTypeUuid?: InputMaybe<Scalars['String']>;
}>;


export type CategoriesQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'CategoryRefViewDto', uuid: string, name?: string | null, code?: string | null, isScraped?: boolean | null }> };

export const AnnounceBaseFragmentDoc = gql`
    fragment AnnounceBase on AnnounceResponse {
  announceType
  company
  content
  createdBy
  createdDate
  entityStatus
  imageUrl
  labKeywords {
    code
    name
    uuid
  }
  totiKeywords {
    code
    name
    uuid
  }
  lastModifiedBy
  lastModifiedDate
  title
  uuid
}
    `;
export const BannerBaseFragmentDoc = gql`
    fragment BannerBase on BannerViewDto {
  uuid
}
    `;
export const BannerSummaryFragmentDoc = gql`
    fragment BannerSummary on BannerViewDto {
  ...BannerBase
  title
  description
  imageUrl
  action
  actionValue
  backgroundColor
  indexBackgroundColor
  indexColor
  indexStrokeColor
}
    ${BannerBaseFragmentDoc}`;
export const BannerDetailFragmentDoc = gql`
    fragment BannerDetail on BannerViewDto {
  ...BannerSummary
}
    ${BannerSummaryFragmentDoc}`;
export const BoardBaseFragmentDoc = gql`
    fragment BoardBase on BoardEntityView {
  uuid
}
    `;
export const BoardSummaryFragmentDoc = gql`
    fragment BoardSummary on BoardEntityView {
  ...BoardBase
  title
  version
  createdDate
  elapsedCreatedDate
  likeCount
  bookmarkCount
  reviewCount
  isAnonymous
  content
  files {
    file {
      url
    }
  }
  user {
    uuid
    name
    school {
      name
    }
    schoolVerificationStatus
  }
  category {
    uuid
    name
  }
}
    ${BoardBaseFragmentDoc}`;
export const VoteBaseFragmentDoc = gql`
    fragment VoteBase on VoteEntityView {
  uuid
}
    `;
export const VoteSummaryFragmentDoc = gql`
    fragment VoteSummary on VoteEntityView {
  ...VoteBase
  title
  deadline
  isDone
  numChoice
  numParticipant
}
    ${VoteBaseFragmentDoc}`;
export const VoteDetailFragmentDoc = gql`
    fragment VoteDetail on VoteEntityView {
  ...VoteSummary
  contents {
    uuid
    content
    numVote
    isVoted
  }
}
    ${VoteSummaryFragmentDoc}`;
export const BoardDetailFragmentDoc = gql`
    fragment BoardDetail on BoardEntityView {
  ...BoardSummary
  content
  vote {
    ...VoteDetail
  }
  files {
    uuid
    displayOrder
    file {
      url
    }
  }
  category {
    uuid
    code
    name
  }
  isBookmarkedByMe
  isLikedByMe
}
    ${BoardSummaryFragmentDoc}
${VoteDetailFragmentDoc}`;
export const FaGroupBaseFragmentDoc = gql`
    fragment FAGroupBase on FAGroupViewDto {
  uuid
  code
}
    `;
export const FaGroupSummaryFragmentDoc = gql`
    fragment FAGroupSummary on FAGroupViewDto {
  ...FAGroupBase
  name
  description
  iconUrl
  subGroupType
  writable
}
    ${FaGroupBaseFragmentDoc}`;
export const FaGroupDetailFragmentDoc = gql`
    fragment FAGroupDetail on FAGroupViewDto {
  ...FAGroupSummary
}
    ${FaGroupSummaryFragmentDoc}`;
export const MeSummaryFragmentDoc = gql`
    fragment MeSummary on UserEntityView {
  uuid
  accountNumber
  email
  name
  realName
  provider
  profileImage
  profileImageUrl
  school {
    name
    uuid
  }
  schoolVerificationStatus
  studentType
  isAdmin
}
    `;
export const NoticeBaseFragmentDoc = gql`
    fragment NoticeBase on NoticeEntityView {
  uuid
}
    `;
export const NoticeDataFragmentDoc = gql`
    fragment NoticeData on NoticeEntityView {
  ...NoticeBase
  content
  createdDate
  createdUserId
  elapsedCreatedDate
  entityStatus
  isLikedByMe
  likeCount
  title
}
    ${NoticeBaseFragmentDoc}`;
export const ReviewBaseFragmentDoc = gql`
    fragment ReviewBase on ReviewViewDto {
  uuid
}
    `;
export const ReviewSummaryFragmentDoc = gql`
    fragment ReviewSummary on ReviewViewDto {
  ...ReviewBase
  content
  isAnonymous
  isLikedByMe
  likeCount
  entityStatus
  createdDate
  user {
    uuid
    name
    profileImage
    profileImageUrl
    schoolName
    schoolVerificationStatus
    school {
      name
    }
  }
  parentEntityType
  parentEntityUuid
  parentReviewUuid
  childReviews {
    ...ReviewBase
    content
    isAnonymous
    isLikedByMe
    likeCount
    entityStatus
    createdDate
    parentEntityType
    parentEntityUuid
    parentReviewUuid
    user {
      uuid
      name
      profileImage
      profileImageUrl
      schoolVerificationStatus
      schoolName
      school {
        name
      }
    }
  }
}
    ${ReviewBaseFragmentDoc}`;
export const ReviewDetailFragmentDoc = gql`
    fragment ReviewDetail on ReviewViewDto {
  ...ReviewSummary
}
    ${ReviewSummaryFragmentDoc}`;
export const RoomBaseFragmentDoc = gql`
    fragment RoomBase on RoomEntityView {
  uuid
}
    `;
export const UserMessageBaseFragmentDoc = gql`
    fragment UserMessageBase on UserMessageEntityView {
  uuid
}
    `;
export const UserMessageSummaryFragmentDoc = gql`
    fragment UserMessageSummary on UserMessageEntityView {
  ...UserMessageBase
  message
  isRead
  anonymous
  createdDate
  room {
    uuid
  }
  sender {
    uuid
    accountNumber
    provider
    name
    profileImage
    profileImageUrl
    school {
      code
      name
      region
      uuid
    }
  }
}
    ${UserMessageBaseFragmentDoc}`;
export const RoomSummaryFragmentDoc = gql`
    fragment RoomSummary on RoomEntityView {
  ...RoomBase
  isAnonymous
  partner {
    uuid
    accountNumber
    name
    profileImage
    profileImageUrl
    school {
      name
    }
  }
  lastMessage {
    ...UserMessageSummary
  }
}
    ${RoomBaseFragmentDoc}
${UserMessageSummaryFragmentDoc}`;
export const RoomDetailFragmentDoc = gql`
    fragment RoomDetail on RoomEntityView {
  ...RoomSummary
}
    ${RoomSummaryFragmentDoc}`;
export const BaseSchoolCourseFragmentDoc = gql`
    fragment BaseSchoolCourse on SchoolCourseEntityView {
  academyYear
  categoryRefSchoolCourses {
    createdDate
    elapsedCreatedDate
    entityStatus
    leaf
    scraped
    uuid
  }
  code
  createdDate
  dayAndTimeRanges {
    dayOfWeek
    timeRange {
      fromTime
      toTime
    }
  }
  divisionCode
  elapsedCreatedDate
  engSubjectName
  entityStatus
  extras
  grade
  isClosed
  kindsCode
  kindsName
  numBooking
  planUrl
  practiceDivisionCode
  professors
  roomName
  semester
  studentYear
  subDescription
  subjectName
  time
  userReports {
    uuid
  }
  uuid
}
    `;
export const TimeTableBaseFragmentDoc = gql`
    fragment TimeTableBase on TimeTableEntityView {
  customCourses {
    dayAndTimeRanges: dayAndTimeRanges {
      dayOfWeek
      timeRange {
        fromTime
        toTime
      }
    }
    entityStatus
    professors
    subjectName
    timeTableUuid
    uuid
  }
  entityStatus
  isFavorite
  name
  schoolCourses {
    academyYear
    categoryRefSchoolCourses {
      entityStatus
      leaf
      scraped
      uuid
    }
    code
    dayAndTimeRanges {
      dayOfWeek
      timeRange {
        fromTime
        toTime
      }
    }
    divisionCode
    engSubjectName
    entityStatus
    grade
    kindsCode
    kindsName
    numBooking
    practiceDivisionCode
    professors
    roomName
    semester
    studentYear
    subDescription
    subjectName
    time
    uuid
  }
  semester
  uuid
  year
  yearAndSemesterName
}
    `;
export const UserBaseFragmentDoc = gql`
    fragment UserBase on UserEntityView {
  uuid
  accountNumber
}
    `;
export const UserSummaryFragmentDoc = gql`
    fragment UserSummary on UserEntityView {
  ...UserBase
  name
  profileImage
  profileImageUrl
  school {
    name
  }
}
    ${UserBaseFragmentDoc}`;
export const UserDetailFragmentDoc = gql`
    fragment UserDetail on UserEntityView {
  ...UserSummary
}
    ${UserSummaryFragmentDoc}`;
export const UserMessageDetailFragmentDoc = gql`
    fragment UserMessageDetail on UserMessageEntityView {
  ...UserMessageSummary
}
    ${UserMessageSummaryFragmentDoc}`;
export const UserNotificationBaseFragmentDoc = gql`
    fragment UserNotificationBase on UserNotificationViewDto {
  uuid
}
    `;
export const NotificationBaseFragmentDoc = gql`
    fragment NotificationBase on NotificationViewDto {
  uuid
}
    `;
export const NotificationSummaryFragmentDoc = gql`
    fragment NotificationSummary on NotificationViewDto {
  ...NotificationBase
  title
  actionUrl
  iconUrl
}
    ${NotificationBaseFragmentDoc}`;
export const NotificationDetailFragmentDoc = gql`
    fragment NotificationDetail on NotificationViewDto {
  ...NotificationSummary
  content
}
    ${NotificationSummaryFragmentDoc}`;
export const UserNotificationSummaryFragmentDoc = gql`
    fragment UserNotificationSummary on UserNotificationViewDto {
  ...UserNotificationBase
  isRead
  createdDate
  elapsedCreatedDate
  notification {
    ...NotificationDetail
  }
}
    ${UserNotificationBaseFragmentDoc}
${NotificationDetailFragmentDoc}`;
export const UserNotificationDetailFragmentDoc = gql`
    fragment UserNotificationDetail on UserNotificationViewDto {
  ...UserNotificationSummary
}
    ${UserNotificationSummaryFragmentDoc}`;
export const UserReportBaseFragmentDoc = gql`
    fragment UserReportBase on UserReportEntityView {
  uuid
}
    `;
export const UserReportSummaryFragmentDoc = gql`
    fragment UserReportSummary on UserReportEntityView {
  ...UserReportBase
  content
  userReportType
  createdDate
}
    ${UserReportBaseFragmentDoc}`;
export const UserReportDetailFragmentDoc = gql`
    fragment UserReportDetail on UserReportEntityView {
  ...UserReportSummary
  reporter {
    ...UserSummary
  }
  reported {
    ...UserSummary
  }
}
    ${UserReportSummaryFragmentDoc}
${UserSummaryFragmentDoc}`;
export const NewAlarmCountDocument = gql`
    query NewAlarmCount {
  userNotificationCount
  unreadMessageCount
}
    `;

/**
 * __useNewAlarmCountQuery__
 *
 * To run a query within a React component, call `useNewAlarmCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useNewAlarmCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewAlarmCountQuery({
 *   variables: {
 *   },
 * });
 */
export function useNewAlarmCountQuery(baseOptions?: Apollo.QueryHookOptions<NewAlarmCountQuery, NewAlarmCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NewAlarmCountQuery, NewAlarmCountQueryVariables>(NewAlarmCountDocument, options);
      }
export function useNewAlarmCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NewAlarmCountQuery, NewAlarmCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NewAlarmCountQuery, NewAlarmCountQueryVariables>(NewAlarmCountDocument, options);
        }
export type NewAlarmCountQueryHookResult = ReturnType<typeof useNewAlarmCountQuery>;
export type NewAlarmCountLazyQueryHookResult = ReturnType<typeof useNewAlarmCountLazyQuery>;
export type NewAlarmCountQueryResult = Apollo.QueryResult<NewAlarmCountQuery, NewAlarmCountQueryVariables>;
export const AnnouncesDocument = gql`
    query Announces($input: AnnounceFetchDtoInput!) {
  announcesByCursor(fetchDto: $input) {
    cursor
    page
    totalCount
    data {
      ...AnnounceBase
    }
  }
}
    ${AnnounceBaseFragmentDoc}`;

/**
 * __useAnnouncesQuery__
 *
 * To run a query within a React component, call `useAnnouncesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAnnouncesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAnnouncesQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAnnouncesQuery(baseOptions: Apollo.QueryHookOptions<AnnouncesQuery, AnnouncesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AnnouncesQuery, AnnouncesQueryVariables>(AnnouncesDocument, options);
      }
export function useAnnouncesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AnnouncesQuery, AnnouncesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AnnouncesQuery, AnnouncesQueryVariables>(AnnouncesDocument, options);
        }
export type AnnouncesQueryHookResult = ReturnType<typeof useAnnouncesQuery>;
export type AnnouncesLazyQueryHookResult = ReturnType<typeof useAnnouncesLazyQuery>;
export type AnnouncesQueryResult = Apollo.QueryResult<AnnouncesQuery, AnnouncesQueryVariables>;
export const BannersDocument = gql`
    query Banners {
  banners {
    ...BannerSummary
  }
}
    ${BannerSummaryFragmentDoc}`;

/**
 * __useBannersQuery__
 *
 * To run a query within a React component, call `useBannersQuery` and pass it any options that fit your needs.
 * When your component renders, `useBannersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBannersQuery({
 *   variables: {
 *   },
 * });
 */
export function useBannersQuery(baseOptions?: Apollo.QueryHookOptions<BannersQuery, BannersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BannersQuery, BannersQueryVariables>(BannersDocument, options);
      }
export function useBannersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BannersQuery, BannersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BannersQuery, BannersQueryVariables>(BannersDocument, options);
        }
export type BannersQueryHookResult = ReturnType<typeof useBannersQuery>;
export type BannersLazyQueryHookResult = ReturnType<typeof useBannersLazyQuery>;
export type BannersQueryResult = Apollo.QueryResult<BannersQuery, BannersQueryVariables>;
export const RegisterBlockInteractionDocument = gql`
    mutation registerBlockInteraction($registerDto: BlockInteractionRegisterDtoInput!) {
  registerBlockInteraction(registerDto: $registerDto)
}
    `;
export type RegisterBlockInteractionMutationFn = Apollo.MutationFunction<RegisterBlockInteractionMutation, RegisterBlockInteractionMutationVariables>;

/**
 * __useRegisterBlockInteractionMutation__
 *
 * To run a mutation, you first call `useRegisterBlockInteractionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterBlockInteractionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerBlockInteractionMutation, { data, loading, error }] = useRegisterBlockInteractionMutation({
 *   variables: {
 *      registerDto: // value for 'registerDto'
 *   },
 * });
 */
export function useRegisterBlockInteractionMutation(baseOptions?: Apollo.MutationHookOptions<RegisterBlockInteractionMutation, RegisterBlockInteractionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterBlockInteractionMutation, RegisterBlockInteractionMutationVariables>(RegisterBlockInteractionDocument, options);
      }
export type RegisterBlockInteractionMutationHookResult = ReturnType<typeof useRegisterBlockInteractionMutation>;
export type RegisterBlockInteractionMutationResult = Apollo.MutationResult<RegisterBlockInteractionMutation>;
export type RegisterBlockInteractionMutationOptions = Apollo.BaseMutationOptions<RegisterBlockInteractionMutation, RegisterBlockInteractionMutationVariables>;
export const RegisterBoardDocument = gql`
    mutation RegisterBoard($input: BoardRegisterDtoInput!) {
  registerBoard(registerDto: $input) {
    ...BoardBase
  }
}
    ${BoardBaseFragmentDoc}`;
export type RegisterBoardMutationFn = Apollo.MutationFunction<RegisterBoardMutation, RegisterBoardMutationVariables>;

/**
 * __useRegisterBoardMutation__
 *
 * To run a mutation, you first call `useRegisterBoardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterBoardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerBoardMutation, { data, loading, error }] = useRegisterBoardMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterBoardMutation(baseOptions?: Apollo.MutationHookOptions<RegisterBoardMutation, RegisterBoardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterBoardMutation, RegisterBoardMutationVariables>(RegisterBoardDocument, options);
      }
export type RegisterBoardMutationHookResult = ReturnType<typeof useRegisterBoardMutation>;
export type RegisterBoardMutationResult = Apollo.MutationResult<RegisterBoardMutation>;
export type RegisterBoardMutationOptions = Apollo.BaseMutationOptions<RegisterBoardMutation, RegisterBoardMutationVariables>;
export const EditBoardDocument = gql`
    mutation EditBoard($input: BoardEditDtoInput!) {
  editBoard(editDto: $input) {
    ...BoardBase
  }
}
    ${BoardBaseFragmentDoc}`;
export type EditBoardMutationFn = Apollo.MutationFunction<EditBoardMutation, EditBoardMutationVariables>;

/**
 * __useEditBoardMutation__
 *
 * To run a mutation, you first call `useEditBoardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditBoardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editBoardMutation, { data, loading, error }] = useEditBoardMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditBoardMutation(baseOptions?: Apollo.MutationHookOptions<EditBoardMutation, EditBoardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditBoardMutation, EditBoardMutationVariables>(EditBoardDocument, options);
      }
export type EditBoardMutationHookResult = ReturnType<typeof useEditBoardMutation>;
export type EditBoardMutationResult = Apollo.MutationResult<EditBoardMutation>;
export type EditBoardMutationOptions = Apollo.BaseMutationOptions<EditBoardMutation, EditBoardMutationVariables>;
export const DeleteBoardDocument = gql`
    mutation DeleteBoard($uuid: String!) {
  deleteBoard(uuid: $uuid)
}
    `;
export type DeleteBoardMutationFn = Apollo.MutationFunction<DeleteBoardMutation, DeleteBoardMutationVariables>;

/**
 * __useDeleteBoardMutation__
 *
 * To run a mutation, you first call `useDeleteBoardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBoardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBoardMutation, { data, loading, error }] = useDeleteBoardMutation({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useDeleteBoardMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBoardMutation, DeleteBoardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBoardMutation, DeleteBoardMutationVariables>(DeleteBoardDocument, options);
      }
export type DeleteBoardMutationHookResult = ReturnType<typeof useDeleteBoardMutation>;
export type DeleteBoardMutationResult = Apollo.MutationResult<DeleteBoardMutation>;
export type DeleteBoardMutationOptions = Apollo.BaseMutationOptions<DeleteBoardMutation, DeleteBoardMutationVariables>;
export const HomeBoardsDocument = gql`
    query HomeBoards($uuidFree: String, $uuidSecret: String) {
  boardsByCursorFree: boardsByCursor(
    fetchDto: {groupUuid: $uuidFree, paginationRequestDto: {count: 5}}
  ) {
    data {
      ...BoardSummary
    }
  }
  boardsByCursorSecret: boardsByCursor(
    fetchDto: {groupUuid: $uuidSecret, paginationRequestDto: {count: 5}}
  ) {
    data {
      ...BoardSummary
    }
  }
  infoBoardsByCursor: infoBoardsByCursor(
    fetchDto: {paginationRequestDto: {count: 5}}
  ) {
    data {
      ...BoardSummary
    }
  }
}
    ${BoardSummaryFragmentDoc}`;

/**
 * __useHomeBoardsQuery__
 *
 * To run a query within a React component, call `useHomeBoardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useHomeBoardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHomeBoardsQuery({
 *   variables: {
 *      uuidFree: // value for 'uuidFree'
 *      uuidSecret: // value for 'uuidSecret'
 *   },
 * });
 */
export function useHomeBoardsQuery(baseOptions?: Apollo.QueryHookOptions<HomeBoardsQuery, HomeBoardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HomeBoardsQuery, HomeBoardsQueryVariables>(HomeBoardsDocument, options);
      }
export function useHomeBoardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HomeBoardsQuery, HomeBoardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HomeBoardsQuery, HomeBoardsQueryVariables>(HomeBoardsDocument, options);
        }
export type HomeBoardsQueryHookResult = ReturnType<typeof useHomeBoardsQuery>;
export type HomeBoardsLazyQueryHookResult = ReturnType<typeof useHomeBoardsLazyQuery>;
export type HomeBoardsQueryResult = Apollo.QueryResult<HomeBoardsQuery, HomeBoardsQueryVariables>;
export const BoardDocument = gql`
    query Board($uuid: String!) {
  board(uuid: $uuid) {
    ...BoardDetail
  }
}
    ${BoardDetailFragmentDoc}`;

/**
 * __useBoardQuery__
 *
 * To run a query within a React component, call `useBoardQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardQuery({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useBoardQuery(baseOptions: Apollo.QueryHookOptions<BoardQuery, BoardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BoardQuery, BoardQueryVariables>(BoardDocument, options);
      }
export function useBoardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BoardQuery, BoardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BoardQuery, BoardQueryVariables>(BoardDocument, options);
        }
export type BoardQueryHookResult = ReturnType<typeof useBoardQuery>;
export type BoardLazyQueryHookResult = ReturnType<typeof useBoardLazyQuery>;
export type BoardQueryResult = Apollo.QueryResult<BoardQuery, BoardQueryVariables>;
export const BoardMyDocument = gql`
    query BoardMy($uuid: String!) {
  board(uuid: $uuid) {
    ...BoardBase
    likeCount
    bookmarkCount
    isBookmarkedByMe
    isLikedByMe
    vote {
      ...VoteDetail
    }
  }
}
    ${BoardBaseFragmentDoc}
${VoteDetailFragmentDoc}`;

/**
 * __useBoardMyQuery__
 *
 * To run a query within a React component, call `useBoardMyQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardMyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardMyQuery({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useBoardMyQuery(baseOptions: Apollo.QueryHookOptions<BoardMyQuery, BoardMyQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BoardMyQuery, BoardMyQueryVariables>(BoardMyDocument, options);
      }
export function useBoardMyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BoardMyQuery, BoardMyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BoardMyQuery, BoardMyQueryVariables>(BoardMyDocument, options);
        }
export type BoardMyQueryHookResult = ReturnType<typeof useBoardMyQuery>;
export type BoardMyLazyQueryHookResult = ReturnType<typeof useBoardMyLazyQuery>;
export type BoardMyQueryResult = Apollo.QueryResult<BoardMyQuery, BoardMyQueryVariables>;
export const BoardsDocument = gql`
    query Boards($input: BoardFetchDtoInput!) {
  boardsByCursor(fetchDto: $input) {
    cursor
    page
    totalCount
    data {
      ...BoardSummary
    }
  }
}
    ${BoardSummaryFragmentDoc}`;

/**
 * __useBoardsQuery__
 *
 * To run a query within a React component, call `useBoardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useBoardsQuery(baseOptions: Apollo.QueryHookOptions<BoardsQuery, BoardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BoardsQuery, BoardsQueryVariables>(BoardsDocument, options);
      }
export function useBoardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BoardsQuery, BoardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BoardsQuery, BoardsQueryVariables>(BoardsDocument, options);
        }
export type BoardsQueryHookResult = ReturnType<typeof useBoardsQuery>;
export type BoardsLazyQueryHookResult = ReturnType<typeof useBoardsLazyQuery>;
export type BoardsQueryResult = Apollo.QueryResult<BoardsQuery, BoardsQueryVariables>;
export const BoardsDetailDocument = gql`
    query BoardsDetail($input: BoardFetchDtoInput!) {
  boardsByCursor(fetchDto: $input) {
    cursor
    page
    totalCount
    data {
      ...BoardDetail
    }
  }
}
    ${BoardDetailFragmentDoc}`;

/**
 * __useBoardsDetailQuery__
 *
 * To run a query within a React component, call `useBoardsDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardsDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardsDetailQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useBoardsDetailQuery(baseOptions: Apollo.QueryHookOptions<BoardsDetailQuery, BoardsDetailQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BoardsDetailQuery, BoardsDetailQueryVariables>(BoardsDetailDocument, options);
      }
export function useBoardsDetailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BoardsDetailQuery, BoardsDetailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BoardsDetailQuery, BoardsDetailQueryVariables>(BoardsDetailDocument, options);
        }
export type BoardsDetailQueryHookResult = ReturnType<typeof useBoardsDetailQuery>;
export type BoardsDetailLazyQueryHookResult = ReturnType<typeof useBoardsDetailLazyQuery>;
export type BoardsDetailQueryResult = Apollo.QueryResult<BoardsDetailQuery, BoardsDetailQueryVariables>;
export const FaGroupsDocument = gql`
    query FAGroups {
  FAGroups {
    ...FAGroupSummary
  }
}
    ${FaGroupSummaryFragmentDoc}`;

/**
 * __useFaGroupsQuery__
 *
 * To run a query within a React component, call `useFaGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFaGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFaGroupsQuery({
 *   variables: {
 *   },
 * });
 */
export function useFaGroupsQuery(baseOptions?: Apollo.QueryHookOptions<FaGroupsQuery, FaGroupsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FaGroupsQuery, FaGroupsQueryVariables>(FaGroupsDocument, options);
      }
export function useFaGroupsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FaGroupsQuery, FaGroupsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FaGroupsQuery, FaGroupsQueryVariables>(FaGroupsDocument, options);
        }
export type FaGroupsQueryHookResult = ReturnType<typeof useFaGroupsQuery>;
export type FaGroupsLazyQueryHookResult = ReturnType<typeof useFaGroupsLazyQuery>;
export type FaGroupsQueryResult = Apollo.QueryResult<FaGroupsQuery, FaGroupsQueryVariables>;
export const HomeDataDocument = gql`
    query HomeData {
  banners {
    ...BannerSummary
    action
    actionValue
    description
    imageUrl
    indexColor
    indexBackgroundColor
    indexStrokeColor
    uuid
    createdDate
    title
  }
}
    ${BannerSummaryFragmentDoc}`;

/**
 * __useHomeDataQuery__
 *
 * To run a query within a React component, call `useHomeDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useHomeDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHomeDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useHomeDataQuery(baseOptions?: Apollo.QueryHookOptions<HomeDataQuery, HomeDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HomeDataQuery, HomeDataQueryVariables>(HomeDataDocument, options);
      }
export function useHomeDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HomeDataQuery, HomeDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HomeDataQuery, HomeDataQueryVariables>(HomeDataDocument, options);
        }
export type HomeDataQueryHookResult = ReturnType<typeof useHomeDataQuery>;
export type HomeDataLazyQueryHookResult = ReturnType<typeof useHomeDataLazyQuery>;
export type HomeDataQueryResult = Apollo.QueryResult<HomeDataQuery, HomeDataQueryVariables>;
export const SendVerificationCodeDocument = gql`
    mutation SendVerificationCode($email: String!) {
  sendVerificationCode(email: $email) {
    uuid
    verifiedAt
    expiredAt
  }
}
    `;
export type SendVerificationCodeMutationFn = Apollo.MutationFunction<SendVerificationCodeMutation, SendVerificationCodeMutationVariables>;

/**
 * __useSendVerificationCodeMutation__
 *
 * To run a mutation, you first call `useSendVerificationCodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendVerificationCodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendVerificationCodeMutation, { data, loading, error }] = useSendVerificationCodeMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useSendVerificationCodeMutation(baseOptions?: Apollo.MutationHookOptions<SendVerificationCodeMutation, SendVerificationCodeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendVerificationCodeMutation, SendVerificationCodeMutationVariables>(SendVerificationCodeDocument, options);
      }
export type SendVerificationCodeMutationHookResult = ReturnType<typeof useSendVerificationCodeMutation>;
export type SendVerificationCodeMutationResult = Apollo.MutationResult<SendVerificationCodeMutation>;
export type SendVerificationCodeMutationOptions = Apollo.BaseMutationOptions<SendVerificationCodeMutation, SendVerificationCodeMutationVariables>;
export const VerifyCodeDocument = gql`
    mutation verifyCode($email: String!, $code: String!) {
  verifyCode(email: $email, code: $code) {
    uuid
    email
    verifiedAt
    expiredAt
  }
}
    `;
export type VerifyCodeMutationFn = Apollo.MutationFunction<VerifyCodeMutation, VerifyCodeMutationVariables>;

/**
 * __useVerifyCodeMutation__
 *
 * To run a mutation, you first call `useVerifyCodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyCodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyCodeMutation, { data, loading, error }] = useVerifyCodeMutation({
 *   variables: {
 *      email: // value for 'email'
 *      code: // value for 'code'
 *   },
 * });
 */
export function useVerifyCodeMutation(baseOptions?: Apollo.MutationHookOptions<VerifyCodeMutation, VerifyCodeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifyCodeMutation, VerifyCodeMutationVariables>(VerifyCodeDocument, options);
      }
export type VerifyCodeMutationHookResult = ReturnType<typeof useVerifyCodeMutation>;
export type VerifyCodeMutationResult = Apollo.MutationResult<VerifyCodeMutation>;
export type VerifyCodeMutationOptions = Apollo.BaseMutationOptions<VerifyCodeMutation, VerifyCodeMutationVariables>;
export const SendResetPasswordEmailDocument = gql`
    mutation SendResetPasswordEmail($email: String!, $name: String!) {
  sendResetPasswordEmail(email: $email, name: $name)
}
    `;
export type SendResetPasswordEmailMutationFn = Apollo.MutationFunction<SendResetPasswordEmailMutation, SendResetPasswordEmailMutationVariables>;

/**
 * __useSendResetPasswordEmailMutation__
 *
 * To run a mutation, you first call `useSendResetPasswordEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendResetPasswordEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendResetPasswordEmailMutation, { data, loading, error }] = useSendResetPasswordEmailMutation({
 *   variables: {
 *      email: // value for 'email'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useSendResetPasswordEmailMutation(baseOptions?: Apollo.MutationHookOptions<SendResetPasswordEmailMutation, SendResetPasswordEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendResetPasswordEmailMutation, SendResetPasswordEmailMutationVariables>(SendResetPasswordEmailDocument, options);
      }
export type SendResetPasswordEmailMutationHookResult = ReturnType<typeof useSendResetPasswordEmailMutation>;
export type SendResetPasswordEmailMutationResult = Apollo.MutationResult<SendResetPasswordEmailMutation>;
export type SendResetPasswordEmailMutationOptions = Apollo.BaseMutationOptions<SendResetPasswordEmailMutation, SendResetPasswordEmailMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...MeSummary
  }
}
    ${MeSummaryFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const RegisterNoticeDocument = gql`
    mutation RegisterNotice($input: NoticeRegisterDtoInput!) {
  registerNotice(registerDto: $input) {
    ...NoticeBase
  }
}
    ${NoticeBaseFragmentDoc}`;
export type RegisterNoticeMutationFn = Apollo.MutationFunction<RegisterNoticeMutation, RegisterNoticeMutationVariables>;

/**
 * __useRegisterNoticeMutation__
 *
 * To run a mutation, you first call `useRegisterNoticeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterNoticeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerNoticeMutation, { data, loading, error }] = useRegisterNoticeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterNoticeMutation(baseOptions?: Apollo.MutationHookOptions<RegisterNoticeMutation, RegisterNoticeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterNoticeMutation, RegisterNoticeMutationVariables>(RegisterNoticeDocument, options);
      }
export type RegisterNoticeMutationHookResult = ReturnType<typeof useRegisterNoticeMutation>;
export type RegisterNoticeMutationResult = Apollo.MutationResult<RegisterNoticeMutation>;
export type RegisterNoticeMutationOptions = Apollo.BaseMutationOptions<RegisterNoticeMutation, RegisterNoticeMutationVariables>;
export const EditNoticeDocument = gql`
    mutation EditNotice($input: NoticeEditDtoInput!) {
  editNotice(editDto: $input) {
    ...NoticeBase
  }
}
    ${NoticeBaseFragmentDoc}`;
export type EditNoticeMutationFn = Apollo.MutationFunction<EditNoticeMutation, EditNoticeMutationVariables>;

/**
 * __useEditNoticeMutation__
 *
 * To run a mutation, you first call `useEditNoticeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditNoticeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editNoticeMutation, { data, loading, error }] = useEditNoticeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditNoticeMutation(baseOptions?: Apollo.MutationHookOptions<EditNoticeMutation, EditNoticeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditNoticeMutation, EditNoticeMutationVariables>(EditNoticeDocument, options);
      }
export type EditNoticeMutationHookResult = ReturnType<typeof useEditNoticeMutation>;
export type EditNoticeMutationResult = Apollo.MutationResult<EditNoticeMutation>;
export type EditNoticeMutationOptions = Apollo.BaseMutationOptions<EditNoticeMutation, EditNoticeMutationVariables>;
export const DeleteNoticeDocument = gql`
    mutation DeleteNotice($uuid: String) {
  deleteNotice(uuid: $uuid)
}
    `;
export type DeleteNoticeMutationFn = Apollo.MutationFunction<DeleteNoticeMutation, DeleteNoticeMutationVariables>;

/**
 * __useDeleteNoticeMutation__
 *
 * To run a mutation, you first call `useDeleteNoticeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteNoticeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteNoticeMutation, { data, loading, error }] = useDeleteNoticeMutation({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useDeleteNoticeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteNoticeMutation, DeleteNoticeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteNoticeMutation, DeleteNoticeMutationVariables>(DeleteNoticeDocument, options);
      }
export type DeleteNoticeMutationHookResult = ReturnType<typeof useDeleteNoticeMutation>;
export type DeleteNoticeMutationResult = Apollo.MutationResult<DeleteNoticeMutation>;
export type DeleteNoticeMutationOptions = Apollo.BaseMutationOptions<DeleteNoticeMutation, DeleteNoticeMutationVariables>;
export const NoticeDocument = gql`
    query Notice($uuid: String) {
  notice(uuid: $uuid) {
    ...NoticeData
  }
}
    ${NoticeDataFragmentDoc}`;

/**
 * __useNoticeQuery__
 *
 * To run a query within a React component, call `useNoticeQuery` and pass it any options that fit your needs.
 * When your component renders, `useNoticeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNoticeQuery({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useNoticeQuery(baseOptions?: Apollo.QueryHookOptions<NoticeQuery, NoticeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NoticeQuery, NoticeQueryVariables>(NoticeDocument, options);
      }
export function useNoticeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NoticeQuery, NoticeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NoticeQuery, NoticeQueryVariables>(NoticeDocument, options);
        }
export type NoticeQueryHookResult = ReturnType<typeof useNoticeQuery>;
export type NoticeLazyQueryHookResult = ReturnType<typeof useNoticeLazyQuery>;
export type NoticeQueryResult = Apollo.QueryResult<NoticeQuery, NoticeQueryVariables>;
export const NoticesListDocument = gql`
    query NoticesList($input: NoticeFetchDtoInput) {
  noticesByCursor(fetchDto: $input) {
    cursor
    totalCount
    data {
      ...NoticeData
    }
    page
  }
}
    ${NoticeDataFragmentDoc}`;

/**
 * __useNoticesListQuery__
 *
 * To run a query within a React component, call `useNoticesListQuery` and pass it any options that fit your needs.
 * When your component renders, `useNoticesListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNoticesListQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useNoticesListQuery(baseOptions?: Apollo.QueryHookOptions<NoticesListQuery, NoticesListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NoticesListQuery, NoticesListQueryVariables>(NoticesListDocument, options);
      }
export function useNoticesListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NoticesListQuery, NoticesListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NoticesListQuery, NoticesListQueryVariables>(NoticesListDocument, options);
        }
export type NoticesListQueryHookResult = ReturnType<typeof useNoticesListQuery>;
export type NoticesListLazyQueryHookResult = ReturnType<typeof useNoticesListLazyQuery>;
export type NoticesListQueryResult = Apollo.QueryResult<NoticesListQuery, NoticesListQueryVariables>;
export const RegisterReviewDocument = gql`
    mutation RegisterReview($input: ReviewRegisterDtoInput!) {
  registerReview(registerDto: $input) {
    ...ReviewBase
  }
}
    ${ReviewBaseFragmentDoc}`;
export type RegisterReviewMutationFn = Apollo.MutationFunction<RegisterReviewMutation, RegisterReviewMutationVariables>;

/**
 * __useRegisterReviewMutation__
 *
 * To run a mutation, you first call `useRegisterReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerReviewMutation, { data, loading, error }] = useRegisterReviewMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterReviewMutation(baseOptions?: Apollo.MutationHookOptions<RegisterReviewMutation, RegisterReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterReviewMutation, RegisterReviewMutationVariables>(RegisterReviewDocument, options);
      }
export type RegisterReviewMutationHookResult = ReturnType<typeof useRegisterReviewMutation>;
export type RegisterReviewMutationResult = Apollo.MutationResult<RegisterReviewMutation>;
export type RegisterReviewMutationOptions = Apollo.BaseMutationOptions<RegisterReviewMutation, RegisterReviewMutationVariables>;
export const EditReviewDocument = gql`
    mutation EditReview($input: ReviewEditDtoInput!) {
  editReview(editDto: $input) {
    ...ReviewBase
  }
}
    ${ReviewBaseFragmentDoc}`;
export type EditReviewMutationFn = Apollo.MutationFunction<EditReviewMutation, EditReviewMutationVariables>;

/**
 * __useEditReviewMutation__
 *
 * To run a mutation, you first call `useEditReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editReviewMutation, { data, loading, error }] = useEditReviewMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditReviewMutation(baseOptions?: Apollo.MutationHookOptions<EditReviewMutation, EditReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditReviewMutation, EditReviewMutationVariables>(EditReviewDocument, options);
      }
export type EditReviewMutationHookResult = ReturnType<typeof useEditReviewMutation>;
export type EditReviewMutationResult = Apollo.MutationResult<EditReviewMutation>;
export type EditReviewMutationOptions = Apollo.BaseMutationOptions<EditReviewMutation, EditReviewMutationVariables>;
export const DeleteReviewDocument = gql`
    mutation DeleteReview($uuid: String!) {
  deleteReview(reviewUuid: $uuid)
}
    `;
export type DeleteReviewMutationFn = Apollo.MutationFunction<DeleteReviewMutation, DeleteReviewMutationVariables>;

/**
 * __useDeleteReviewMutation__
 *
 * To run a mutation, you first call `useDeleteReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteReviewMutation, { data, loading, error }] = useDeleteReviewMutation({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useDeleteReviewMutation(baseOptions?: Apollo.MutationHookOptions<DeleteReviewMutation, DeleteReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteReviewMutation, DeleteReviewMutationVariables>(DeleteReviewDocument, options);
      }
export type DeleteReviewMutationHookResult = ReturnType<typeof useDeleteReviewMutation>;
export type DeleteReviewMutationResult = Apollo.MutationResult<DeleteReviewMutation>;
export type DeleteReviewMutationOptions = Apollo.BaseMutationOptions<DeleteReviewMutation, DeleteReviewMutationVariables>;
export const ReviewDocument = gql`
    query Review($uuid: String!) {
  review(reviewUuid: $uuid) {
    ...ReviewDetail
  }
}
    ${ReviewDetailFragmentDoc}`;

/**
 * __useReviewQuery__
 *
 * To run a query within a React component, call `useReviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useReviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReviewQuery({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useReviewQuery(baseOptions: Apollo.QueryHookOptions<ReviewQuery, ReviewQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ReviewQuery, ReviewQueryVariables>(ReviewDocument, options);
      }
export function useReviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReviewQuery, ReviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ReviewQuery, ReviewQueryVariables>(ReviewDocument, options);
        }
export type ReviewQueryHookResult = ReturnType<typeof useReviewQuery>;
export type ReviewLazyQueryHookResult = ReturnType<typeof useReviewLazyQuery>;
export type ReviewQueryResult = Apollo.QueryResult<ReviewQuery, ReviewQueryVariables>;
export const ReviewsDocument = gql`
    query Reviews($input: ReviewFetchDtoInput!) {
  reviewsByCursor(fetchDto: $input) {
    cursor
    data {
      ...ReviewSummary
    }
  }
}
    ${ReviewSummaryFragmentDoc}`;

/**
 * __useReviewsQuery__
 *
 * To run a query within a React component, call `useReviewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useReviewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReviewsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useReviewsQuery(baseOptions: Apollo.QueryHookOptions<ReviewsQuery, ReviewsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ReviewsQuery, ReviewsQueryVariables>(ReviewsDocument, options);
      }
export function useReviewsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReviewsQuery, ReviewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ReviewsQuery, ReviewsQueryVariables>(ReviewsDocument, options);
        }
export type ReviewsQueryHookResult = ReturnType<typeof useReviewsQuery>;
export type ReviewsLazyQueryHookResult = ReturnType<typeof useReviewsLazyQuery>;
export type ReviewsQueryResult = Apollo.QueryResult<ReviewsQuery, ReviewsQueryVariables>;
export const RoomDocument = gql`
    query Room($uuid: String!) {
  room(uuid: $uuid) {
    ...RoomDetail
  }
}
    ${RoomDetailFragmentDoc}`;

/**
 * __useRoomQuery__
 *
 * To run a query within a React component, call `useRoomQuery` and pass it any options that fit your needs.
 * When your component renders, `useRoomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRoomQuery({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useRoomQuery(baseOptions: Apollo.QueryHookOptions<RoomQuery, RoomQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RoomQuery, RoomQueryVariables>(RoomDocument, options);
      }
export function useRoomLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RoomQuery, RoomQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RoomQuery, RoomQueryVariables>(RoomDocument, options);
        }
export type RoomQueryHookResult = ReturnType<typeof useRoomQuery>;
export type RoomLazyQueryHookResult = ReturnType<typeof useRoomLazyQuery>;
export type RoomQueryResult = Apollo.QueryResult<RoomQuery, RoomQueryVariables>;
export const RoomsDocument = gql`
    query Rooms($input: RoomFetchDtoInput!) {
  roomsByCursor(fetchDto: $input) {
    cursor
    data {
      ...RoomSummary
    }
  }
}
    ${RoomSummaryFragmentDoc}`;

/**
 * __useRoomsQuery__
 *
 * To run a query within a React component, call `useRoomsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRoomsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRoomsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRoomsQuery(baseOptions: Apollo.QueryHookOptions<RoomsQuery, RoomsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RoomsQuery, RoomsQueryVariables>(RoomsDocument, options);
      }
export function useRoomsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RoomsQuery, RoomsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RoomsQuery, RoomsQueryVariables>(RoomsDocument, options);
        }
export type RoomsQueryHookResult = ReturnType<typeof useRoomsQuery>;
export type RoomsLazyQueryHookResult = ReturnType<typeof useRoomsLazyQuery>;
export type RoomsQueryResult = Apollo.QueryResult<RoomsQuery, RoomsQueryVariables>;
export const SchoolCoursesDocument = gql`
    query SchoolCourses($input: SchoolCourseFetchDtoInput) {
  schoolCoursesByCursor(fetchDto: $input) {
    cursor
    data {
      ...BaseSchoolCourse
    }
    page
    totalCount
  }
}
    ${BaseSchoolCourseFragmentDoc}`;

/**
 * __useSchoolCoursesQuery__
 *
 * To run a query within a React component, call `useSchoolCoursesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSchoolCoursesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSchoolCoursesQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSchoolCoursesQuery(baseOptions?: Apollo.QueryHookOptions<SchoolCoursesQuery, SchoolCoursesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SchoolCoursesQuery, SchoolCoursesQueryVariables>(SchoolCoursesDocument, options);
      }
export function useSchoolCoursesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SchoolCoursesQuery, SchoolCoursesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SchoolCoursesQuery, SchoolCoursesQueryVariables>(SchoolCoursesDocument, options);
        }
export type SchoolCoursesQueryHookResult = ReturnType<typeof useSchoolCoursesQuery>;
export type SchoolCoursesLazyQueryHookResult = ReturnType<typeof useSchoolCoursesLazyQuery>;
export type SchoolCoursesQueryResult = Apollo.QueryResult<SchoolCoursesQuery, SchoolCoursesQueryVariables>;
export const RegisterTimeTableDocument = gql`
    mutation RegisterTimeTable($input: TimeTableRegisterDtoInput) {
  registerTimeTable(registerDto: $input) {
    ...TimeTableBase
  }
}
    ${TimeTableBaseFragmentDoc}`;
export type RegisterTimeTableMutationFn = Apollo.MutationFunction<RegisterTimeTableMutation, RegisterTimeTableMutationVariables>;

/**
 * __useRegisterTimeTableMutation__
 *
 * To run a mutation, you first call `useRegisterTimeTableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterTimeTableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerTimeTableMutation, { data, loading, error }] = useRegisterTimeTableMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterTimeTableMutation(baseOptions?: Apollo.MutationHookOptions<RegisterTimeTableMutation, RegisterTimeTableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterTimeTableMutation, RegisterTimeTableMutationVariables>(RegisterTimeTableDocument, options);
      }
export type RegisterTimeTableMutationHookResult = ReturnType<typeof useRegisterTimeTableMutation>;
export type RegisterTimeTableMutationResult = Apollo.MutationResult<RegisterTimeTableMutation>;
export type RegisterTimeTableMutationOptions = Apollo.BaseMutationOptions<RegisterTimeTableMutation, RegisterTimeTableMutationVariables>;
export const EditTimeTableDocument = gql`
    mutation EditTimeTable($input: TimeTableEditDtoInput) {
  editTimeTable(editDto: $input) {
    ...TimeTableBase
  }
}
    ${TimeTableBaseFragmentDoc}`;
export type EditTimeTableMutationFn = Apollo.MutationFunction<EditTimeTableMutation, EditTimeTableMutationVariables>;

/**
 * __useEditTimeTableMutation__
 *
 * To run a mutation, you first call `useEditTimeTableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditTimeTableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editTimeTableMutation, { data, loading, error }] = useEditTimeTableMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditTimeTableMutation(baseOptions?: Apollo.MutationHookOptions<EditTimeTableMutation, EditTimeTableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditTimeTableMutation, EditTimeTableMutationVariables>(EditTimeTableDocument, options);
      }
export type EditTimeTableMutationHookResult = ReturnType<typeof useEditTimeTableMutation>;
export type EditTimeTableMutationResult = Apollo.MutationResult<EditTimeTableMutation>;
export type EditTimeTableMutationOptions = Apollo.BaseMutationOptions<EditTimeTableMutation, EditTimeTableMutationVariables>;
export const DeleteTimeTableDocument = gql`
    mutation DeleteTimeTable($uuid: String) {
  deleteTimeTable(uuid: $uuid)
}
    `;
export type DeleteTimeTableMutationFn = Apollo.MutationFunction<DeleteTimeTableMutation, DeleteTimeTableMutationVariables>;

/**
 * __useDeleteTimeTableMutation__
 *
 * To run a mutation, you first call `useDeleteTimeTableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTimeTableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTimeTableMutation, { data, loading, error }] = useDeleteTimeTableMutation({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useDeleteTimeTableMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTimeTableMutation, DeleteTimeTableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTimeTableMutation, DeleteTimeTableMutationVariables>(DeleteTimeTableDocument, options);
      }
export type DeleteTimeTableMutationHookResult = ReturnType<typeof useDeleteTimeTableMutation>;
export type DeleteTimeTableMutationResult = Apollo.MutationResult<DeleteTimeTableMutation>;
export type DeleteTimeTableMutationOptions = Apollo.BaseMutationOptions<DeleteTimeTableMutation, DeleteTimeTableMutationVariables>;
export const TimeTablesDocument = gql`
    query TimeTables($input: TimeTableFetchDtoInput) {
  timeTables(fetchDto: $input) {
    ...TimeTableBase
  }
}
    ${TimeTableBaseFragmentDoc}`;

/**
 * __useTimeTablesQuery__
 *
 * To run a query within a React component, call `useTimeTablesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTimeTablesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTimeTablesQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTimeTablesQuery(baseOptions?: Apollo.QueryHookOptions<TimeTablesQuery, TimeTablesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TimeTablesQuery, TimeTablesQueryVariables>(TimeTablesDocument, options);
      }
export function useTimeTablesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TimeTablesQuery, TimeTablesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TimeTablesQuery, TimeTablesQueryVariables>(TimeTablesDocument, options);
        }
export type TimeTablesQueryHookResult = ReturnType<typeof useTimeTablesQuery>;
export type TimeTablesLazyQueryHookResult = ReturnType<typeof useTimeTablesLazyQuery>;
export type TimeTablesQueryResult = Apollo.QueryResult<TimeTablesQuery, TimeTablesQueryVariables>;
export const TimeTableTemplatesDocument = gql`
    query TimeTableTemplates {
  timeTableTemplates {
    semester
    year
  }
}
    `;

/**
 * __useTimeTableTemplatesQuery__
 *
 * To run a query within a React component, call `useTimeTableTemplatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTimeTableTemplatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTimeTableTemplatesQuery({
 *   variables: {
 *   },
 * });
 */
export function useTimeTableTemplatesQuery(baseOptions?: Apollo.QueryHookOptions<TimeTableTemplatesQuery, TimeTableTemplatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TimeTableTemplatesQuery, TimeTableTemplatesQueryVariables>(TimeTableTemplatesDocument, options);
      }
export function useTimeTableTemplatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TimeTableTemplatesQuery, TimeTableTemplatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TimeTableTemplatesQuery, TimeTableTemplatesQueryVariables>(TimeTableTemplatesDocument, options);
        }
export type TimeTableTemplatesQueryHookResult = ReturnType<typeof useTimeTableTemplatesQuery>;
export type TimeTableTemplatesLazyQueryHookResult = ReturnType<typeof useTimeTableTemplatesLazyQuery>;
export type TimeTableTemplatesQueryResult = Apollo.QueryResult<TimeTableTemplatesQuery, TimeTableTemplatesQueryVariables>;
export const RegisterTotiMentorDocument = gql`
    mutation registerTotiMentor($input: TotiMentorRegisterDtoInput) {
  registerTotiMentor(registerDto: $input) {
    entityStatus
    uuid
  }
}
    `;
export type RegisterTotiMentorMutationFn = Apollo.MutationFunction<RegisterTotiMentorMutation, RegisterTotiMentorMutationVariables>;

/**
 * __useRegisterTotiMentorMutation__
 *
 * To run a mutation, you first call `useRegisterTotiMentorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterTotiMentorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerTotiMentorMutation, { data, loading, error }] = useRegisterTotiMentorMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterTotiMentorMutation(baseOptions?: Apollo.MutationHookOptions<RegisterTotiMentorMutation, RegisterTotiMentorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterTotiMentorMutation, RegisterTotiMentorMutationVariables>(RegisterTotiMentorDocument, options);
      }
export type RegisterTotiMentorMutationHookResult = ReturnType<typeof useRegisterTotiMentorMutation>;
export type RegisterTotiMentorMutationResult = Apollo.MutationResult<RegisterTotiMentorMutation>;
export type RegisterTotiMentorMutationOptions = Apollo.BaseMutationOptions<RegisterTotiMentorMutation, RegisterTotiMentorMutationVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($input: UserRegisterDtoInput!) {
  createUser(registerDto: $input) {
    ...UserBase
  }
}
    ${UserBaseFragmentDoc}`;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const EditUserDocument = gql`
    mutation EditUser($input: UserEditDtoInput!) {
  editUser(editDto: $input) {
    ...UserBase
    schoolVerificationStatus
  }
}
    ${UserBaseFragmentDoc}`;
export type EditUserMutationFn = Apollo.MutationFunction<EditUserMutation, EditUserMutationVariables>;

/**
 * __useEditUserMutation__
 *
 * To run a mutation, you first call `useEditUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editUserMutation, { data, loading, error }] = useEditUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditUserMutation(baseOptions?: Apollo.MutationHookOptions<EditUserMutation, EditUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditUserMutation, EditUserMutationVariables>(EditUserDocument, options);
      }
export type EditUserMutationHookResult = ReturnType<typeof useEditUserMutation>;
export type EditUserMutationResult = Apollo.MutationResult<EditUserMutation>;
export type EditUserMutationOptions = Apollo.BaseMutationOptions<EditUserMutation, EditUserMutationVariables>;
export const ResetUserPasswordDocument = gql`
    mutation ResetUserPassword($email: String!, $password: String!) {
  resetUserPassword(email: $email, password: $password) {
    uuid
  }
}
    `;
export type ResetUserPasswordMutationFn = Apollo.MutationFunction<ResetUserPasswordMutation, ResetUserPasswordMutationVariables>;

/**
 * __useResetUserPasswordMutation__
 *
 * To run a mutation, you first call `useResetUserPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetUserPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetUserPasswordMutation, { data, loading, error }] = useResetUserPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useResetUserPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetUserPasswordMutation, ResetUserPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetUserPasswordMutation, ResetUserPasswordMutationVariables>(ResetUserPasswordDocument, options);
      }
export type ResetUserPasswordMutationHookResult = ReturnType<typeof useResetUserPasswordMutation>;
export type ResetUserPasswordMutationResult = Apollo.MutationResult<ResetUserPasswordMutation>;
export type ResetUserPasswordMutationOptions = Apollo.BaseMutationOptions<ResetUserPasswordMutation, ResetUserPasswordMutationVariables>;
export const SetDefaultProfileImageDocument = gql`
    mutation SetDefaultProfileImage {
  setDefaultProfileImage
}
    `;
export type SetDefaultProfileImageMutationFn = Apollo.MutationFunction<SetDefaultProfileImageMutation, SetDefaultProfileImageMutationVariables>;

/**
 * __useSetDefaultProfileImageMutation__
 *
 * To run a mutation, you first call `useSetDefaultProfileImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetDefaultProfileImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setDefaultProfileImageMutation, { data, loading, error }] = useSetDefaultProfileImageMutation({
 *   variables: {
 *   },
 * });
 */
export function useSetDefaultProfileImageMutation(baseOptions?: Apollo.MutationHookOptions<SetDefaultProfileImageMutation, SetDefaultProfileImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetDefaultProfileImageMutation, SetDefaultProfileImageMutationVariables>(SetDefaultProfileImageDocument, options);
      }
export type SetDefaultProfileImageMutationHookResult = ReturnType<typeof useSetDefaultProfileImageMutation>;
export type SetDefaultProfileImageMutationResult = Apollo.MutationResult<SetDefaultProfileImageMutation>;
export type SetDefaultProfileImageMutationOptions = Apollo.BaseMutationOptions<SetDefaultProfileImageMutation, SetDefaultProfileImageMutationVariables>;
export const UserDocument = gql`
    query User($uuid: String!) {
  user(uuid: $uuid) {
    ...UserDetail
  }
}
    ${UserDetailFragmentDoc}`;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useUserQuery(baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const CheckPasswordDocument = gql`
    query CheckPassword($password: String!) {
  checkPassword(password: $password)
}
    `;

/**
 * __useCheckPasswordQuery__
 *
 * To run a query within a React component, call `useCheckPasswordQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckPasswordQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckPasswordQuery({
 *   variables: {
 *      password: // value for 'password'
 *   },
 * });
 */
export function useCheckPasswordQuery(baseOptions: Apollo.QueryHookOptions<CheckPasswordQuery, CheckPasswordQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CheckPasswordQuery, CheckPasswordQueryVariables>(CheckPasswordDocument, options);
      }
export function useCheckPasswordLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CheckPasswordQuery, CheckPasswordQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CheckPasswordQuery, CheckPasswordQueryVariables>(CheckPasswordDocument, options);
        }
export type CheckPasswordQueryHookResult = ReturnType<typeof useCheckPasswordQuery>;
export type CheckPasswordLazyQueryHookResult = ReturnType<typeof useCheckPasswordLazyQuery>;
export type CheckPasswordQueryResult = Apollo.QueryResult<CheckPasswordQuery, CheckPasswordQueryVariables>;
export const ExistsNickNameDocument = gql`
    query ExistsNickName($nickname: String!) {
  existsNickName(nickname: $nickname)
}
    `;

/**
 * __useExistsNickNameQuery__
 *
 * To run a query within a React component, call `useExistsNickNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useExistsNickNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExistsNickNameQuery({
 *   variables: {
 *      nickname: // value for 'nickname'
 *   },
 * });
 */
export function useExistsNickNameQuery(baseOptions: Apollo.QueryHookOptions<ExistsNickNameQuery, ExistsNickNameQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ExistsNickNameQuery, ExistsNickNameQueryVariables>(ExistsNickNameDocument, options);
      }
export function useExistsNickNameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ExistsNickNameQuery, ExistsNickNameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ExistsNickNameQuery, ExistsNickNameQueryVariables>(ExistsNickNameDocument, options);
        }
export type ExistsNickNameQueryHookResult = ReturnType<typeof useExistsNickNameQuery>;
export type ExistsNickNameLazyQueryHookResult = ReturnType<typeof useExistsNickNameLazyQuery>;
export type ExistsNickNameQueryResult = Apollo.QueryResult<ExistsNickNameQuery, ExistsNickNameQueryVariables>;
export const CheckEmailExistsDocument = gql`
    query CheckEmailExists($email: String!) {
  checkEmailExists(email: $email)
}
    `;

/**
 * __useCheckEmailExistsQuery__
 *
 * To run a query within a React component, call `useCheckEmailExistsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckEmailExistsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckEmailExistsQuery({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useCheckEmailExistsQuery(baseOptions: Apollo.QueryHookOptions<CheckEmailExistsQuery, CheckEmailExistsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CheckEmailExistsQuery, CheckEmailExistsQueryVariables>(CheckEmailExistsDocument, options);
      }
export function useCheckEmailExistsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CheckEmailExistsQuery, CheckEmailExistsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CheckEmailExistsQuery, CheckEmailExistsQueryVariables>(CheckEmailExistsDocument, options);
        }
export type CheckEmailExistsQueryHookResult = ReturnType<typeof useCheckEmailExistsQuery>;
export type CheckEmailExistsLazyQueryHookResult = ReturnType<typeof useCheckEmailExistsLazyQuery>;
export type CheckEmailExistsQueryResult = Apollo.QueryResult<CheckEmailExistsQuery, CheckEmailExistsQueryVariables>;
export const RegisterUserInteractionDocument = gql`
    mutation RegisterUserInteraction($input: UserInteractionRegisterDtoInput!) {
  registerUserInteraction(userInteractionRegisterDto: $input) {
    uuid
  }
}
    `;
export type RegisterUserInteractionMutationFn = Apollo.MutationFunction<RegisterUserInteractionMutation, RegisterUserInteractionMutationVariables>;

/**
 * __useRegisterUserInteractionMutation__
 *
 * To run a mutation, you first call `useRegisterUserInteractionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserInteractionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserInteractionMutation, { data, loading, error }] = useRegisterUserInteractionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterUserInteractionMutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserInteractionMutation, RegisterUserInteractionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterUserInteractionMutation, RegisterUserInteractionMutationVariables>(RegisterUserInteractionDocument, options);
      }
export type RegisterUserInteractionMutationHookResult = ReturnType<typeof useRegisterUserInteractionMutation>;
export type RegisterUserInteractionMutationResult = Apollo.MutationResult<RegisterUserInteractionMutation>;
export type RegisterUserInteractionMutationOptions = Apollo.BaseMutationOptions<RegisterUserInteractionMutation, RegisterUserInteractionMutationVariables>;
export const DeleteUserInteractionDocument = gql`
    mutation DeleteUserInteraction($input: UserInteractionDeleteDtoInput!) {
  deleteUserInteraction(userInteractionDeleteDto: $input)
}
    `;
export type DeleteUserInteractionMutationFn = Apollo.MutationFunction<DeleteUserInteractionMutation, DeleteUserInteractionMutationVariables>;

/**
 * __useDeleteUserInteractionMutation__
 *
 * To run a mutation, you first call `useDeleteUserInteractionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserInteractionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserInteractionMutation, { data, loading, error }] = useDeleteUserInteractionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteUserInteractionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserInteractionMutation, DeleteUserInteractionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserInteractionMutation, DeleteUserInteractionMutationVariables>(DeleteUserInteractionDocument, options);
      }
export type DeleteUserInteractionMutationHookResult = ReturnType<typeof useDeleteUserInteractionMutation>;
export type DeleteUserInteractionMutationResult = Apollo.MutationResult<DeleteUserInteractionMutation>;
export type DeleteUserInteractionMutationOptions = Apollo.BaseMutationOptions<DeleteUserInteractionMutation, DeleteUserInteractionMutationVariables>;
export const RegisterUserMessageDocument = gql`
    mutation RegisterUserMessage($input: UserMessageRegisterDtoInput!) {
  registerUserMessage(registerDto: $input) {
    uuid
    roomUuid
  }
}
    `;
export type RegisterUserMessageMutationFn = Apollo.MutationFunction<RegisterUserMessageMutation, RegisterUserMessageMutationVariables>;

/**
 * __useRegisterUserMessageMutation__
 *
 * To run a mutation, you first call `useRegisterUserMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserMessageMutation, { data, loading, error }] = useRegisterUserMessageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterUserMessageMutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserMessageMutation, RegisterUserMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterUserMessageMutation, RegisterUserMessageMutationVariables>(RegisterUserMessageDocument, options);
      }
export type RegisterUserMessageMutationHookResult = ReturnType<typeof useRegisterUserMessageMutation>;
export type RegisterUserMessageMutationResult = Apollo.MutationResult<RegisterUserMessageMutation>;
export type RegisterUserMessageMutationOptions = Apollo.BaseMutationOptions<RegisterUserMessageMutation, RegisterUserMessageMutationVariables>;
export const EditUserMessageDocument = gql`
    mutation EditUserMessage($input: UserMessageEditDtoInput!) {
  editUserMessage(editDto: $input) {
    uuid
  }
}
    `;
export type EditUserMessageMutationFn = Apollo.MutationFunction<EditUserMessageMutation, EditUserMessageMutationVariables>;

/**
 * __useEditUserMessageMutation__
 *
 * To run a mutation, you first call `useEditUserMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditUserMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editUserMessageMutation, { data, loading, error }] = useEditUserMessageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditUserMessageMutation(baseOptions?: Apollo.MutationHookOptions<EditUserMessageMutation, EditUserMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditUserMessageMutation, EditUserMessageMutationVariables>(EditUserMessageDocument, options);
      }
export type EditUserMessageMutationHookResult = ReturnType<typeof useEditUserMessageMutation>;
export type EditUserMessageMutationResult = Apollo.MutationResult<EditUserMessageMutation>;
export type EditUserMessageMutationOptions = Apollo.BaseMutationOptions<EditUserMessageMutation, EditUserMessageMutationVariables>;
export const UnreadMessageCountDocument = gql`
    query UnreadMessageCount {
  unreadMessageCount
}
    `;

/**
 * __useUnreadMessageCountQuery__
 *
 * To run a query within a React component, call `useUnreadMessageCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useUnreadMessageCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUnreadMessageCountQuery({
 *   variables: {
 *   },
 * });
 */
export function useUnreadMessageCountQuery(baseOptions?: Apollo.QueryHookOptions<UnreadMessageCountQuery, UnreadMessageCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UnreadMessageCountQuery, UnreadMessageCountQueryVariables>(UnreadMessageCountDocument, options);
      }
export function useUnreadMessageCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UnreadMessageCountQuery, UnreadMessageCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UnreadMessageCountQuery, UnreadMessageCountQueryVariables>(UnreadMessageCountDocument, options);
        }
export type UnreadMessageCountQueryHookResult = ReturnType<typeof useUnreadMessageCountQuery>;
export type UnreadMessageCountLazyQueryHookResult = ReturnType<typeof useUnreadMessageCountLazyQuery>;
export type UnreadMessageCountQueryResult = Apollo.QueryResult<UnreadMessageCountQuery, UnreadMessageCountQueryVariables>;
export const UserMessagesDocument = gql`
    query UserMessages($input: UserMessageFetchDtoInput!) {
  userMessagesByCursor(fetchDto: $input) {
    cursor
    data {
      ...UserMessageSummary
    }
  }
}
    ${UserMessageSummaryFragmentDoc}`;

/**
 * __useUserMessagesQuery__
 *
 * To run a query within a React component, call `useUserMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserMessagesQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUserMessagesQuery(baseOptions: Apollo.QueryHookOptions<UserMessagesQuery, UserMessagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserMessagesQuery, UserMessagesQueryVariables>(UserMessagesDocument, options);
      }
export function useUserMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserMessagesQuery, UserMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserMessagesQuery, UserMessagesQueryVariables>(UserMessagesDocument, options);
        }
export type UserMessagesQueryHookResult = ReturnType<typeof useUserMessagesQuery>;
export type UserMessagesLazyQueryHookResult = ReturnType<typeof useUserMessagesLazyQuery>;
export type UserMessagesQueryResult = Apollo.QueryResult<UserMessagesQuery, UserMessagesQueryVariables>;
export const ReadAllUserNotificationDocument = gql`
    mutation ReadAllUserNotification {
  readAllUserNotification
}
    `;
export type ReadAllUserNotificationMutationFn = Apollo.MutationFunction<ReadAllUserNotificationMutation, ReadAllUserNotificationMutationVariables>;

/**
 * __useReadAllUserNotificationMutation__
 *
 * To run a mutation, you first call `useReadAllUserNotificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReadAllUserNotificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [readAllUserNotificationMutation, { data, loading, error }] = useReadAllUserNotificationMutation({
 *   variables: {
 *   },
 * });
 */
export function useReadAllUserNotificationMutation(baseOptions?: Apollo.MutationHookOptions<ReadAllUserNotificationMutation, ReadAllUserNotificationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReadAllUserNotificationMutation, ReadAllUserNotificationMutationVariables>(ReadAllUserNotificationDocument, options);
      }
export type ReadAllUserNotificationMutationHookResult = ReturnType<typeof useReadAllUserNotificationMutation>;
export type ReadAllUserNotificationMutationResult = Apollo.MutationResult<ReadAllUserNotificationMutation>;
export type ReadAllUserNotificationMutationOptions = Apollo.BaseMutationOptions<ReadAllUserNotificationMutation, ReadAllUserNotificationMutationVariables>;
export const EditUserNotificationDocument = gql`
    mutation EditUserNotification($input: UserNotificationEditDtoInput!) {
  editUserNotification(editDto: $input) {
    ...UserNotificationBase
  }
}
    ${UserNotificationBaseFragmentDoc}`;
export type EditUserNotificationMutationFn = Apollo.MutationFunction<EditUserNotificationMutation, EditUserNotificationMutationVariables>;

/**
 * __useEditUserNotificationMutation__
 *
 * To run a mutation, you first call `useEditUserNotificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditUserNotificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editUserNotificationMutation, { data, loading, error }] = useEditUserNotificationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditUserNotificationMutation(baseOptions?: Apollo.MutationHookOptions<EditUserNotificationMutation, EditUserNotificationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditUserNotificationMutation, EditUserNotificationMutationVariables>(EditUserNotificationDocument, options);
      }
export type EditUserNotificationMutationHookResult = ReturnType<typeof useEditUserNotificationMutation>;
export type EditUserNotificationMutationResult = Apollo.MutationResult<EditUserNotificationMutation>;
export type EditUserNotificationMutationOptions = Apollo.BaseMutationOptions<EditUserNotificationMutation, EditUserNotificationMutationVariables>;
export const UserNotificationCountDocument = gql`
    query UserNotificationCount {
  userNotificationCount
}
    `;

/**
 * __useUserNotificationCountQuery__
 *
 * To run a query within a React component, call `useUserNotificationCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserNotificationCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserNotificationCountQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserNotificationCountQuery(baseOptions?: Apollo.QueryHookOptions<UserNotificationCountQuery, UserNotificationCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserNotificationCountQuery, UserNotificationCountQueryVariables>(UserNotificationCountDocument, options);
      }
export function useUserNotificationCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserNotificationCountQuery, UserNotificationCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserNotificationCountQuery, UserNotificationCountQueryVariables>(UserNotificationCountDocument, options);
        }
export type UserNotificationCountQueryHookResult = ReturnType<typeof useUserNotificationCountQuery>;
export type UserNotificationCountLazyQueryHookResult = ReturnType<typeof useUserNotificationCountLazyQuery>;
export type UserNotificationCountQueryResult = Apollo.QueryResult<UserNotificationCountQuery, UserNotificationCountQueryVariables>;
export const UserNotificationsDocument = gql`
    query UserNotifications($input: UserNotificationFetchDtoInput!) {
  userNotificationsByCursor(fetchDto: $input) {
    cursor
    data {
      ...UserNotificationSummary
    }
  }
}
    ${UserNotificationSummaryFragmentDoc}`;

/**
 * __useUserNotificationsQuery__
 *
 * To run a query within a React component, call `useUserNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserNotificationsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUserNotificationsQuery(baseOptions: Apollo.QueryHookOptions<UserNotificationsQuery, UserNotificationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserNotificationsQuery, UserNotificationsQueryVariables>(UserNotificationsDocument, options);
      }
export function useUserNotificationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserNotificationsQuery, UserNotificationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserNotificationsQuery, UserNotificationsQueryVariables>(UserNotificationsDocument, options);
        }
export type UserNotificationsQueryHookResult = ReturnType<typeof useUserNotificationsQuery>;
export type UserNotificationsLazyQueryHookResult = ReturnType<typeof useUserNotificationsLazyQuery>;
export type UserNotificationsQueryResult = Apollo.QueryResult<UserNotificationsQuery, UserNotificationsQueryVariables>;
export const RegisterUserReportDocument = gql`
    mutation RegisterUserReport($input: UserReportRegisterDtoInput!) {
  registerUserReport(registerDto: $input) {
    ...UserReportBase
  }
}
    ${UserReportBaseFragmentDoc}`;
export type RegisterUserReportMutationFn = Apollo.MutationFunction<RegisterUserReportMutation, RegisterUserReportMutationVariables>;

/**
 * __useRegisterUserReportMutation__
 *
 * To run a mutation, you first call `useRegisterUserReportMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserReportMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserReportMutation, { data, loading, error }] = useRegisterUserReportMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterUserReportMutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserReportMutation, RegisterUserReportMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterUserReportMutation, RegisterUserReportMutationVariables>(RegisterUserReportDocument, options);
      }
export type RegisterUserReportMutationHookResult = ReturnType<typeof useRegisterUserReportMutation>;
export type RegisterUserReportMutationResult = Apollo.MutationResult<RegisterUserReportMutation>;
export type RegisterUserReportMutationOptions = Apollo.BaseMutationOptions<RegisterUserReportMutation, RegisterUserReportMutationVariables>;
export const EditVoteDocument = gql`
    mutation EditVote($input: VoteEditDtoInput!) {
  editVote(editDto: $input) {
    ...VoteBase
  }
}
    ${VoteBaseFragmentDoc}`;
export type EditVoteMutationFn = Apollo.MutationFunction<EditVoteMutation, EditVoteMutationVariables>;

/**
 * __useEditVoteMutation__
 *
 * To run a mutation, you first call `useEditVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editVoteMutation, { data, loading, error }] = useEditVoteMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditVoteMutation(baseOptions?: Apollo.MutationHookOptions<EditVoteMutation, EditVoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditVoteMutation, EditVoteMutationVariables>(EditVoteDocument, options);
      }
export type EditVoteMutationHookResult = ReturnType<typeof useEditVoteMutation>;
export type EditVoteMutationResult = Apollo.MutationResult<EditVoteMutation>;
export type EditVoteMutationOptions = Apollo.BaseMutationOptions<EditVoteMutation, EditVoteMutationVariables>;
export const CategoriesDocument = gql`
    query Categories($parentUuid: String, $schoolTypeUuid: String) {
  categories(parentUuid: $parentUuid, schoolTypeUuid: $schoolTypeUuid) {
    uuid
    name
    code
    isScraped
  }
}
    `;

/**
 * __useCategoriesQuery__
 *
 * To run a query within a React component, call `useCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoriesQuery({
 *   variables: {
 *      parentUuid: // value for 'parentUuid'
 *      schoolTypeUuid: // value for 'schoolTypeUuid'
 *   },
 * });
 */
export function useCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, options);
      }
export function useCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, options);
        }
export type CategoriesQueryHookResult = ReturnType<typeof useCategoriesQuery>;
export type CategoriesLazyQueryHookResult = ReturnType<typeof useCategoriesLazyQuery>;
export type CategoriesQueryResult = Apollo.QueryResult<CategoriesQuery, CategoriesQueryVariables>;

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    