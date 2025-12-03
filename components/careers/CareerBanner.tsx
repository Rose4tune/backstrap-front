import Image from 'next/image';

import Slider from 'react-slick';

import {
  BannerInfoConatiner,
  BannerSubtitle,
  BannerTitle,
  CareeerBannerContainer,
  CareerBannerImage,
  BannerTitleContainer,
  BannerLogoContainer,
  BannerTitleStrong,
  BannerSubtitleTop,
  BannerSubtitleHighlight,
  BannerBackgroundImageContainer,
  BannerBackgroundImageStudent,
  BannerBackgroundImageBriefcase
} from './CareerBanner.style';

const CareerBanner = () => {
  // const settings = {
  //   dots: false,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   autoplay: false,
  //   autoplaySpeed: 3000,
  //   arrows: false
  // };
  return (
    <CareeerBannerContainer>
      {/* <Slider {...settings}> */}
      {/* {items.map(el => ( */}
      <CareerBannerImage>
        <BannerInfoConatiner>
          <BannerTitleContainer>
            <BannerLogoContainer>
              <Image src={'/logos/logo-bagstrap-symbol-new.svg'} alt="로고 이미지" fill />
            </BannerLogoContainer>
            <BannerTitle>
              대학원 입학부터 졸업까지, <BannerTitleStrong>가방끈</BannerTitleStrong>
            </BannerTitle>
          </BannerTitleContainer>
          <BannerSubtitle>
            <BannerSubtitleTop>
              <BannerSubtitleHighlight>석박사 채용공고</BannerSubtitleHighlight>까지
              <BannerBackgroundImageContainer>
                <BannerBackgroundImageStudent>
                  <Image src={'/icons/student.svg'} alt="학생 아이콘" fill />
                </BannerBackgroundImageStudent>
                <BannerBackgroundImageBriefcase>
                  <Image src={'/icons/briefcase.svg'} alt="서류 가방 아이콘" fill />
                </BannerBackgroundImageBriefcase>
              </BannerBackgroundImageContainer>
            </BannerSubtitleTop>
            <br />
            가방끈에서 찾고 지원해보세요!
          </BannerSubtitle>
        </BannerInfoConatiner>
      </CareerBannerImage>
      {/* ))} */}
      {/* </Slider> */}
    </CareeerBannerContainer>
  );
};
export default CareerBanner;
