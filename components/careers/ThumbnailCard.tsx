import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { observer } from 'mobx-react-lite';

import careerStore from '@stores/career.store';

import useAuthPayload from '@hooks/useAuthPayload.hook';

import { formatDeadlineDate } from '@use-cases/careers/formatDeadlineDate';

import CareersMainType from '@mock/careers/types/careersMainType';

import FieldBadge from '@components/careers/FieldBadge';
import RecruitmentBadge from '@components/careers/RecruitmentBadge';
import Dday from '@components/careers/Dday';
import JobBookmark from '@components/careers/JobBookmark';

import {
  CompanyName,
  DdayContainer,
  JobBookmarkContainer,
  JobInformation,
  JobTitle,
  ThumbnailCardContainer,
  ThumbnailContainer
} from './ThumbnailCard.style';

interface ThumbnailCardProps {
  data: CareersMainType;
  defaultColor: 'grey' | 'white';
}

const ThumbnailCard = observer(({ data, defaultColor }: ThumbnailCardProps) => {
  const {
    uuid,
    recruitmentDeadlineDate,
    thumbnailUrl,
    companyName,
    title,
    educations,
    recruitmentTypes,
    recruitmentJobs,
    isBookmarked
  } = data;
  const authPayload = useAuthPayload();

  const accessToken = authPayload?.access_token || '';

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    careerStore.setBookmark(uuid, isBookmarked);
    setIsLoaded(true);
  }, [uuid, isBookmarked]);

  if (!isLoaded) return null;

  return (
    <ThumbnailCardContainer>
      <ThumbnailContainer>
        <Link href={`/careers/${uuid}`} passHref>
          <Image
            src={
              thumbnailUrl ||
              (recruitmentJobs && Object.keys(recruitmentJobs).length > 0
                ? `/assets/[career]thumbnail_${Object.keys(recruitmentJobs)[0]}.png`
                : '/assets/[career]thumbnail_accounting.png')
            }
            alt="job-thumbnail"
            fill
            style={{ objectFit: 'cover' }}
          />
          <DdayContainer>
            <Dday daysLeft={formatDeadlineDate(recruitmentDeadlineDate)} />
          </DdayContainer>
        </Link>
        <JobBookmarkContainer>
          <JobBookmark
            selected={careerStore.isBookmarked(uuid)}
            defaultColor={defaultColor}
            onClickEvent={() =>
              careerStore.toggleBookmark(uuid, isBookmarked, accessToken)
            }
          />
        </JobBookmarkContainer>
      </ThumbnailContainer>

      <Link href={`/careers/${uuid}`} passHref>
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
      </Link>
    </ThumbnailCardContainer>
  );
});
export default ThumbnailCard;
