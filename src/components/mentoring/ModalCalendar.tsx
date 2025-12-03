import React, { ReactNode, useState } from 'react';
import clsx from 'clsx';
import LeftArrowIcon from 'src/assets/icons/common/[renewal]LeftArrowIcon.svg';
import RightArrowIcon from 'src/assets/icons/common/[renewal]RightArrowIcon.svg';
import { components } from 'src/types/api';
import { useRouter } from 'next/router';
import FillButton from '@common/button/FillButton';
import DeleteIcon from 'src/assets/icons/common/[renewal]DeleteIcon.svg';
import mixpanel from 'mixpanel-browser';
import { handleTimeToggleLogic } from 'src/utils/handleTimeToggleLogic';

type MentorViewDto = components['schemas']['MentorViewDto'];
type MentorAvailableSlotDto = components['schemas']['MentorAvailableSlotDto'];
interface ModalCalendarProps {
  isOpen: boolean;
  onClose: () => void;
  mentorInfo?: MentorViewDto | null;
  price: number;
  originPrice: number;
}

//Todo: 유저 로그인에 따라 쿠폰 할인 팝업 띄우기
export default function ModalCalendar({
  isOpen,
  onClose,
  mentorInfo,
  price,
  originPrice
}: ModalCalendarProps) {
  const today = new Date(); //오늘 지정
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0); // 0: this month, 1: next, 2: next next
  const [focusedDate, setFocusedDate] = useState<Date | null>(null); //현재 선택된 날짜
  const [selectedDateTimes, setSelectedDateTimes] = useState<Record<string, string[]>>(
    {}
  ); // {date: [time A, timeB]} 구조
  const router = useRouter();

  /**한국날짜로 보정하는 함수 */
  function toKSTDateString(date: Date): string {
    // 한국은 UTC+9시간 = 9 * 60 * 60 * 1000 ms
    const KST_OFFSET = 9 * 60 * 60 * 1000;
    const kstDate = new Date(date.getTime() + KST_OFFSET);
    return kstDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  }

  //오늘 월 보여주기
  const shownMonth = new Date(
    today.getFullYear(),
    today.getMonth() + currentMonthIndex,
    1
  );

  //현재 월에 해당하는 날짜 수
  const daysInMonth = new Date(
    shownMonth.getFullYear(),
    shownMonth.getMonth() + 1,
    0
  ).getDate();

  const startDayofMonth = shownMonth.getDay(); // 0(Sunday)~6(Saturday)

  const canGoPrev = currentMonthIndex > 0; //전 달 있는지 여부

  const canGoNext = currentMonthIndex < 2; //다음달 있는지 여부

  const handleTimeToggle = (date: string, time: string) => {
    setSelectedDateTimes(prev => handleTimeToggleLogic(prev, date, time));
  };

  //가능한 날짜 모음
  const availableDatesSet = new Set(
    mentorInfo?.availableSlots?.map(slot => slot.date).filter(Boolean) // null/undefined 제거
  );
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

  //같은 날짜인지 판별해주는 함수
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  //한 주 단위로 렌더링
  const renderWeeks = () => {
    const weeks: ReactNode[] = []; //주 단위로 묶음
    const emptySlotFirstWeek = startDayofMonth === 0 ? 6 : startDayofMonth - 1; //첫 주 시작 요일 고려
    let days: ReactNode[] = []; //배열에 날짜 담음

    // 첫 주 빈 날짜 담기
    for (let i = 0; i < emptySlotFirstWeek; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="flex flex-1 items-center justify-center h-[44px]"
        />
      );
    }

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
    // modal에 대한 css처리

    <div
      className={`mx-auto max-w-[550px] flex fixed inset-0 bg-black bg-opacity-40 justify-center items-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      {/* 모달 내부 padding 처리 시도 but 안먹음 */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          paddingTop: '24px',
          paddingBottom: '24px',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px'
        }}
        className={`flex flex-col bg-white px-[32px] max-h-[600px] w-full transition-transform duration-300 ${isOpen ? 'translate-y-100 ease-out' : 'translate-y-full ease-in'}`}
      >
        {/* Calendar 내부 */}
        <div className="w-full">
          {/* Title and Navigation */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-bold-16 text-black flex gap-[4px] items-center">
              {`${shownMonth.getFullYear()}년 ${shownMonth.getMonth() + 1}월`}
            </div>
            <div className="flex gap-[28px]">
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
                className={clsx(
                  'flex text-gray-50',
                  !canGoNext && 'opacity-30 cursor-not-allowed'
                )}
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
                        mixpanel.track('click_mentor_time', {
                          view: `${mentorInfo?.uuid}`
                        });
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
              <div>
                <p className="text-bold-14 flex gap-[4px]">
                  <p className="text-black">멘토링 1회권(60분) </p>
                  <p className="text-gray-60">X{flattenedSelectionTimes.length}</p>
                </p>
              </div>
              {flattenedSelectionTimes
                // 선택된 시간에 대해 시간순 정렬
                .sort(
                  (a, b) => Number(a.time.split(':')[0]) - Number(b.time.split(':')[0])
                )
                // 컴포넌트와 매핑
                .map(({ date, time }, idx) => (
                  <div
                    key={`${date}-${time}-${idx}`}
                    className="flex justify-between items-center mb-1"
                  >
                    <p className="text-med-14 text-gray-60">
                      {date} {time.split(':').slice(0, 2).join(':')}
                    </p>
                    <button
                      onClick={() => {
                        mixpanel.track('click_delete_time', {
                          view: `${mentorInfo?.uuid}`
                        });
                        handleTimeToggle(date, time);
                      }}
                    >
                      <DeleteIcon width={20} height={20} className="text-gray-60" />
                    </button>
                  </div>
                ))}
            </>
          )}
          {/* 날짜만 정해진 경우 */}
          {focusedDate && flattenedSelectionTimes.length === 0 && (
            <div className="flex flex-1 justify-center mt-[20px]">
              <FillButton
                buttonStatus={'disable'}
                size={'Large'}
                text={'시간을 선택해주세요'}
              />
            </div>
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
                  {originPrice !== price && (
                    <p className="text-bold-16 text-white opacity-50% line-through">
                      {(originPrice * flattenedSelectionTimes.length)?.toLocaleString() +
                        '원'}
                    </p>
                  )}
                  <p className="text-bold-16 text-white">
                    {(price * flattenedSelectionTimes.length).toLocaleString() + '원'}
                  </p>
                  <p className="text-bold-16 text-white">결제하기</p>
                </p>
              </FillButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
