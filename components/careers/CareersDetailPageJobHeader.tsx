import { useEffect, useState } from 'react';

import Image from 'next/image';

import { observer } from 'mobx-react-lite';

import careerStore from '@stores/career.store';

import useAuthPayload from '@hooks/useAuthPayload.hook';
import useAuthGuard from '@hooks/useAuthGuard.hook';
import useCopyLink from '@hooks/useCopyLink';

import { formatDeadlineDate } from '@use-cases/careers/formatDeadlineDate';

import CareersMainType from '@mock/careers/types/careersMainType';

import LinkCopyToast from '@common/toast/LinkCopyToast';

import {
  CareersDetailPageJobHeaderContainer,
  CareersDetailPageJobHeaderTitleImageContainer,
  CareersDetailPageJobHeaderImageContainer,
  CareersDetailPageJobHeaderTitleSubText,
  CareersDetailPageJobHeaderTitleMainText,
  CareersDetailPageJobHeaderDdayAndActionContainer,
  CareersDetailPageJobHeaderFloatingDdayContainer,
  CareersDetailPageJobHeaderActionContainer,
  CareersDetailPageJobHeaderActionIconButton,
  CareersDetailPageJobHeaderFloatingDdayTitle,
  CareersDetailPageJobHeaderFloatingDdayLine,
  CareersDetailPageJobHeaderFloatingDdayText
} from './CareersDetailPageJobHeader.style';

const CareersDetailPageJobHeader = observer(
  ({ jobData }: { jobData: CareersMainType }) => {
    const [authGuardModalDialogEl, passed] = useAuthGuard(true);

    const [showModal, setShowModal] = useState(false);

    const authPayload = useAuthPayload();

    const accessToken = authPayload?.access_token || '';

    const handleBookmarkClick = () => {
      if (!passed) {
        setShowModal(true);
        return;
      }

      careerStore.toggleBookmark(jobData.uuid, jobData.isBookmarked, accessToken);
    };

    const { copyLink, copied } = useCopyLink();

    useEffect(() => {
      careerStore.setBookmark(jobData.uuid, jobData.isBookmarked);
    }, [jobData.uuid, jobData.isBookmarked]);

    return (
      <CareersDetailPageJobHeaderContainer>
        <CareersDetailPageJobHeaderTitleImageContainer>
          <CareersDetailPageJobHeaderImageContainer>
            <Image
              src={
                jobData?.thumbnailUrl ||
                (jobData.recruitmentJobs &&
                Object.keys(jobData.recruitmentJobs).length > 0
                  ? `/assets/[career]thumbnail_${Object.keys(jobData.recruitmentJobs)[0]}.png`
                  : '/assets/[career]thumbnail_accounting.png')
              }
              alt="로고 이미지"
              fill
              style={{ objectFit: 'contain' }}
            />
          </CareersDetailPageJobHeaderImageContainer>
          <CareersDetailPageJobHeaderTitleSubText>
            {jobData?.companyName}
          </CareersDetailPageJobHeaderTitleSubText>
          <CareersDetailPageJobHeaderTitleMainText>
            {jobData?.title}
          </CareersDetailPageJobHeaderTitleMainText>
        </CareersDetailPageJobHeaderTitleImageContainer>
        <CareersDetailPageJobHeaderDdayAndActionContainer>
          <CareersDetailPageJobHeaderActionContainer>
            <CareersDetailPageJobHeaderActionIconButton onClick={handleBookmarkClick}>
              <Image
                src={
                  careerStore.isBookmarked(jobData.uuid)
                    ? '/icons/bookmark-yellow.svg'
                    : '/icons/bookmark-gray-600.svg'
                }
                alt="북마크 아이콘"
                width={24}
                height={24}
              />
            </CareersDetailPageJobHeaderActionIconButton>
            <CareersDetailPageJobHeaderActionIconButton onClick={() => copyLink()}>
              <Image src="/icons/share.svg" alt="공유 아이콘" width={24} height={24} />
            </CareersDetailPageJobHeaderActionIconButton>
            <LinkCopyToast message="링크가 복사되었습니다!" isVisible={copied} />
          </CareersDetailPageJobHeaderActionContainer>
          <CareersDetailPageJobHeaderFloatingDdayContainer>
            <CareersDetailPageJobHeaderFloatingDdayTitle>
              지원 마감
            </CareersDetailPageJobHeaderFloatingDdayTitle>
            <CareersDetailPageJobHeaderFloatingDdayLine />
            <CareersDetailPageJobHeaderFloatingDdayText>
              D-
              {formatDeadlineDate(jobData?.recruitmentDeadlineDate ?? '')}
            </CareersDetailPageJobHeaderFloatingDdayText>
          </CareersDetailPageJobHeaderFloatingDdayContainer>
        </CareersDetailPageJobHeaderDdayAndActionContainer>
        {showModal && authGuardModalDialogEl}
      </CareersDetailPageJobHeaderContainer>
    );
  }
);

export default CareersDetailPageJobHeader;
