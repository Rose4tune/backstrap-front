import Link from 'next/link';
import Image from 'next/image';

import {
  PopularRecruitmentSectionContainer,
  PopularRecruitmentSectionText,
  PopularRecruitmentSectionList,
  PopularRecruitmentSectionListItem,
  PopularRecruitmentSectionPlusButton
} from './PopularRecruitmentSection.style';

const PopularRecruitmentSection = () => {
  return (
    <Link href="/careers/all" passHref>
      <PopularRecruitmentSectionContainer>
        <PopularRecruitmentSectionText>
          다른 인기 공고를 확인해보세요!
        </PopularRecruitmentSectionText>
        <PopularRecruitmentSectionList>
          <PopularRecruitmentSectionListItem>
            <Image
              src="/images/logo-hyundai.png"
              alt="현대 자동차 로고 이미지"
              width={34}
              height={34}
            />
          </PopularRecruitmentSectionListItem>
          <PopularRecruitmentSectionListItem>
            <Image
              src="/images/logo-sk.png"
              alt="sk 로고 이미지"
              width={34}
              height={34}
            />
          </PopularRecruitmentSectionListItem>
          <PopularRecruitmentSectionListItem>
            <Image
              src="/images/logo-samsung.png"
              alt="삼성 로고 이미지"
              width={34}
              height={34}
            />
          </PopularRecruitmentSectionListItem>
          <PopularRecruitmentSectionListItem>
            <Image
              src="/images/logo-lg.png"
              alt="lg 로고 이미지"
              width={34}
              height={34}
            />
          </PopularRecruitmentSectionListItem>
          <PopularRecruitmentSectionListItem>
            <Image
              src="/images/logo-kakao.png"
              alt="카카오 로고 이미지"
              width={34}
              height={34}
            />
          </PopularRecruitmentSectionListItem>
          <PopularRecruitmentSectionPlusButton>+</PopularRecruitmentSectionPlusButton>
        </PopularRecruitmentSectionList>
      </PopularRecruitmentSectionContainer>
    </Link>
  );
};

export default PopularRecruitmentSection;
