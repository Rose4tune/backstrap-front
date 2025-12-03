import FillButton from '@common/button/FillButton';
import TextField from '@common/input/TextField';
import Title from '@common/Title';
import OnboardingLayout from '@layouts/OnboardingLayout';
import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import { findIdByPhone } from '../../apis/onboarding/findIdByPhone';
import { number } from 'yup';
import { sendPhoneVerifyCode } from '../../apis/onboarding/sendPhoneVerifyCode';
import { error } from 'console';
import { useRouter } from 'next/router';
import { sendResetPasswordEmail } from '../../apis/onboarding/sendResetPasswordEmail';
import UserCertificationNumberVerification from 'src/components/onboarding/UserCertificationNumberVerify';

const STEP_1 = 1;
const STEP_2 = 2;
const STEP_3 = 3;
type ButtonStatusType = 'active' | 'click' | 'disable' | 'hover' | 'loading' | 'empty';

export default function idPage() {
  const [name, setName] = useState('');
  const [numberBody, setNumberBody] = useState('');
  const [step, setStep] = useState(STEP_1);
  const [buttonStatus, setButtonStatus] = useState<ButtonStatusType>('disable');
  const [isNumberError, setIsNumberError] = useState(false);
  const [numberErrorMessage, setNumberErrorMessage] = useState<string | null>();
  const [findEmail, setFindEmail] = useState('');
  //엔드포인트 관리
  const [timeLeft, setTimeLeft] = useState(300); //시간 관리
  const [startTimer, setStartTimer] = useState<boolean>(false);

  let title;
  let description;
  let stepComponent;
  let stepButton;

  const router = useRouter();

  const formattedNumber = useMemo(() => {
    const onlyNums = numberBody.replace(/[^0-9]/g, '').slice(0, 8); // 8자리까지만 허용
    if (onlyNums.length <= 4) {
      return `010-${onlyNums}`;
    }
    return `010-${onlyNums.slice(0, 4)}-${onlyNums.slice(4)}`;
  }, [numberBody]);

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

  //버튼 상태 조정
  useEffect(() => {
    if (name.length !== 0 && numberBody.length === 8 && !isNumberError) {
      setButtonStatus('active');
    } else {
      setButtonStatus('disable');
    }
  }, [name, numberBody, setButtonStatus, isNumberError, numberErrorMessage]);

  // API 자동 전송
  useEffect(() => {
    if (numberBody.length === 8) {
      const fetch = async () => {
        const response = await findIdByPhone(name, '010' + numberBody);
        if (response.success) {
          if (response.data) {
            setIsNumberError(false);
            setNumberErrorMessage(null);
            // data가 true일 때
            setButtonStatus('active');
          } else {
            setIsNumberError(true);
            setNumberErrorMessage('현재 가방끈에 등록되어 있지 않은 번호에요.');
          }
        } else {
          setIsNumberError(true);
          setNumberErrorMessage(
            response.messages || '현재 가방끈에 등록되어 있지 않은 번호에요.'
          );
        }
      };

      fetch();
    }
  }, [numberBody, name]);

  async function adjustStep() {
    if (step === STEP_1) {
      const response = await sendPhoneVerifyCode('010' + numberBody);
      if (response.success) {
        setStep(STEP_2);
      } else {
        alert(response.messages); //추후 컴포넌트 처리하기
      }
    } else if (step === STEP_2) {
      const response = await sendPhoneVerifyCode('010' + numberBody);
      resetTimer();
      if (response.success) {
        setStartTimer(true);
        //타이머
      } else {
        alert('인증번호 발송에 실패했습니다. 다시 시도해주세요.');
      }
    }
    if (step === STEP_3) {
      router.replace({ pathname: '/user/sign-in', query: { id: findEmail } });
    }
  }

  if (step === STEP_1) {
    title = <Title text={'아이디 찾기'}></Title>;
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
          title="전화번호"
          device="pc"
          value={formattedNumber}
          onChange={val => {
            if (val === '') {
              setNumberBody('');
            }
            const onlyNums = val.replace(/[^0-9]/g, '').replace(/^010/, '');
            const sliced = onlyNums.slice(0, 8); //최대 8자리
            setNumberBody(sliced);
          }}
          isError={isNumberError}
          errorMessage={numberErrorMessage || '인증번호 확인에 실패했습니다.'}
        />
      </>
    );
    stepButton = (
      <>
        <p className="text-reg-14 text-gray-70">
          입력한 전화번호로 인증번호가 전송됩니다
        </p>
        <FillButton
          buttonStatus={buttonStatus}
          size={'XLarge'}
          text={'다음으로'}
          onClick={adjustStep}
        />
      </>
    );
  }
  if (step === STEP_2) {
    title = <Title text={'계정인증'} />;
    description = (
      <p className="text-reg-14 text-gray-60">
        메시지함에 도착한 인증번호를 입력해주세요
      </p>
    );
    stepComponent = (
      <UserCertificationNumberVerification
        setFindEmail={setFindEmail}
        name={name}
        setStep={setStep}
        phoneNumber={'010' + numberBody}
      />
    );
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
    title = <Title text={findEmail} />;
    description = (
      <p className="text-gray-60 text-reg-14 flex flex-wrap">
        <p>가입하실 때 사용하셨던 이메일을 찾았어요</p>
        <p>이메일 재설정을 위해서는 채널톡으로 문의해주세요</p>
      </p>
    );
    stepButton = (
      <>
        <FillButton
          buttonStatus={buttonStatus}
          size={'XLarge'}
          text={'이 계정으로 로그인하기'}
          onClick={adjustStep}
        />
      </>
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
}
