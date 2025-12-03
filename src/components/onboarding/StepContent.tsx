import { Dispatch, useEffect, useMemo } from 'react';
import ProgressDot from './ProgressDot';
import Title from '@common/Title';
import UserSignUpInfo from './UserSignUpInfo';
import UserEducationInfo from './UserEducationInfo';
import UserPhoneNumber from './UserPhoneNumber';
import UserCertificationNumber from './UserCertificationNumber';
import UserSignUpAgreement from './UserSignUpAgreement';

const STEP_1 = 0;
const STEP_2 = 1;
const STEP_3 = 2;
const STEP_4 = 3;
const STEP_5 = 4;

interface StepContentProps {
  step: number;
  setButtonStatus: Dispatch<React.SetStateAction<ButtonStatusType>>;
  numberBody: string;
  setNumberBody: Dispatch<React.SetStateAction<string>>;
  setStep: Dispatch<React.SetStateAction<number>>;
  isSocialUser: boolean;
  isKakao: boolean;
}

type ButtonStatusType = 'active' | 'click' | 'disable' | 'hover' | 'loading' | 'empty';

export default function StepContent({
  step,
  setButtonStatus,
  numberBody,
  setNumberBody,
  setStep,
  isSocialUser,
  isKakao
}: StepContentProps) {
  // 카카오일 때 전화 인증 단계(3,4) 건너뛰기
  useEffect(() => {
    if (isKakao && (step === STEP_3 || step === STEP_4)) {
      setStep(STEP_5);
    }
  }, [isKakao, step, setStep]);
  switch (step) {
    case STEP_1: //개인정보입력
      return (
        <>
          <div className="flex w-full flex-col gap-[12px]">
            <ProgressDot step={step} />
            <Title text={'회원가입'} />
          </div>
          <UserSignUpInfo isKakao={isKakao} isSocialUser={isSocialUser} setButtonStatus={setButtonStatus} />
        </>
      );

    case STEP_2: //학위 정보 제출
      return (
        <>
          <div className="flex w-full flex-col gap-[12px]">
            <ProgressDot step={step} />
            <Title text={'학위 정보 제출'} />
          </div>
          <UserEducationInfo setButtonStatus={setButtonStatus} />
        </>
      );

    case STEP_3: //전화번호 입력
      return (
        <>

          <div className="flex w-full flex-col gap-[12px]">
            <ProgressDot step={step} />
            <Title text={'전화번호 인증'} />
          </div>
          <UserPhoneNumber
            setButtonStatus={setButtonStatus}
            numberBody={numberBody}
            setNumberBody={setNumberBody}
          />
        </>
      );

    case STEP_4: //인증번호 입력
      return (
        <>
          <div className="flex w-full flex-col gap-[12px]">
            <ProgressDot step={step} />
            <Title text={'전화번호 인증'} />
            <p className="text-reg-14 text-gray-60">
              메시지함에 도착한 인증번호를 입력해주세요
            </p>
          </div>
          <UserCertificationNumber setStep={setStep} phoneNumber={'010' + numberBody} />
        </>
      );

    case STEP_5: //이용약관 동의
      return (
        <>
          <div className="flex w-full flex-col gap-[12px]">
            <ProgressDot step={step} />
            <Title text={'이용약관 동의'} />
          </div>
          <UserSignUpAgreement setButtonStatus={setButtonStatus} />
        </>
      );

    default:
      return null;
  }
}
