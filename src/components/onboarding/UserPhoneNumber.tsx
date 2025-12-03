import { useEffect, useMemo, useState } from 'react';
import TextField from '@common/input/TextField';
import { Dispatch } from 'react';
import { userSignupStore } from '@stores/useSignupStore';
import { isPhoneExist } from '@apis/onboarding/isPhoneExist';

const SESSION_KEY = 'signup-phone-number';

type ButtonStatusType = 'active' | 'click' | 'disable' | 'hover' | 'loading' | 'empty';

interface UserPhoneNumberInterface {
  setButtonStatus: Dispatch<React.SetStateAction<ButtonStatusType>>;
  numberBody: string;
  setNumberBody: Dispatch<React.SetStateAction<string>>;
}

export default function UserPhoneNumber({
  setButtonStatus,
  numberBody,
  setNumberBody
}: UserPhoneNumberInterface) {
  // 포맷 적용된 전체 전화번호

  userSignupStore.update({ phone: '010' + numberBody });
  const formattedNumber = useMemo(() => {
    const onlyNums = numberBody.replace(/[^0-9]/g, '').slice(0, 8); // 8자리까지만 허용
    if (onlyNums.length <= 4) {
      return `010-${onlyNums}`;
    }
    return `010-${onlyNums.slice(0, 4)}-${onlyNums.slice(4)}`;
  }, [numberBody]);

  const [errorMessage, setErrorMessage] = useState<string | null>();
  const [isError, setIsError] = useState<boolean>(false);

  // 폰 번호 검사 및 버튼 상태
  useEffect(() => {
    if (numberBody.length !== 8) {
      setButtonStatus('disable');
      return;
    }

    const checkPhone = async () => {
      const response = await isPhoneExist('010' + numberBody);
      if (response.success) {
        if (response.data) {
          setIsError(true);
          setErrorMessage('이미 존재하는 번호입니다');
          setButtonStatus('disable');
        } else {
          setButtonStatus('active');
          setIsError(false);
        }
      } else {
        setIsError(true);
        setErrorMessage(response.messages || '다시 시도해주세요');
        setButtonStatus('disable');
      }
    };

    checkPhone();
  }, [numberBody]);

  return (
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
      isError={isError}
      errorMessage={errorMessage || '다시 시도해주세요'}
    />
  );
}
