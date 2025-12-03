import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import clsx from 'clsx';
import TextBoxOpenIcon from '@public/icons/[renewal]TextBoxOpenIcon.svg';
import TextBoxCloseIcon from '@public/icons/[renewal]TextBoxCloseIcon.svg';

type InputStatusType = 'default' | 'writing' | 'error' | 'done' | 'still';
type DeviceType = 'pc' | 'mobile';

interface UserPwInputInterface {
  device: DeviceType;
  placeholder?: string | undefined;
  description?: string;
  inputStatus: InputStatusType;
  setInputStatus: React.Dispatch<React.SetStateAction<InputStatusType>>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  errorMessage?: string;
  pwVisible: boolean;
  setPwVisible: Dispatch<SetStateAction<boolean>>;
}

export default function UserPwInput({
  device,
  description,
  placeholder,
  inputStatus,
  setInputStatus,
  value,
  setValue,
  errorMessage,
  pwVisible,
  setPwVisible
}: UserPwInputInterface) {
  const baseStyle =
    'flex w-full items-center bg-gray-20 border-[1px] border-gray-30 rounded-[12px] text-reg-16 font-regular text-gray-50';
  const deviceStyle = {
    pc: 'h-[64px] p-[20px]',
    mobile: 'h-[52px] p-[16px]'
  }[device];

  //자동완성 이후 상태 처리
  useEffect(() => {
    if (value.length > 0 && inputStatus === 'default') {
      setInputStatus('done');
    }
  }, [value, inputStatus]);

  //상태에 따른 style 관리
  const statusStyle = {
    default: '',
    writing: 'bg-gray-30 text-gray-90',
    done: 'text-gray-90',
    error: 'text-gray-90 border-[1px] border-red',
    still: ''
  }[inputStatus];

  let icon;
  if (inputStatus === 'writing' || inputStatus === 'done' || inputStatus === 'error') {
    icon = (
      <button tabIndex={-1} type="button" onClick={() => setPwVisible(!pwVisible)}>
        {pwVisible ? <TextBoxCloseIcon /> : <TextBoxOpenIcon />}
      </button>
    );
  }

  //Status가 Error일 때는 값이 변해야 writing으로 전환
  function onchange(e: ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setValue(newValue);

    if (inputStatus === 'error') {
      setInputStatus('writing');
    }
  }

  ///Status가 Error가 아닐 때 focus되면 writing으로 전환
  function onfocus() {
    if (inputStatus !== 'error') {
      setInputStatus('writing');
    }
  }

  //Status가 Error가 아닐 때 blur되면 default(0글자) 또는 done으로 전환
  function onblur() {
    if (inputStatus !== 'error') {
      if (value.length === 0) {
        setInputStatus('default');
      } else setInputStatus('done');
    }
  }

  return (
    <div className="flex flex-col justify-start items-start gap-[8px]">
      <p className="text-med-14 text-gray-90 font-medium">비밀번호</p>
      <div className={clsx(baseStyle, deviceStyle, statusStyle)}>
        <input
          type={!pwVisible ? 'password' : 'text'}
          className="flex-1 bg-transparent"
          placeholder={placeholder}
          value={value}
          onFocus={onfocus}
          onBlur={onblur}
          onChange={onchange}
          autoComplete="new-password"
        />
        {icon}
      </div>

      {inputStatus === 'error' ? (
        <p className="text-reg-14 font-regular text-red">{errorMessage}</p>
      ) : (
        ''
      )}
      <p className="text-reg-14 font-regular">{description}</p>
    </div>
  );
}
