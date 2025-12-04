import { Fragment } from 'react';

import type CareersMainType from '@mock/careers/types/careersMainType';

import {
  RecruitmentInformationSectionContainer,
  RecruitmentInformationSectionTextContainer,
  RecruitmentInformationSectionTitle,
  RecruitmentInformationSectionContent
} from './RecruitmentInformationSection.style';

interface JinhakRecruitmentInformationSectionProps {
  jobData: CareersMainType;
}

const formatDateRange = (startDate: string, endDate: string): string => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  const start = formatDateTime(startDate);
  const end = formatDateTime(endDate);
  return `${start} - ${end}`;
};

const JinhakRecruitmentInformationSection = ({
  jobData
}: JinhakRecruitmentInformationSectionProps) => {
  const leftItemsData = [
    formatDateRange(jobData.recruitmentStartDate, jobData.recruitmentDeadlineDate),
    jobData.recruitmentTypes.map(type => type.value),
    Object.values(jobData.recruitmentJobs)
      .flat()
      .map(job => job.value)
  ];

  const rightItemsData = [
    '홈페이지 지원',
    jobData.educations.map(edu => edu.value),
    jobData.regions.map(region => region.value)
  ];

  const leftLabels = ['접수 기간', '채용 직군', '모집 전공'];
  const rightLabels = ['접수 방법', '지원 자격', '근무 지역'];

  const allItems = [
    ...leftLabels.map((label, index) => ({
      label,
      data: leftItemsData[index]
    })),
    ...rightLabels.map((label, index) => ({
      label,
      data: rightItemsData[index]
    }))
  ];

  return (
    <RecruitmentInformationSectionContainer>
      {allItems.map((item, index) => (
        <RecruitmentInformationSectionTextContainer key={index}>
          <RecruitmentInformationSectionTitle>
            {item.label}
          </RecruitmentInformationSectionTitle>
          {Array.isArray(item.data) ? (
            (item.data as string[]).map((content, idx) => (
              <Fragment key={idx}>
                <RecruitmentInformationSectionContent>
                  {content}
                </RecruitmentInformationSectionContent>
                {idx < item.data.length - 1 && <div>|</div>}
              </Fragment>
            ))
          ) : (
            <RecruitmentInformationSectionContent>
              {item.data}
            </RecruitmentInformationSectionContent>
          )}
        </RecruitmentInformationSectionTextContainer>
      ))}
    </RecruitmentInformationSectionContainer>
  );
};

export default JinhakRecruitmentInformationSection;
