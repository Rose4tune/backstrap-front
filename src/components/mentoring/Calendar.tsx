import FillButton from '@common/button/FillButton';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { components } from 'src/types/api';
import DeleteIcon from 'src/assets/icons/common/[renewal]DeleteIcon.svg';
import RightArrowIcon from 'src/assets/icons/common/[renewal]RightArrowIcon.svg';
import LeftArrowIcon from 'src/assets/icons/common/[renewal]LeftArrowIcon.svg';
import clsx from 'clsx';
import mixpanel from 'mixpanel-browser';
import useAccessToken from 'src/hooks/useAcessToken';
import DiscountPopupwithoutLogin from './mentoringDetailPageComponents/DiscountPopupwithoutLogin';
import CouponPopupOnlyMembership from './mentoringDetailPageComponents/CouponPopupOnlyMembership';
import { handleTimeToggleLogic } from 'src/utils/handleTimeToggleLogic';

type MentorViewDto = components['schemas']['MentorViewDto'];

interface CalendarDto {
  mentorInfo?: MentorViewDto | null;
  price: number;
  originPrice: number;
}

/**한국날짜로 보정하는 함수 */
function toKSTDateString(date: Date): string {
  // 한국은 UTC+9시간 = 9 * 60 * 60 * 1000 ms
  const KST_OFFSET = 9 * 60 * 60 * 1000;
  const kstDate = new Date(date.getTime() + KST_OFFSET);
  return kstDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'
}

export default function Calendar({ mentorInfo, price, originPrice }: CalendarDto) {
  const today = new Date(); //오늘 지정
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0); // 0: this month, 1: next, 2: next next
  const [focusedDate, setFocusedDate] = useState<Date | null>(null); //현재 선택된 날짜
  const [selectedDateTimes, setSelectedDateTimes] = useState<Record<string, string[]>>(
    {}
  ); // {date: [time A, timeB]} 구조
  const accessToken = useAccessToken();
  const router = useRouter();

  //오늘 월 보여주기
  const shownMonth = new Date(
    today.getFullYear(),
    today.getMonth() + currentMonthIndex,
    1
  );

  const startDayofMonth = shownMonth.getDay(); // 0(Sunday)~6(Saturday)

  const canGoPrev = currentMonthIndex > 0; //전 달 있는지 여부

  const canGoNext = currentMonthIndex < 2; //다음달 있는지 여부

  const handleTimeToggle = (date: string, time: string) => {
    setSelectedDateTimes(prev => handleTimeToggleLogic(prev, date, time));
  };

  //한 주 단위로 렌더링
  const renderWeeks = () => {
    const weeks = []; //주 단위로 묶음
    const emptySlotFirstWeek = startDayofMonth === 0 ? 6 : startDayofMonth - 1; //첫 주 시작 요일 고려
    let days: JSX.Element[] = []; //배열에 날짜 담음

    // 첫 주 빈 날짜 담기
    for (let i = 0; i < emptySlotFirstWeek; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="flex flex-1 items-center justify-center h-[44px]"
        />
      );
    }

    //현재 월에 해당하는 날짜 수
    const daysInMonth = new Date(
      shownMonth.getFullYear(),
      shownMonth.getMonth() + 1,
      0
    ).getDate();

    //같은 날짜인지 판별해주는 함수
    const isSameDay = (d1: Date, d2: Date) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    //disable 표시
    const isDisabled = (day: number) => {
      const date = new Date(shownMonth.getFullYear(), shownMonth.getMonth(), day);
      const dateStr = toKSTDateString(date); // YYYY-MM-DD

      // 오늘 이전 날짜 → 무조건 disabled
      const isPast =
        date < new Date(today.getFullYear(), today.getMonth(), today.getDate());

      // availableDatesSet에 포함되지 않으면 disabled
      const notAvailable = !availableDatesSet.has(dateStr);

      return isPast || notAvailable;
    };

    //가능한 날짜 모음
    const availableDatesSet = new Set(
      mentorInfo?.availableSlots?.map(slot => slot.date).filter(Boolean) // null/undefined 제거
    );

    //한 달 실제 날짜들 담기
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(shownMonth.getFullYear(), shownMonth.getMonth(), i);
      const isPast = isDisabled(i);
      const isSelected = focusedDate ? isSameDay(date, focusedDate) : false;

      days.push(
        <button
          key={i}
          disabled={isPast}
          onClick={() => {
            mixpanel.track('click_mentor_date', { view: `${mentorInfo?.uuid}` });
            setFocusedDate(date);
          }}
          style={{
            color: isPast ? '#C9CED8' : isSelected ? '#22C6BB' : 'black'
          }}
          className={`flex flex-1 h-[44px] rounded-full items-center justify-center ${isPast ? 'text-med-16' : isSelected ? 'text-bold-20 bg-bagstrap-10' : 'hover:bg-gray-100'} `}
        >
          {i}
        </button>
      );

      //한주 완성되었으면 week 배열에 담기
      if (days.length === 7) {
        weeks.push(
          <div key={`week-${i}`} className="flex w-full h-[44px]">
            {days}
          </div>
        );
        days = [];
      }
    }

    if (days.length > 0) {
      //마지막 주 빈 날짜 담아서 week에 push
      while (days.length < 7) {
        days.push(<div key={`pad-${days.length}`} className="flex-1 h-[44px]" />);
      }
      weeks.push(
        <div key="last-week" className="flex w-full">
          {days}
        </div>
      );
    }

    return weeks;
  };

  //selectedDate 한국날짜로 기준 통일
  const focusedDateString = focusedDate ? toKSTDateString(focusedDate) : null;
  //가능한 시간대 뽑기
  const availableTimes =
    focusedDateString && mentorInfo?.availableSlots
      ? mentorInfo.availableSlots
          .filter(slot => slot.date === focusedDateString)
          .map(slot => slot.time)
          .filter(Boolean) // null 제거
      : [];

  /**선택한 시간대 평탄화 : {date:"", time:""}[] */
  const flattenedSelectionTimes = Object.entries(selectedDateTimes).flatMap(
    ([date, times]) =>
      times.map(time => ({
        date,
        time
      }))
  );

  return (
    <div className="w-[400px]">
      {/* Title and Navigation */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-bold-20 text-black flex gap-[4px] items-center">
          {`${shownMonth.getFullYear()}년 ${shownMonth.getMonth() + 1}월`}
        </div>
        <div className="flex" style={{ gap: '28px' }}>
          <button
            disabled={!canGoPrev}
            onClick={() => {
              mixpanel.track('click_date_back', { view: `${mentorInfo?.uuid}` });
              setCurrentMonthIndex(currentMonthIndex - 1);
            }}
            className={clsx('flex', !canGoPrev && 'opacity-30 cursor-not-allowed')}
          >
            <LeftArrowIcon width={24} height={24} className="text-gray-50" />
          </button>
          <button
            disabled={!canGoNext}
            onClick={() => {
              mixpanel.track('click_date_more', { view: `${mentorInfo?.uuid}` });
              setCurrentMonthIndex(currentMonthIndex + 1);
            }}
            className={clsx('flex', !canGoNext && 'opacity-30 cursor-not-allowed')}
          >
            <RightArrowIcon width={24} height={24} className="text-gray-50" />
          </button>
        </div>
      </div>

      {/* Weekday header */}
      <div className="flex text-[13px] text-gray-50 pt-[24px]">
        {['월', '화', '수', '목', '금', '토', '일'].map(day => (
          <div key={day} className="flex-1 text-center">
            {day}
          </div>
        ))}
      </div>

      {/* Dates */}
      <div className="flex flex-1 flex-col w-full">{renderWeeks()}</div>
      {/* Time slots */}
      {focusedDateString ? (
        <>
          <div
            className="flex flex-1 flex-wrap gap-[12px]"
            style={{ marginTop: '24px', marginBottom: '24px' }}
          >
            {availableTimes.map((time, idx) => {
              const displayTime = time?.split(':').slice(0, 2).join(':');
              //선택된 시간대인지 체크
              const isSelectedTime = selectedDateTimes[focusedDateString]?.includes(
                time as string
              );
              return (
                <button
                  key={idx}
                  className={`border-[1px]`}
                  style={{
                    borderColor: isSelectedTime ? '#10E4D5' : '#F8F8FB',
                    backgroundColor: isSelectedTime ? '#EBFCFB' : 'transparent',
                    borderRadius: '8px',
                    padding: '8px 12px'
                  }}
                  onClick={() => {
                    mixpanel.track('click_mentor_time', { view: `${mentorInfo?.uuid}` });
                    handleTimeToggle(focusedDateString, time as string);
                  }}
                >
                  <div
                    className="text-med-16"
                    style={{ color: isSelectedTime ? '#22C6BB' : 'black' }}
                  >
                    {displayTime}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex flex-1 mt-[20px]">
          <FillButton
            buttonStatus={'disable'}
            size={'Large'}
            text={'날짜를 선택해주세요'}
          />
        </div>
      )}
      {flattenedSelectionTimes.length > 0 && (
        <>
          <div className="flex justify-between">
            <p className="text-bold-16 flex gap-[4px] mb-2">
              <p className="text-black">멘토링 1회권(60분) </p>
              <p className="text-gray-60">X{flattenedSelectionTimes.length}</p>
            </p>
            <p className="text-bold-16 text-black">
              {originPrice === price
                ? (originPrice * flattenedSelectionTimes.length)?.toLocaleString() + '원'
                : (price * flattenedSelectionTimes.length).toLocaleString() + '원'}
            </p>
          </div>

          {flattenedSelectionTimes
            // 선택된 시간에 대해 시간순 정렬
            .sort((a, b) => Number(a.time.split(':')[0]) - Number(b.time.split(':')[0]))
            // 컴포넌트와 매핑
            .map(({ date, time }, idx) => (
              <div
                key={`${date}-${time}-${idx}`}
                className="flex justify-between items-center mb-1"
              >
                <p className="text-med-16 text-gray-60">
                  {date} {time.split(':').slice(0, 2).join(':')}
                </p>
                <button
                  onClick={() => {
                    mixpanel.track('click_delete_time', { view: `${mentorInfo?.uuid}` });
                    handleTimeToggle(date, time);
                  }}
                >
                  <DeleteIcon width={20} height={20} className="text-gray-60" />
                </button>
              </div>
            ))}
        </>
      )}
      {/* focusedDate만 있고 시간이 없는 경우 */}
      {focusedDate && flattenedSelectionTimes.length === 0 && (
        <div className="flex flex-1 justify-center mt-[20px]">
          <FillButton
            buttonStatus={'disable'}
            size={'Large'}
            text={'시간을 선택해주세요'}
          />
        </div>
      )}
      {/* 비회원/회원에 대한 로그인 유도 */}
      {flattenedSelectionTimes.length > 0 && !accessToken ? (
        <div className="mt-[40px] flex justify-center">
          <DiscountPopupwithoutLogin />
        </div>
      ) : flattenedSelectionTimes.length && price != originPrice ? (
        <div className="mt-[40px] flex justify-center">
          <CouponPopupOnlyMembership />
        </div>
      ) : (
        <></>
      )}
      {flattenedSelectionTimes.length > 0 && (
        <div className="flex flex-1 justify-center mt-[20px]">
          <FillButton
            onClick={() => {
              mixpanel.track('click_mentor_topay', { view: `${mentorInfo?.uuid}` });
              // 선택 시간들을 sessionStorage에 저장
              sessionStorage.setItem(
                'mentoring-time-selection',
                JSON.stringify(flattenedSelectionTimes)
              );
              router.push({
                pathname: '/mentoring/payments',
                query: {
                  uuid: mentorInfo?.uuid
                }
              });
            }}
            buttonStatus={'active'}
            size={'Large'}
          >
            <p className="flex gap-[4px]">
              <p className="text-bold-16 text-white">멘토링 신청하기</p>
            </p>
          </FillButton>
        </div>
      )}
    </div>
  );
}
