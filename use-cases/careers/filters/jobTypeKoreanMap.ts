import { FilterJobType } from '@enums/careers/filterJob.enum';

export const JobTypeKoreanMap: Record<FilterJobType, string> = {
  [FilterJobType.Accounting]: '회계·세무·재무',
  [FilterJobType.Ai]: 'AI·데이터',
  [FilterJobType.Construction]: '건설·건축',
  [FilterJobType.Customer]: '고객상담·TM',
  [FilterJobType.Design]: '디자인',
  [FilterJobType.Driver]: '운전·운송·배송',
  [FilterJobType.Education]: '교육',
  [FilterJobType.Finance]: '금융·보험',
  [FilterJobType.Game]: '게임',
  [FilterJobType.Hr]: '인사·노무·HRD',
  [FilterJobType.It]: 'IT개발·데이터',
  [FilterJobType.Legal]: '총무·법무·사무',
  [FilterJobType.Marketing]: '마케팅·홍보·조사',
  [FilterJobType.Md]: '상품기획·MD',
  [FilterJobType.Media]: '미디어·문화·스포츠',
  [FilterJobType.Medical]: '의료',
  [FilterJobType.Production]: '생산',
  [FilterJobType.Public]: '공공·복지',
  [FilterJobType.Purchase]: '구매·자재·물류',
  [FilterJobType.Research]: '연구·RND',
  [FilterJobType.Sales]: '영업·판매·무역',
  [FilterJobType.Semiconductor]: '반도체',
  [FilterJobType.Service]: '서비스',
  [FilterJobType.Strategy]: '기획·전략'
};

export const getJobTypeLabel = (type: string): string =>
  JobTypeKoreanMap[type as FilterJobType] ?? '';
