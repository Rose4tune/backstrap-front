export interface PostRecruitmentListRequest {
  paginationRequestDto: {
    cursor: string | null;
    count: number;
  };
  jobTypes?: string[];
  sort?: 'DEADLINE' | 'UPLOAD';
  orderBy?: 'DESC' | 'ASC';
  companyTypes?: string[];
  recruitmentTypes?: string[];
  educations?: string[];
  years?: number;
  regions?: string[];
  deadlineTypes?: string[];
  industryTypes?: string;
  createdDateMin?: number;
  createdDateMax?: number;
  workStartDate?: number;
  workEndDate?: number;
  lastModifiedDateMin?: number;
  lastModifiedDateMax?: number;
  keyword?: string | null;
}
