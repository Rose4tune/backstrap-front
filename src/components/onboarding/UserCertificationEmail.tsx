import { verifyResetPasswordEmailCode } from '@apis/onboarding/verifyResetPasswordEmailCode';
import { useEffect, useRef, useState } from 'react';
import { Dispatch } from 'react';

interface UserEmailCertificationInterface {
  setStep: Dispatch<React.SetStateAction<number>>;
  email: string;
}

export default function UserCertificationEmail({
  setStep,
  email
}: UserEmailCertificationInterface) {
  const [values, setValues] = useState(Array(6).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (value: string, idx: number) => {
    if (!/^[0-9]?$/.test(value)) return; // 숫자 한 자리만 허용

    const updated = [...values];
    updated[idx] = value;
    setValues(updated);

    if (value && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'Backspace' && !values[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  //컴포넌트 마운트 시 첫번째 입력창 자동 활성화
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  //모든 값이 입력되면 자동 API 호출
  useEffect(() => {
    const isComplete = values.every(v => v.length === 1);
    if (!isComplete) return;

    const verifycode = values.join('');

    const verify = async () => {
      const response = await verifyResetPasswordEmailCode(email, verifycode);
      if (response.success) {
        setStep(2); //STEP_3
      } else {
        setErrorMessage(response.messages || '인증번호 확인에 실패하였습니다.');
        setValues(Array(6).fill('')); // 전부 초기화시키기
        inputRefs.current[0]?.focus(); //첫번째로 이동
      }
    };

    verify();
  }, [values, email, setStep]);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex gap-[1%] justify-center mb-[12px]">
          {values.map((val, idx) => (
            <input
              key={idx}
              ref={(el: HTMLInputElement | null) => {
                inputRefs.current[idx] = el!;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={val}
              onChange={e => handleChange(e.target.value, idx)}
              onFocus={() => setFocusedIndex(idx)}
              onBlur={() => setFocusedIndex(null)}
              onKeyDown={e => handleKeyDown(e, idx)}
              className={`w-[19%] h-[80px] text-center text-bold-36 text-black rounded-[8px] border-[2px]
            ${focusedIndex === idx ? 'border-hover' : 'border-gray-30'} 
            bg-gray-30`}
            />
          ))}
        </div>
        {errorMessage && <p className="text-red text-reg-14 mt-[8px]">{errorMessage}</p>}
      </div>
    </>
  );
}
