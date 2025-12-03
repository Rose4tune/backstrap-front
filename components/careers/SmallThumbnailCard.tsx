import Image from 'next/image';
import Link from 'next/link';

import CareersMainType from '@mock/careers/types/careersMainType';

import FieldBadge from '@components/careers/FieldBadge';
import RecruitmentBadge from '@components/careers/RecruitmentBadge';

import {
  CompanyName,
  JobInformation,
  JobTitle,
  SmallThumbnailCardContainer,
  ThumbnailContainer
} from './SmallThumbnailCard.style';

interface SmallThumbnailCardProps {
  data: CareersMainType;
}

const SmallThumbnailCard = ({ data }: SmallThumbnailCardProps) => {
  const {
    uuid,
    thumbnailUrl,
    companyName,
    title,
    educations,
    recruitmentTypes,
    recruitmentJobs
  } = data;

  return (
    <Link href={`/careers/${uuid}`} passHref style={{ minWidth: '0px' }}>
      <SmallThumbnailCardContainer>
        <ThumbnailContainer>
          <Image
            src={
              thumbnailUrl ||
              (recruitmentJobs && Object.keys(recruitmentJobs).length > 0
                ? `/assets/[career]thumbnail_${Object.keys(recruitmentJobs)[0]}.png`
                : '/assets/[career]thumbnail_accounting.png')
            }
            alt={'job-thumbnail'}
            fill
            style={{ objectFit: 'cover' }}
          />
        </ThumbnailContainer>

        <JobInformation>
          <CompanyName>{companyName}</CompanyName>
          <JobTitle>{title}</JobTitle>
          <div>
            <RecruitmentBadge
              recruitmentTypes={recruitmentTypes}
              educations={educations}
            />
            <FieldBadge field={recruitmentJobs} />
          </div>
        </JobInformation>
      </SmallThumbnailCardContainer>
    </Link>
  );
};
export default SmallThumbnailCard;
