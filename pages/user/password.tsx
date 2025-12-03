import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';

import OnboardingLayout from '@layouts/OnboardingLayout';
import Title from '@common/Title';
import FillButton from '@common/button/FillButton';
import TextField from '@common/input/TextField';
import { sendResetPasswordEmail } from '../../apis/onboarding/sendResetPasswordEmail';
import { editUser } from '../../apis/onboarding/editUser';
import { resetUserPassword } from '../../apis/onboarding/resetUserPassword';
import { useRouter } from 'next/router';
import UserCertificationEmail from 'src/components/onboarding/UserCertificationEmail';
type ButtonStatusType = 'active' | 'click' | 'disable' | 'hover' | 'loading' | 'empty';

const STEP_1 = 0;
const STEP_2 = 1;
const STEP_3 = 2;
const STEP_4 = 3;

const UserPasswordPage: NextPage = () => {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [buttonStatus, setButtonStatus] = useState<ButtonStatusType>('disable');
  const [step, setStep] = useState(STEP_1); //step 조절

  //비밀번호
  const [password, setPassword] = useState('');
  //비밀번호 확인
  const [passwordCheck, setPasswordCheck] = useState('');

  //패스워드 에러 상태 관리
  const [passwordError, setPasswordError] = useState(false);
  const [passwordCheckError, setPasswordCheckError] = useState(false);

  const [timeLeft, setTimeLeft] = useState(300); //시간 관리
  const [startTimer, setStartTimer] = useState<boolean>(false);

  const router = useRouter();

  // 비밀번호 형식 유효성 검사
  function isValidPassword(password: string): boolean {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*(),.?":{}|<>[\]\\\/'`~\-_=+]{6,20}$/; //todo: 특수문자 되는거 명시적이게 보여주기
    return passwordRegex.test(password);
  }

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

  //passwordError 관리
  useEffect(() => {
    if (passwordCheck.length !== 0 && password.length !== 0) {
      setPasswordCheckError(passwordCheck !== password);
    } else {
      setPasswordCheckError(false);
    }
  }, [password, passwordCheck, setPasswordCheckError]);

  //버튼 상태 관리
  useEffect(() => {
    if (step === STEP_1) {
      if (email.length !== 0 && name.length !== 0) {
        setButtonStatus('active');
      } else {
        setButtonStatus('disable');
      }
    }
    if (step === STEP_3) {
      if (
        !passwordError &&
        !passwordCheckError &&
        password.length !== 0 &&
        passwordCheck.length !== 0
      ) {
        setButtonStatus('active');
      } else {
        setButtonStatus('disable');
      }
    }
  }, [email, name, setButtonStatus, passwordError, passwordCheckError]);

  let description;
  if (step === STEP_2) {
  } else if (step === STEP_3) {
  } else if (step === STEP_4) {
    <p className="text-reg-14 text-gray-60">
      앞 페이지에서 설정하신 비밀번호를 다음 로그인 때부터 사용해주세요
    </p>;
  }

  //button click에 따른 액션
  async function adjustStep() {
    if (step === STEP_1) {
      const response = await sendResetPasswordEmail(name, email);
      if (response.success) {
        if (response.data) {
          setStep(STEP_2);
          setButtonStatus('disable'); //추후 관리를 위해
        } else {
          alert(response.messages);
        }
      } else {
        alert('');
      }
    } else if (step === STEP_2) {
      const response = await sendResetPasswordEmail(name, email);
      resetTimer();
      if (response.success) {
        setStartTimer(true);
        //타이머
      } else {
        alert('인증번호 발송에 실패했습니다. 다시 시도해주세요.');
      }
    } else if (step === STEP_3) {
      const response = await resetUserPassword(email, password);
      if (response.success) {
        if (response.data) {
          setStep(STEP_4);
        } else {
          alert(response.messages);
        }
      } else {
        alert(response.messages);
      }
    } else if (step === STEP_4) {
      router.replace('/user/sign-in');
    }
  }

  let stepComponent;
  let stepButton;
  let title;
  if (step === STEP_1) {
    title = <Title text={'비밀번호 찾기'} />;

    stepComponent = (
      <>
        <TextField
          title="이름"
          device="pc"
          description="실명을 입력해주세요"
          placeholder="이름을 입력해주세요"
          value={name}
          onChange={val => {
            setName(val);
          }}
        />
        <TextField
          title="이메일"
          device="pc"
          placeholder="이메일을 입력해주세요"
          value={email}
          onChange={setEmail}
          description="회원가입시 사용했던 이메일을 입력해주세요"
        />
      </>
    );

    stepButton = (
      <FillButton
        buttonStatus={buttonStatus}
        size={'XLarge'}
        text={'다음으로'}
        onClick={adjustStep}
      />
    );
  }
  if (step === STEP_2) {
    title = <Title text={'계정인증'} />;
    description = (
      <p className="text-reg-14 text-gray-60">메일함에 도착한 인증번호를 입력해주세요</p>
    );
    stepComponent = <UserCertificationEmail setStep={setStep} email={email} />;
    stepButton = (
      <button
        onClick={adjustStep}
        className="flex text-gray-90 text-bold-20 h-[62px] bg-gray-20 gap-[4px] items-center justify-center mx-[8%] rounded-[16px]"
      >
        <span>인증번호 재발송</span>
        {startTimer && <span className="text-red">{formatTime(timeLeft)}</span>}
      </button>
    );
  }
  if (step === STEP_3) {
    title = <Title text={'비밀번호 재설정'} />;
    description = (
      <p className="text-reg-14 text-gray-60">
        <p>안녕하세요 {name}님, 계정 확인이 되었어요!</p>
        <p> 새로 사용하실 비밀번호를 설정해주세요</p>
      </p>
    );
    stepComponent = (
      <>
        <TextField
          title="비밀번호"
          device="pc"
          placeholder="사용하실 비밀번호를 입력해주세요"
          description="영문과 숫자 각각 최소 1자 이상 포함해주세요 (6자~20자)"
          value={password}
          onChange={val => {
            setPassword(val);
            setPasswordError(!isValidPassword(val));
          }}
          isError={passwordError}
          errorMessage="영문과 숫자 각각 최소 1자 이상 포함해주세요 (6자~20자)"
        />
        <TextField
          title="비밀번호 확인"
          device="pc"
          placeholder="위와 동일한 비밀번호를 입력해주세요"
          value={passwordCheck}
          onChange={val => {
            setPasswordCheck(val);
          }}
          isError={passwordCheckError}
          errorMessage="비밀번호가 일치하지 않습니다."
        />
      </>
    );
    stepButton = (
      <FillButton
        buttonStatus={buttonStatus}
        size={'XLarge'}
        text={'비밀번호 변경'}
        onClick={adjustStep}
      />
    );
  }
  if (step === STEP_4) {
    title = <Title text={'비밀번호가 재설정 되었어요'} />;
    description = (
      <p className="text-reg-14 text-gray-60">
        앞 페이지에서 설정하신 비밀번호를 다음 로그인 때부터 사용해주세요
      </p>
    );
    stepButton = (
      <FillButton
        buttonStatus={'active'}
        size={'XLarge'}
        text={'로그인하러 가기'}
        onClick={adjustStep}
      />
    );
  }

  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://www.bagstrap.team/user/password"
          key="canonical"
        />
      </Head>

      <OnboardingLayout>
        <div className="flex flex-col min-h-screen mx-auto w-[90%] max-w-[450px] pt-[60px] sm:pt-[120px] gap-[52px]">
          <div className="flex w-full flex-col gap-[12px]">
            {title}
            {description}
          </div>
          {stepComponent}
          <div className="sticky bottom-0 left-0 flex w-full justify-center bg-white ">
            <div className="flex flex-col w-full text-center w-[90%] max-w-[450px] gap-[14px] py-[20px]">
              {stepButton}
            </div>
          </div>
        </div>
      </OnboardingLayout>
    </>
  );
};

export default UserPasswordPage;
