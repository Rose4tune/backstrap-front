export default interface BookmarkResponse {
  cursor: string;
  totalCount: number;
  page: number;
  data: {
    uuid: string;
    createdBy: string;
    createdDate: string;
    entityStatus: 'ACTIVE' | 'INACTIVE';
    lastModifiedBy: string | null;
    lastModifiedDate: string;
    title: string;
    thumbnailImageUrl: string;
    recruitmentAnnouncementLink: string;
    recruitmentStartDate: string;
    recruitmentDeadlineDate: string;
    workStartDate: string;
    workEndDate: string;
    yearsMin: number;
    yearsMax: number;
    companyType: string | null;
    companyName: string | null;
    companyAddress: string | null;
    industryTypes: string[];
    recruitmentJobs: { [key: string]: any };
    recruitmentTypes: string[];
    educations: string[];
    deadlineType: string;
    region: string;
    isBookmarked: boolean;
  }[];
}
