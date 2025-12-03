import { Fragment } from 'react';

import { formatJobYear } from '@use-cases/careers/formatJobYear';
import { formatDate } from '@use-cases/careers/formatDate';

import { RecruitmentMockData } from '@mock/careers/data/recruitmentMockData';

import type CareersMainType from '@mock/careers/types/careersMainType';

import {
  RecruitmentInformationSectionContainer,
  RecruitmentInformationSectionTextContainer,
  RecruitmentInformationSectionTitle,
  RecruitmentInformationSectionContent
} from './RecruitmentInformationSection.style';

const RecruitmentInformation = ({ jobData }: { jobData: CareersMainType }) => {
  const getFilteredRecruitmentTypeValues = (
    types: { key: string; value: string }[]
  ): string[] => {
    const allowedBase = ['임용', '전문연구요원', '인턴', '산업기능요원'];
    const internExtras = ['전환형 인턴', '체험형 인턴'];

    const allValues = types.map(t => t.value);

    const values = types
      .filter(t => allowedBase.includes(t.value) || internExtras.includes(t.value))
      .map(t => t.value);

    const hasIndependentIntern = allValues.includes('인턴');

    if (hasIndependentIntern) {
      internExtras.forEach(extra => {
        if (!values.includes(extra)) {
          values.push(extra);
        }
      });
    }

    return values;
  };

  const jobDataArray = [
    formatJobYear(jobData.yearsMin, jobData.yearsMax),
    jobData.educations.map(edu => edu.value),
    getFilteredRecruitmentTypeValues(jobData.recruitmentTypes),
    Object.values(jobData.recruitmentJobs)
      .flat()
      .map(job => job.value),
    jobData.regions.map(region => region.value),
    formatDate(jobData.recruitmentDeadlineDate)
  ];

  return (
    <RecruitmentInformationSectionContainer>
      {RecruitmentMockData.map((item, index) => (
        <RecruitmentInformationSectionTextContainer key={item.id}>
          <RecruitmentInformationSectionTitle>
            {item.name}
          </RecruitmentInformationSectionTitle>
          {Array.isArray(jobDataArray[index]) ? (
            (jobDataArray[index] as string[]).map((content, idx) => (
              <Fragment key={idx}>
                <RecruitmentInformationSectionContent>
                  {content}
                </RecruitmentInformationSectionContent>
                {idx < jobDataArray[index].length - 1 && <div>|</div>}
              </Fragment>
            ))
          ) : (
            <RecruitmentInformationSectionContent>
              {jobDataArray[index]}
            </RecruitmentInformationSectionContent>
          )}
        </RecruitmentInformationSectionTextContainer>
      ))}
    </RecruitmentInformationSectionContainer>
  );
};

export default RecruitmentInformation;
