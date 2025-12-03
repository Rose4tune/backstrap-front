import BagIcon from 'src/assets/icons/mentoring/[renewal]MentoringBagIcon.svg';
import { useRouter } from 'next/router';
import DropdownSelection from 'src/components/common/DropdownSelection';
import SectionHeaderDesktop from './SectionHeaderDesktop';
import { useEffect, useState, useRef } from 'react';
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
import { getDDay } from 'src/utils/getDDay';

const educationMap = {
  학사: 'BACHELOR',
  석사: 'MASTER',
  박사: 'DOCTOR'
} as const;

type EducationType = keyof typeof educationMap;
type RecruitmentViewDto = components['schemas']['RecruitmentViewDto'];

interface RecruitSectionProps {
  recruitList: RecruitmentViewDto[] | null | undefined;
  educationLevel: EducationType | undefined
}
export default function RecruitSectionDesktop(props: RecruitSectionProps) {
  const { recruitList, educationLevel } = props
  const [educations, setEducations] = useState<EducationType>(educationLevel || '석사');
  const [recruitmentList, setRecruitmentList] = useState<RecruitmentViewDto[]>(recruitList || []);
  const [cookies] = useCookies();
  const accessToken =
    cookies[COOKIE_NS]?.authPayload?.access_token ||
    cookies[COOKIE_NS_APPLE_OAUTH]?.authPayload?.access_token ||
    cookies[COOKIE_NS_KAKAO_OAUTH]?.authPayload?.access_token;
  const router = useRouter();

  // Scroll state management
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
        count: 7,
        educations: [educationMap[educations]]
      });
      setRecruitmentList(response.data?.data as RecruitmentViewDto[]);
    }
    getRecruitList();
  }, [educations]);

  // Update scroll button visibility
  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Handle scroll navigation
  const scrollLeft = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Initialize scroll state and add event listeners
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    // Initial state
    updateScrollButtons();

    // Add scroll event listener
    scrollContainer.addEventListener('scroll', updateScrollButtons);

    // Add resize listener to handle window size changes
    window.addEventListener('resize', updateScrollButtons);

    return () => {
      scrollContainer.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [recruitmentList]);

  return (
    <div className="flex flex-col w-full space-y-5">
      <SectionHeaderDesktop
        icon={BagIcon}
        content={
          <div className="flex items-center gap-[8px] flex-shrink-0">
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

      {/* Scroll container with navigation arrows */}
      <div className='relative'>
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className='absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105'
            aria-label='이전 채용소식 보기'
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-700">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className='absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105'
            aria-label='다음 채용소식 보기'
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-700">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          className="flex w-full gap-4 overflow-x-scroll scrollbar-hide"
          style={{ scrollbarWidth: 'none' }}
        >
          {recruitmentList?.map(item => {
            return (
              <div
                key={item.uuid}
                className="flex flex-col cursor-pointer flex-shrink-0"
                onClick={() => router.push(`/careers/${item.uuid}`)}
              >
                {/* 썸네일 + D-day */}
                <div className="w-[308px] h-[200px] rounded-[16px] overflow-hidden relative">
                  {item.thumbnailUrl && (
                    <Image
                      src={item.thumbnailUrl}
                      alt="recruitment thumbnail"
                      width={308}
                      height={200}
                      className="object-cover w-[308px] h-[200px]"
                    />
                  )}
                  <div className="absolute top-[12px] left-[12px] bg-white text-gray-90 text-bold-12 px-[8px] py-[2px] rounded-[4px]">
                    {getDDay(item.recruitmentDeadlineDate)}
                  </div>
                </div>
                {/* 텍스트 영역 */}
                <div className="w-[308px] px-[4px] mt-[12px]">
                  <p className="text-gray-60 text-med-12">
                    {item.recruitmentCompany?.companyName}
                  </p>
                  <p className="text-gray-90 text-bold-16 truncate">{item.title}</p>
                  <div className="flex flex-wrap gap-[4px] mt-[8px] items-center">
                    {item.educations?.map(edu => (
                      <span
                        key={edu}
                        className="bg-bagstrap-10 text-bold-12 px-[6px] py-[4px] rounded-[4px] items-center flex text-click"
                      >
                        {edu}
                      </span>
                    ))}
                    {item.jobs?.map((job, idx) => (
                      <span key={job} className="text-gray-70 text-med-12">
                        {job}
                        {idx < (item.jobs || []).length - 1 && (
                          <span className="mx-[4px] text-gray-70">|</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
