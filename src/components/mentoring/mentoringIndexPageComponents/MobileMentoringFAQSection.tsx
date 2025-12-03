import { useState } from 'react';
import TextBoxDownIcon from 'public/icons/[renewal]TextBoxDownIcon.svg';
import TextBoxUpIcon from 'public/icons/[renewal]TextBoxUpIcon.svg';
import mixpanel from 'mixpanel-browser';

export default function MobileMentoringFAQSection() {
  // FAQ toggle open 상태 관리
  const [isFirstOpen, setIsFirstOpen] = useState<boolean>(false);
  const [isSecondOpen, setIsSecondOpen] = useState<boolean>(false);
  const [isThirdOpen, setIsThirdOpen] = useState<boolean>(false);
  const [isFourthOpen, setIsFourthOpen] = useState<boolean>(false);
  const [isFifthOpen, setIsFifthOpen] = useState<boolean>(false);

  return (
    <div className="max-w-[550px] mx-auto w-full flex flex-col gap-[12px] px-[20px] mb-[86px]">
      {/* FAQ Header */}
      <div className="flex w-full h-[30px] justify-between mt-[16px] items-center">
        <div className="text-bold-20 text-gray-90">자주 묻는 질문</div>
      </div>
      {/* FAQ Toggle Section*/}
      <div className="flex flex-col gap-[12px]">
        {/* 첫번째 toggle 버튼 */}
        <button
          onClick={() => {
            //전에 닫혀있었고 이번 클릭으로 열릴 때
            if (!isFirstOpen) {
              mixpanel.track('click_open_qna_1', { view: 'mentoring' });
            } else {
              //닫힐 때
              mixpanel.track('click_close_qna_1', { view: 'mentoring' });
            }
            setIsFirstOpen(prev => !prev);
          }}
        >
          <div className="flex w-full justify-between items-center py-[16px] pl-[8px] pr-[20px] border-b-[1px] border-gray-40">
            <p className="text-semibold-14 text-gray-90">
              결제 했는데 그 다음은 어떡하나요?
            </p>
            {isFirstOpen ? (
              <TextBoxUpIcon width={20} height={20} />
            ) : (
              <TextBoxDownIcon width={20} height={20} />
            )}
          </div>
        </button>
        {isFirstOpen && (
          <div className="flex flex-col px-[20px]">
            <p className="text-med-12 text-gray-70 mb-[12px]">
              결제를 완료하면, 영업일 1일 이내에 입력하신 연락처로 멘토링 일정, 질문지,
              그리고 참여 URL을 전달드립니다.
            </p>
            <p className="text-semibold-14 text-gray-90 mb-[4px]">
              알림톡을 받지 못했어요!
            </p>
            <p className="text-med-12 text-gray-70 mb-[12px]">
              카카오톡에서 ‘가방끈' 채널을 차단했을 시엔 알림톡을 받지 못합니다. 영업일
              기준 2일 내 문자가 오지 않는 경우 채널톡으로 문의해주세요.
            </p>
          </div>
        )}
        {/* 두번째 toggle 버튼 */}
        <button
          onClick={() => {
            //전에 닫혀있었고 이번 클릭으로 열릴 때
            if (!isSecondOpen) {
              mixpanel.track('click_open_qna_2', { view: 'mentoring' });
            } else {
              //닫힐 때
              mixpanel.track('click_close_qna_2', { view: 'mentoring' });
            }
            setIsSecondOpen(prev => !prev);
          }}
        >
          <div className="flex w-full justify-between items-center py-[16px] pl-[8px] pr-[20px] border-b-[1px] border-gray-40">
            <p className="text-semibold-14 text-gray-90">
              결제 했는데 멘토를 바꾸고 싶어요!
            </p>
            {isSecondOpen ? (
              <TextBoxUpIcon width={20} height={20} />
            ) : (
              <TextBoxDownIcon width={20} height={20} />
            )}
          </div>
        </button>
        {isSecondOpen && (
          <div className="flex flex-col px-[20px]">
            <p className="text-med-12 text-gray-70 mb-[12px]">
              결제 후에는 멘토 변경이 불가합니다, 환불 후 재결제 해주셔야 합니다. 환불을
              원하시면 채널톡으로 문의해주세요.
            </p>
          </div>
        )}
        {/* 세번째 toggle 버튼 */}
        <button
          onClick={() => {
            //전에 닫혀있었고 이번 클릭으로 열릴 때
            if (!isThirdOpen) {
              mixpanel.track('click_open_qna_3', { view: 'mentoring' });
            } else {
              //닫힐 때
              mixpanel.track('click_close_qna_3', { view: 'mentoring' });
            }
            setIsThirdOpen(prev => !prev);
          }}
        >
          <div className="flex w-full justify-between items-center py-[16px] pl-[8px] pr-[20px] border-b-[1px] border-gray-40">
            <p className="text-semibold-14 text-gray-90">
              신청을 완료했는데 일정을 변경하고 싶어요!
            </p>
            {isThirdOpen ? (
              <TextBoxUpIcon width={20} height={20} />
            ) : (
              <TextBoxDownIcon width={20} height={20} />
            )}
          </div>
        </button>
        {isThirdOpen && (
          <div className="flex flex-col px-[20px]">
            <p className="text-med-12 text-gray-70 mb-[12px]">
              멘토링 일정 변경은 불가합니다. 멘토링 시작 72시간 전에 채널톡으로 환불
              받으신 이후 재결제 해주세요.
            </p>
          </div>
        )}
        {/* 네번째 toggle 버튼 */}
        <button
          onClick={() => {
            //전에 닫혀있었고 이번 클릭으로 열릴 때
            if (!isFourthOpen) {
              mixpanel.track('click_open_qna_4', { view: 'mentoring' });
            } else {
              //닫힐 때
              mixpanel.track('click_close_qna_4', { view: 'mentoring' });
            }
            setIsFourthOpen(prev => !prev);
          }}
        >
          <div className="flex w-full justify-between items-center py-[16px] pl-[8px] pr-[20px] border-b-[1px] border-gray-40">
            <p className="text-semibold-14 text-gray-90">멘토링은 어디에서 진행되나요?</p>
            {isFourthOpen ? (
              <TextBoxUpIcon width={20} height={20} />
            ) : (
              <TextBoxDownIcon width={20} height={20} />
            )}
          </div>
        </button>
        {isFourthOpen && (
          <div className="flex flex-col px-[20px]">
            <p className="text-med-12 text-gray-70 mb-[12px]">
              멘토링은 구글밋을 통해 비대면으로 진행됩니다. 멘토링 접속 전 카메라와 마이크
              테스트를 완료해주세요.
            </p>
          </div>
        )}
        {/* 다섯번째 toggle 버튼 */}
        <button
          onClick={() => {
            //전에 닫혀있었고 이번 클릭으로 열릴 때
            if (!isFifthOpen) {
              mixpanel.track('click_open_qna_5', { view: 'mentoring' });
            } else {
              //닫힐 때
              mixpanel.track('click_close_qna_5', { view: 'mentoring' });
            }
            setIsFifthOpen(prev => !prev);
          }}
        >
          <div className="flex w-full justify-between items-center py-[16px] pl-[8px] pr-[20px] border-b-[1px] border-gray-40">
            <p className="text-semibold-14 text-gray-90">환불 규정이 어떻게 되나요?</p>
            {isFifthOpen ? (
              <TextBoxUpIcon width={20} height={20} />
            ) : (
              <TextBoxDownIcon width={20} height={20} />
            )}
          </div>
        </button>
        {isFifthOpen && (
          <div className="flex flex-col px-[20px]">
            <p className="text-med-12 text-gray-70 mb-[12px]">
              멘토링 일정 72시간 전까지 채널톡으로 환불 요청을 할 시에 전액 환불이 되며,
              일정 72시간 이내부터는 환불이 불가능합니다. 기간이 만료된 멘토링 이용권은
              환불이 불가능합니다. 자세한 내용은{' '}
              <a
                href="https://voracious-show-448.notion.site/20d81357f2f8807fb8ded357f89fa504"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                환불규정
              </a>
              을 참고해주세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
