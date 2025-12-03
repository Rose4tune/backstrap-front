export type CareerFilterTitleType =
  | '직군'
  | '직무'
  | '산업 유형'
  | '회사 유형'
  | '채용 유형'
  | '학력 조건'
  | '경력 조건'
  | '지역'
  | '마감 유형';

export const careerFilterTitles: { id: number; title: CareerFilterTitleType }[] = [
  { id: 1, title: '직군' },
  { id: 2, title: '직무' },
  { id: 3, title: '산업 유형' },
  { id: 4, title: '회사 유형' },
  { id: 5, title: '채용 유형' },
  { id: 6, title: '학력 조건' },
  { id: 7, title: '경력 조건' },
  { id: 8, title: '지역' },
  { id: 9, title: '마감 유형' }
];

export const careerFilterDataKorean: Record<string, string> = {
  job: '직군',
  jobSubCategories: '직무',
  industry: '산업 유형',
  company: '회사 유형',
  recruitment: '채용 유형',
  education: '학력 조건',
  years: '경력 조건',
  region: '지역',
  deadline: '마감 유형'
};

export const careerFilterDataEnglish = {
  직군: 'job',
  직무: 'jobSubCategories',
  '산업 유형': 'industry',
  '회사 유형': 'company',
  '채용 유형': 'recruitment',
  '학력 조건': 'education',
  '경력 조건': 'years',
  지역: 'region',
  '마감 유형': 'deadline'
};
