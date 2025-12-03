import { makeAutoObservable } from 'mobx';

import { PostRecruitmentListRequest } from '@dto/CareerDTO';

import {
  deleteRecruitmentBookmarkData,
  getRecruitmentBookmarkData,
  getRecruitmentDetailData,
  getRecruitmentFilterTypeData,
  postRecruitmentListData,
  putRecruitmentBookmarkData
} from '@repositories/careerRepository';

import type CareersMainType from '@mock/careers/types/careersMainType';
import type FilterType from '@mock/careers/types/filterType';

const careerStore = makeAutoObservable({
  recruitmentListData: {
    cursor: '',
    page: 0,
    totalCount: 1,
    data: [
      {
        uuid: '',
        createdDate: '',
        lastModifiedDate: '',
        recruitmentUid: '',
        title: '',
        content: '',
        thumbnailUrl: '',
        recruitmentAnnouncementLink: '',
        recruitmentStartDate: '',
        recruitmentDeadlineDate: '',
        workStartDate: '',
        workEndDate: '',
        yearsMin: -1,
        yearsMax: -1,
        companyType: '',
        companyName: '',
        companyAddress: '',
        sourceCompanyName: '',
        sourceCompanyAddress: '',
        isBookmarked: false,
        industryTypes: [
          {
            key: '',
            value: ''
          },
          {
            key: '',
            value: ''
          }
        ],
        recruitmentJobs: {},
        recruitmentTypes: [
          {
            key: '',
            value: ''
          }
        ],
        educations: [
          {
            key: '',
            value: ''
          },
          {
            key: '',
            value: ''
          }
        ],
        regions: [
          {
            key: '',
            value: ''
          }
        ],
        deadlineType: {
          key: '',
          value: ''
        },
        isAdminRegistered: false
      }
    ]
  },
  recruitmentDetailData: {
    uuid: '',
    createdDate: '',
    lastModifiedDate: '',
    recruitmentUid: '',
    title: '',
    content: '',
    thumbnailUrl: '',
    recruitmentAnnouncementLink: '',
    recruitmentStartDate: '',
    recruitmentDeadlineDate: '',
    workStartDate: '',
    workEndDate: '',
    yearsMin: -1,
    yearsMax: -1,
    companyType: '',
    companyName: '',
    companyAddress: '',
    sourceCompanyName: '',
    sourceCompanyAddress: '',
    isBookmarked: false,
    industryTypes: [
      {
        key: '',
        value: ''
      },
      {
        key: '',
        value: ''
      }
    ],
    recruitmentJobs: {},
    recruitmentTypes: [
      {
        key: '',
        value: ''
      }
    ],
    educations: [
      {
        key: '',
        value: ''
      },
      {
        key: '',
        value: ''
      }
    ],
    regions: [
      {
        key: '',
        value: ''
      }
    ],
    deadlineType: {
      key: '',
      value: ''
    },
    isAdminRegistered: false
  },
  filterTypeData: {
    job: {},
    industry: [],
    company: [],
    recruitment: [],
    education: [],
    region: [],
    deadline: []
  },
  bookmarkedJobs: new Map<string, boolean>(),
  bookmarkListData: {
    cursor: '',
    page: 0,
    totalCount: 1,
    data: [
      {
        uuid: '',
        createdDate: '',
        lastModifiedDate: '',
        recruitmentUid: '',
        title: '',
        content: '',
        thumbnailUrl: '',
        recruitmentAnnouncementLink: '',
        recruitmentStartDate: '',
        recruitmentDeadlineDate: '',
        workStartDate: '',
        workEndDate: '',
        yearsMin: -1,
        yearsMax: -1,
        companyType: '',
        companyName: '',
        companyAddress: '',
        sourceCompanyName: '',
        sourceCompanyAddress: '',
        isBookmarked: false,
        industryTypes: [
          {
            key: '',
            value: ''
          },
          {
            key: '',
            value: ''
          }
        ],
        recruitmentJobs: {},
        recruitmentTypes: [
          {
            key: '',
            value: ''
          }
        ],
        educations: [
          {
            key: '',
            value: ''
          },
          {
            key: '',
            value: ''
          }
        ],
        regions: [
          {
            key: '',
            value: ''
          }
        ],
        deadlineType: {
          key: '',
          value: ''
        },
        isAdminRegistered: false
      }
    ]
  },
  recruitmentResearcherAndProfessorListData: {
    cursor: '',
    page: 0,
    totalCount: 1,
    data: [
      {
        uuid: '',
        createdDate: '',
        lastModifiedDate: '',
        recruitmentUid: '',
        title: '',
        content: '',
        thumbnailUrl: '',
        recruitmentAnnouncementLink: '',
        recruitmentStartDate: '',
        recruitmentDeadlineDate: '',
        workStartDate: '',
        workEndDate: '',
        yearsMin: -1,
        yearsMax: -1,
        companyType: '',
        companyName: '',
        companyAddress: '',
        sourceCompanyName: '',
        sourceCompanyAddress: '',
        isBookmarked: false,
        industryTypes: [
          {
            key: '',
            value: ''
          },
          {
            key: '',
            value: ''
          }
        ],
        recruitmentJobs: {},
        recruitmentTypes: [
          {
            key: '',
            value: ''
          }
        ],
        educations: [
          {
            key: '',
            value: ''
          },
          {
            key: '',
            value: ''
          }
        ],
        regions: [
          {
            key: '',
            value: ''
          }
        ],
        deadlineType: {
          key: '',
          value: ''
        },
        isAdminRegistered: false
      }
    ]
  },

  setBookmark(uuid: string, isBookmarked: boolean) {
    this.bookmarkedJobs.set(uuid, isBookmarked);
  },

  isBookmarked(uuid: string): boolean {
    return this.bookmarkedJobs.get(uuid) ?? false;
  },

  async toggleBookmark(uuid: string, isBookmarked: boolean, token: string) {
    const currentStatus = this.bookmarkedJobs.get(uuid);
    this.bookmarkedJobs.set(uuid, !currentStatus);

    if (currentStatus) {
      await deleteRecruitmentBookmarkData(token, uuid);
    } else {
      await putRecruitmentBookmarkData(token, uuid);
    }
  },

  async postRecruitmentList(body: PostRecruitmentListRequest, token?: string) {
    const response = await postRecruitmentListData(body, token);
    this.recruitmentListData = response as unknown as {
      data: CareersMainType[];
      cursor: string;
      page: number;
      totalCount: number;
    };
  },

  async getRecruitmentDetail(uuid: string, token?: string) {
    const response = await getRecruitmentDetailData(uuid, token);
    this.recruitmentDetailData = response as CareersMainType;
  },

  async getRecruitmentFilterType() {
    const response = await getRecruitmentFilterTypeData();
    this.filterTypeData = response as FilterType;
  },

  async getRecruitmentBookmark(token: string) {
    const response = await getRecruitmentBookmarkData(token);
    this.bookmarkListData = response as {
      data: CareersMainType[];
      cursor: string;
      page: number;
      totalCount: number;
    };
  },

  async postRecruitmentResearcherAndProfessorList() {
    const response = await postRecruitmentListData({
      paginationRequestDto: {
        cursor: null,
        count: 12
      },
      jobTypes: ['research']
    });
    this.recruitmentResearcherAndProfessorListData = response as unknown as {
      data: CareersMainType[];
      cursor: string;
      page: number;
      totalCount: number;
    };
  }
});

export default careerStore;
