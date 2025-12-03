import { useEffect, useState } from 'react';
import FillButton from '@common/button/FillButton';

type InputStatusType = 'default' | 'writing' | 'fixing' | 'error' | 'done' | 'still';
type ButtonStatusType = 'active' | 'click' | 'disable' | 'hover' | 'loading' | 'empty';

interface LoginButtonInterface {
  idInputStatus: InputStatusType;
  pwInputStatus: InputStatusType;
  isLoading: boolean | null | undefined;
  idInputValue: string;
  pwInputValue: string;
}

export default function LoginButton({
  idInputStatus,
  pwInputStatus,
  isLoading,
  idInputValue,
  pwInputValue
}: LoginButtonInterface) {
  const [buttonStatus, setButtonStatus] = useState<ButtonStatusType>('disable');

  useEffect(() => {
    if (isLoading) {
      setButtonStatus('loading');
    } else if (
      (idInputStatus === 'done' || idInputStatus === 'writing') &&
      (pwInputStatus === 'done' || pwInputStatus === 'writing') &&
      idInputValue.length != 0 &&
      pwInputValue.length != 0
    ) {
      setButtonStatus('active');
    } else if (
      idInputStatus === 'error' ||
      idInputStatus === 'default' ||
      pwInputStatus === 'error' ||
      pwInputStatus === 'default' ||
      idInputValue.length === 0 ||
      pwInputValue.length === 0
    ) {
      setButtonStatus('disable');
    } else {
      setButtonStatus('disable');
    }
  }, [idInputStatus, pwInputStatus, idInputValue, pwInputValue, isLoading]);

  //click시
  const handleMouseDown = () => {
    if (buttonStatus === 'active') {
      setButtonStatus('click');
    }
  };

  //click 해제시
  const handleMouseUp = () => {
    if (buttonStatus === 'click') {
      setButtonStatus('active');
    }
  };

  //hover 시
  const handleMouseEnter = () => {
    if (buttonStatus === 'active') {
      setButtonStatus('hover');
    }
  };

  //hover or click 해제 시
  const handleMouseLeave = () => {
    if (buttonStatus === 'hover' || buttonStatus === 'click') {
      setButtonStatus('active');
    }
  };

  return (
    <FillButton
      buttonStatus={buttonStatus}
      type="submit"
      size="XLarge"
      text="로그인"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}
