import Head from 'next/head';
import type { GetServerSidePropsContext, NextPage } from 'next';
import { useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import BottomBanner from 'src/components/home/BottomBanner';
import { YoutubeSectionDesktop } from 'src/components/home/desktop/YouTubeSectionDesktop';
import { YoutubeSectionMobile } from 'src/components/home/mobile/YouTubeSectionMobile';
import RecruitSectionDesktop from 'src/components/home/desktop/RecruitSectionDesktop';
import RecruitSectionMobile from 'src/components/home/mobile/RecruitSectionMobile';
import HotRecruitSectionDesktop from 'src/components/home/desktop/HotRecruitSectionDesktop';
import LabGuideSectionDesktop from 'src/components/home/desktop/LabGuideSectionDesktop';
import SchoolUserLankDesktop from 'src/components/home/desktop/SchoolUserLankDesktop';
import InformationSectionDesktop from 'src/components/home/desktop/InformationSectionDesktop';
import HelpSectionDesktop from 'src/components/home/desktop/HelpSectionDesktop';
import BestPostSectionDesktop from 'src/components/home/desktop/BestPostSectionDesktop';
import getYoutubeUrls from 'src/apis/home/getYoutubeUrls';
import LabGuideSectionMobile from 'src/components/home/mobile/LabGuideSectionMobile';
import BestPostSectionMobile from 'src/components/home/mobile/BestPostSectionMobile';
import BoardRouterSectionMobile from 'src/components/home/mobile/BoardRouterSectionMobile';
import {
  COOKIE_NS,
  COOKIE_NS_APPLE_OAUTH,
  COOKIE_NS_KAKAO_OAUTH
} from '@constants/common/cookie.constant';
import getBannersByType from 'src/apis/banner/getBannersByType';
import { components } from 'src/types/api';
import TopSection from './TopSection';
import getTopFixedBoard from 'src/apis/board/getTopFix';
import getBoardsByPaging from 'src/apis/board/getByPaging';
import { ButtonEnumMap } from 'src/types/textbuttonType';
import getMe from 'src/apis/user/getMe';
import { IncomingMessage } from 'http';
import getRecruitmentsByCursorNew from 'src/apis/recruitment-new/getRecruitmentsByCursorNew';
import { parse } from 'cookie';
import SchoolUserLankMobile from 'src/components/home/mobile/SchoolUserRankMobile';
import GlobalHeader from 'src/components/header/GlobalHeader';
import Footer from 'elements/Footer';
import MobileHomeHeader from 'src/components/home/mobile/MobileHomeHeader';

type GetYoutubeUrlsResponse = string[] | null;

type BannerViewDto = components['schemas']['BannerViewDto']
type RecruitmentViewDto = components['schemas']['RecruitmentViewDto'];
type BoardViewDto = components['schemas']['BoardEntityView']
const educationMap = {
  학사: 'BACHELOR',
  석사: 'MASTER',
  박사: 'DOCTOR'
} as const;
type EducationType = keyof typeof educationMap;


export interface IndexPageProps {
  topFixNotice?: BoardViewDto
  bestSectionList?: BoardViewDto[]
  informationSectionList?: BoardViewDto[];
  educationLevel?: EducationType
  recruitList?: RecruitmentViewDto[] | null;
  youtubeList?: GetYoutubeUrlsResponse;
  bigBanners?: BannerViewDto[] | null;
  smallBanners?: BannerViewDto[] | null;
  hotRecruitList?: RecruitmentViewDto[] | null;
}

// @ts-ignore
const IndexPage: NextPage<IndexPageProps> = ({
  topFixNotice,
  bestSectionList,
  informationSectionList,
  educationLevel,
  recruitList,
  youtubeList,
  bigBanners,
  smallBanners,
  hotRecruitList
}) => {
  //BottomBannerType 기기 종류에 따라 CSR 렌더링
  const isMobile = useMediaQuery('(max-width:550px)');
  const [imageUrl, setImageUrl] = useState<string>();
  const [clickLink, setClickLink] = useState<string>();
  useEffect(() => {
    async function getBottomBanner() {
      try {
        const result = isMobile ? await getBannersByType('BOTTOM_MOBILE') : await getBannersByType('BOTTOM')
        if (result.success && result.data) {
          setImageUrl(result.data?.[0].imageUrl);
          setClickLink(result.data?.[0].actionValue);
        }
      } catch (err) {

      }
    }
    getBottomBanner();
  });
  return (
    <>
      <Head>
        <link rel="canonical" href="https://www.bagstrap.team/" key="canonical" />
      </Head>

      {/* mobile 버전 : max-width-450px*/}
      {isMobile && (
        <div>
          <MobileHomeHeader />
          <TopSection bigBanners={bigBanners} smallBanners={smallBanners} />
          <div className='mb-3' />
          <div className="space-y-3 pb-[50px] max-w-[550px] mx-auto px-[20px]">
            <BoardRouterSectionMobile />
            <BestPostSectionMobile bestPostList={bestSectionList} />
            <LabGuideSectionMobile />
            <SchoolUserLankMobile />
            <RecruitSectionMobile recruitList={recruitList} educationLevel={educationLevel} />
            {/* {needSurvey && <SurveyModal setNeedSurvey={setNeedSurvey} />} */}
          </div>
          <YoutubeSectionMobile youtubeList={youtubeList?.slice(0, 4)} />

          {imageUrl && clickLink && <BottomBanner imageUrl={imageUrl} clickLink={clickLink} />
          }
        </div>
      )}
      {/* desktop 버전 */}
      {
        !isMobile && (
          <div className="flex flex-col w-full min-w-[1440px] max-w-[1920px] mx-auto">
            <GlobalHeader />
            <div className="flex flex-1 flex-col space-y-10 pt-[28px] px-[20px] pb-[40px] min-w-[1280px] max-w-[1440px] mx-auto">
              <TopSection bigBanners={bigBanners} smallBanners={smallBanners} />
              <div className="flex gap-[20px]">
                <BestPostSectionDesktop bestPostList={bestSectionList} />
                <InformationSectionDesktop fixNotice={topFixNotice} postList={informationSectionList} />
                <HelpSectionDesktop />
              </div>
              <div className="flex gap-[30px]">
                <LabGuideSectionDesktop />
                <SchoolUserLankDesktop />
              </div>
              <HotRecruitSectionDesktop hotRecruitList={hotRecruitList} />
              <RecruitSectionDesktop recruitList={recruitList} educationLevel={educationLevel} />
              <YoutubeSectionDesktop youtubeList={youtubeList} />
              {imageUrl && clickLink && <BottomBanner imageUrl={imageUrl} clickLink={clickLink} />}
            </div>
            <Footer />
          </ div >

        )
      }
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const accessToken = getAccessTokenFromCookies(context.req);
  const educationMap = {
    학사: 'BACHELOR',
    석사: 'MASTER',
    박사: 'DOCTOR'
  } as const;
  type EducationType = keyof typeof educationMap;


  const [
    bigBannerRes,
    smallBannerRes,
    topFixNoticeRes,
    bestSectionListRes,
    informationSectionListRes,
    myInfoRes,
    youtubeRes
  ] = await Promise.all([
    getBannersByType('BIG'),
    getBannersByType('SMALL'),
    getTopFixedBoard(),
    getBoardsByPaging({
      sortType: ButtonEnumMap['IF 높은 끈'],
      paginationRequestDto: { count: 7 }
    }),
    getBoardsByPaging({
      groupUuid: 'hifnflwnqw',
      paginationRequestDto: { count: 7 }
    }),
    accessToken ? getMe(accessToken) : Promise.resolve(null),
    getYoutubeUrls(),
  ]);
  const educations = mapStudentTypeToEducation(myInfoRes?.data?.studentType);
  const recruitListRes = await getRecruitmentsByCursorNew({
    count: 7,
    educations: [educationMap[educations as EducationType]]
  });
  const hotRecruitListRes = await getRecruitmentsByCursorNew({
    count: 7,
    isHot: true
  });

  return {
    props: {
      bigBanners: bigBannerRes.success ? bigBannerRes.data : [],
      smallBanners: smallBannerRes.success ? smallBannerRes.data : [],
      topFixNotice: topFixNoticeRes.success ? topFixNoticeRes.data : null,
      bestSectionList: bestSectionListRes.success ? bestSectionListRes.data?.data : [],
      informationSectionList: informationSectionListRes.success ? informationSectionListRes.data?.data : [],
      educationLevel: educations,
      recruitList: recruitListRes.success ? recruitListRes.data?.data : [],
      youtubeList: youtubeRes.success ? youtubeRes.data : [],
      hotRecruitList: hotRecruitListRes.success ? hotRecruitListRes.data?.data : []
    }
  };
}

export function getAccessTokenFromCookies(req: IncomingMessage): string | null {
  const cookieHeader = req.headers.cookie || '';
  const cookies = parse(cookieHeader) as Record<string, any>;

  try {
    const getPayload = (cookie: string) => JSON.parse(decodeURIComponent(cookie)).authPayload?.access_token;

    return (
      (cookies[COOKIE_NS] && getPayload(cookies[COOKIE_NS])) ||
      (cookies[COOKIE_NS_APPLE_OAUTH] && getPayload(cookies[COOKIE_NS_APPLE_OAUTH])) ||
      (cookies[COOKIE_NS_KAKAO_OAUTH] && getPayload(cookies[COOKIE_NS_KAKAO_OAUTH])) ||
      null
    );
  } catch (e) {
    console.warn('Failed to parse cookie', e);
    return null;
  }
}

function mapStudentTypeToEducation(type?: string): string {
  switch (type) {
    case 'MASTER': return '석사';
    case 'PHD':
    case 'POSTDOCTOR':
    case 'PROFESSOR':
      return '박사';
    case 'UNDERGRADUATE':
      return '학사';
    default:
      return '석사';
  }
}

export default IndexPage