import React, { useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useUserAuthSign from '@hooks/useUserAuthSign.hook';
import useHttpPostOAuthToken from '@hooks/bagstrap/user/useHttpPostOAuthToken.hook';
import { StudentType as GqlStudentType } from '@generated/graphql';

import {
  PageContainer,
  HeaderContainer,
  HeaderTitle,
  HeaderStep,
  HeaderStepText,
  Step1Section
} from '@styles/pages/user/sign-up/index.style';
import { useStore } from '@stores/useStore.hook';
import OnboardingLayout from '@layouts/OnboardingLayout';
import Title from '@common/Title';
import FillButton from '@common/button/FillButton';
import TextField from '@common/input/TextField';
import { sendPhoneVerifyCode } from '../../../apis/onboarding/sendPhoneVerifyCode';
import { number } from 'yup';
import axios from 'axios';
import { createUser } from '../../../apis/onboarding/createUser';
import { userSignupStore } from '@stores/useSignupStore';
import { stat } from 'fs';
import { editUser } from '../../../apis/onboarding/editUser';
import { responsePathAsArray } from 'graphql';
import { checkAuthenticated } from '@utils/auth/auth.util';
import { time } from 'console';
import StepContent from 'src/components/onboarding/StepContent';
import { buildUserEdit, buildUserRegister } from 'src/utils/onboarding/buildDto';

const STEP_1 = 0;
const STEP_2 = 1;
const STEP_3 = 2;
const STEP_4 = 3;
const STEP_5 = 4;

type ButtonStatusType = 'active' | 'click' | 'disable' | 'hover' | 'loading' | 'empty';

const UserSignupIndexPage: NextPage = () => {
  const router = useRouter();
  const [step, setStep] = useState<number>(STEP_1);
  const [buttonStatus, setButtonStatus] = useState<ButtonStatusType>('disable');
  const [authPayload, afterSignedin] = useUserAuthSign();
  const [state, signinWithEmail] = useHttpPostOAuthToken();
  const [shouldSignin, setShouldSignin] = useState<boolean>(false); //step5 회원가입 이후 로그인을 위한 상태추가

  const isSocialUser = !!authPayload?.isSignup || !!authPayload?.needRegister; //socialUser인지 확인

  //Todo: 추후 store 관리 필요
  const [numberBody, setNumberBody] = useState(''); // 핸드폰 전화번호 사용자 입력 숫자만 (하이픈 제외)
  //엔드포인트 관리
  const [timeLeft, setTimeLeft] = useState(300); //시간 관리
  const [startTimer, setStartTimer] = useState<boolean>(false);

  const provider = useMemo(() => {
    const raw = router.query.provider;
    return Array.isArray(raw) ? raw[0] : raw || null;
  }, [router.query.provider]);

  const isKakao = provider === 'KAKAOTALK'

  /**핸드폰 번호 string: 01012345678 */
  const phoneNumber = '010' + numberBody;

  //쿠키 저장하기 위해서 로그인 후 리렌더링 될 때 실행
  useEffect(() => {
    if (shouldSignin && state?.result) {
      afterSignedin(state.result, '/user/sign-up/welcome');
    }
  }, [state, shouldSignin]);

  //타이머 로직
  useEffect(() => {
    if (!startTimer) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [startTimer]);

  const resetTimer = () => {
    setStartTimer(false); // 먼저 종료
    setTimeLeft(300); // 시간 리셋
  };

  // 분:초 형태로 포맷팅
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(minutes).padStart(1, '0')}:${String(sec).padStart(2, '0')}`;
  };

  async function adjustStep() {
    // 카카오: 3,4단계 스킵
    if (isKakao) {
      if (step === STEP_1) {
        setStep(STEP_2);
        return;
      }
      if (step === STEP_2) {
        setStep(STEP_5);
        return;
      }
      if (step !== STEP_5) return; // 나머지 단계는 의미 없음(스킵)
    } else {
      // 비카카오: 기존 플로우 유지
      if (step === STEP_1) {
        setStep(STEP_2);
        return;
      } else if (step === STEP_2) {
        setStep(STEP_3);
        return;
      } else if (step === STEP_3) {
        const response = await sendPhoneVerifyCode(phoneNumber);
        if (response.success) setStep(STEP_4);
        return;
      } else if (step === STEP_4) {
        const response = await sendPhoneVerifyCode(phoneNumber);
        resetTimer();
        if (response.success) {
          setStartTimer(true);
        } else {
          alert('인증번호 발송에 실패했습니다. 다시 시도해주세요.');
        }
        return;
      } else if (step !== STEP_5) {
        return;
      }
    }

    // STEP_5: 최종 제출
    try {
      // 스토어 스냅샷
      const state = userSignupStore.state;

      const payload =
        isSocialUser
          ? buildUserEdit(state, { isKakao, isSocial: isSocialUser }) // UserEditDto
          : buildUserRegister(state); // UserRegisterDto

      const response = isSocialUser
        ? await editUser(payload, authPayload.access_token, authPayload.userUuid)
        : await createUser(payload);

      if (!response.success) {
        alert(response.messages);
        return;
      }

      // 성공 처리
      sessionStorage.removeItem('signup-education-info');
      sessionStorage.removeItem('user_signup_info');

      if (isSocialUser) {
        // 소셜은 토큰 업데이트만 하고 완료 페이지로
        afterSignedin({
          ...authPayload,
          isSignup: false,
          needRegister: false,
        });
        sessionStorage.setItem('signup-nickname', state?.name || '');
        router.replace('/user/sign-up/welcome');
      } else {
        // 일반 가입은 이메일/비번 로그인 후 이동
        signinWithEmail(state?.email || '', state?.password || '');
        sessionStorage.setItem('signup-nickname', state?.name || '');
        setShouldSignin(true);
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.messages || '회원가입 처리 중 오류가 발생했습니다.');
    }
  }


  //Todo: 초기 SignUp 상태 설정 시작 필요, Welcome Page에도 종료가 있음.
  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://www.bagstrap.team/user/sign-up"
          key="canonical"
        />
      </Head>

      <OnboardingLayout>
        {/*Todo: Form 좀 더 제대로 이해해서 어떻게 흘러가는건지 파악하기, 안에 button은 무슨 동작?*/}
        <div className="flex flex-col min-h-screen mx-auto w-[90%] max-w-[450px] pt-[60px] sm:pt-[120px] gap-[52px]">
          {/* 스크롤되는 body */}
          <StepContent
            isKakao={isKakao}
            step={step}
            setStep={setStep}
            setButtonStatus={setButtonStatus}
            numberBody={numberBody}
            setNumberBody={setNumberBody}
            isSocialUser={isSocialUser}
          />
          {/*하단 고정 버튼 부분*/}
          <div className="sticky bottom-0 left-0 flex w-full justify-center bg-white">
            <div className="flex flex-col w-full text-center max-w-[450px] gap-[14px] py-[20px]">
              {step === STEP_2 && (
                <p className="text-med-14 text-gray-70 font-medium">
                  직장인이라면 최종학위를 입력해주세요
                </p>
              )}
              {step !== STEP_4 && (
                <FillButton
                  buttonStatus={buttonStatus}
                  size={'XLarge'}
                  text={'다음으로'}
                  onClick={adjustStep}
                />
              )}
              {step === STEP_4 && (
                <>
                  <button
                    onClick={adjustStep}
                    className="flex text-gray-90 text-bold-20 h-[62px] bg-gray-20 gap-[4px] items-center justify-center mx-[8%] rounded-[16px]"
                  >
                    <span>인증번호 재발송</span>
                    {startTimer && (
                      <span className="text-red">{formatTime(timeLeft)}</span>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </OnboardingLayout>
    </>
  );
};

export default UserSignupIndexPage;
