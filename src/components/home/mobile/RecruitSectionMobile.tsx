import BagIcon from 'src/assets/icons/mentoring/[renewal]MentoringBagIcon.svg';
import { useRouter } from 'next/router';
import DropdownSelection from 'src/components/common/DropdownSelection';
import { useEffect, useState } from 'react';
import getMe from 'src/apis/user/getMe';
import {
  COOKIE_NS,
  COOKIE_NS_APPLE_OAUTH,
  COOKIE_NS_KAKAO_OAUTH
} from '@constants/common/cookie.constant';
import { useCookies } from 'react-cookie';
import getRecruitmentsByCursorNew from 'src/apis/recruitment-new/getRecruitmentsByCursorNew';
import { components } from 'src/types/api';
import Image from 'next/image';
import SectionHeaderMobile from './SectionHeaderMobile';
import NoticeIcon from 'src/assets/icons/home/NoticeIcon.svg';
import ArrowRightIcon from 'src/assets/icons/common/[renewal]RightArrowIcon.svg';
import { getDDay } from 'src/utils/getDDay';
import { useAICVRedirect } from 'src/hooks/useAICVRedirect';
import useAccessToken from 'src/hooks/useAcessToken';

const educationMap = {
  학사: 'BACHELOR',
  석사: 'MASTER',
  박사: 'DOCTOR'
} as const;

type EducationType = keyof typeof educationMap;
type RecruitmentViewDto = components['schemas']['RecruitmentViewDto'];
interface RecruitSectionProps {
  recruitList?: RecruitmentViewDto[] | null
  educationLevel?: EducationType
}

export default function RecruitSectionMobile(props: RecruitSectionProps) {
  const [educations, setEducations] = useState<EducationType>('석사');
  const [recruitmentList, setRecruitmentList] = useState<RecruitmentViewDto[]>();
  const accessToken = useAccessToken()
  const router = useRouter();

  useEffect(() => {
    async function getMy() {
      if (accessToken) {
        const myInfo = await getMe(accessToken);
        switch (myInfo.data?.studentType) {
          case 'MASTER':
            setEducations('석사');
            break;
          case 'PHD':
          case 'POSTDOCTOR':
          case 'PROFESSOR':
            setEducations('박사');
            break;
          case 'UNDERGRADUATE':
            setEducations('학사');
            break;
          default:
            setEducations('석사');
            break;
        }
      } else {
        setEducations('석사');
      }
    }
    getMy();
  }, [accessToken]);

  useEffect(() => {
    async function getRecruitList() {
      const response = await getRecruitmentsByCursorNew({
        count: 4,
        educations: [educationMap[educations]]
      });
      setRecruitmentList(response.data?.data);
    }
    getRecruitList();
  }, [educations]);

  return (
    <div className="flex flex-col w-full space-y-5">
      <SectionHeaderMobile
        icon={BagIcon}
        content={
          <div className="flex items-center gap-[8px]">
            <p className="whitespace-nowrap">나를 위한</p>
            <DropdownSelection
              options={['학사', '석사', '박사']}
              placeholder=""
              title=""
              optionTextStyle="text-gray-80 text-bold-14"
              onChange={v => setEducations(v as EducationType)}
              value={educations}
              iconSize={16}
            />
            <p className="whitespace-nowrap">채용소식</p>
          </div>
        }
        onClick={() => router.push('/careers')}
        navigateText="전체보기"
      />

      <div className="flex flex-col gap-4 w-full relative">
        {/* <div
          className="flex justify-between bg-gray-20 rounded-[8px] py-[12px] px-[16px] items-center cursor-pointer"
          onClick={() => window.open('https://litt.ly/bagstrap', '_blank')}
        >
          <div className="flex gap-[8px]">
            <NoticeIcon width={24} height={24} />
            <p className="text-semibold-12 text-gray-90 mt-[4px]">
              {'가방끈 고독한 채용공고방 참여하기!'}
            </p>
          </div>
          <ArrowRightIcon width={20} height={20} className="text-gray-50" />
        </div> */}
        {recruitmentList?.map(item => (
          <div
            key={item.uuid}
            className="flex w-full cursor-pointer items-start"
            onClick={() => router.push(`/careers/${item.uuid}`)}
          >
            {/* 썸네일 */}
            <div className="w-[64px] h-[64px] rounded-[12px] flex-shrink-0">
              {item.thumbnailUrl && (
                <Image
                  src={item.thumbnailUrl}
                  alt="recruitment thumbnail"
                  width={64}
                  height={64}
                  className="object-cover w-[64px] h-[64px] rounded-[12px]"
                />
              )}
            </div>

            {/* 오른쪽 텍스트 영역 */}
            <div className="flex flex-col flex-1 min-w-0 ml-3 space-y-1">
              {/* 회사명 */}
              <p className="text-gray-60 text-med-12">
                {item.recruitmentCompany?.companyName}
              </p>

              {/* 제목 라인: D-day + Title */}
              <div className="flex items-center gap-2 min-w-0">
                <span className="whitespace-nowrap text-gray-60 text-bold-14">
                  {getDDay(item.recruitmentDeadlineDate)}
                </span>
                <span className="truncate text-gray-90 text-bold-16">{item.title}</span>
              </div>

              {/* 뱃지 및 전공 정보 */}
              <div className="flex gap-[4px] w-full mt-[8px] items-center overflow-hidden whitespace-nowrap min-w-0 flex-1 truncate">
                {item.educations?.map(edu => (
                  <span
                    key={edu}
                    className="bg-bagstrap-10 text-semibold-10 px-[4px] py-[4px] rounded-[4px] items-center flex text-click"
                  >
                    {edu}
                  </span>
                ))}
                <div className="truncate text-med-12 text-gray-70 w-full">
                  {item.educations?.join(', ')} {item.jobs?.length ? ' | ' : ''}{' '}
                  {item.jobs?.join(' | ')}
                </div>
              </div>
            </div>

            {/* 북마크 아이콘 영역 (선택사항) */}
            {/* <div className="ml-auto">
        <BookmarkIcon />
      </div> */}
          </div>
        ))}
      </div>
    </div>
  );
}
