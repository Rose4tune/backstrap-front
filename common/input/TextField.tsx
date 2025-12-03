import { ChangeEvent, useEffect, useState } from 'react';
import clsx from 'clsx';
import TextBoxDeleteIcon from '@public/icons/[renewal]TextBoxDeleteIcon.svg';
import TextBoxErrorIcon from '@public/icons/[renewal]TextBoxErrorIcon.svg';

type InputStatusType = 'default' | 'writing' | 'error' | 'done' | 'still';
type DeviceType = 'pc' | 'mobile';

interface TextFieldInterface {
  title: string;
  device: DeviceType;
  value: string | number;
  onChange: (value: string ) => void;
  onClick?: () => void;
  placeholder?: string;
  description?: string;
  isError?: boolean;
  errorMessage?: string; //클라이언트용
  errorMessageMap?: Record<number, string>; //서버용 {statusCode: errorMessage}
  errorCode?: number; //서버용
  inputMode?:
  | 'search'
  | 'none'
  | 'text'
  | 'tel'
  | 'url'
  | 'email'
  | 'numeric'
  | 'decimal';
}

export default function TextField({
  title,
  device,
  value,
  onChange,
  description,
  placeholder,
  errorMessage,
  isError,
  errorCode,
  errorMessageMap,
  inputMode,
  onClick
}: TextFieldInterface) {
  const baseStyle =
    'flex w-full items-center bg-gray-20 border-[1px] border-gray-30 rounded-[12px] text-reg-16 font-regular text-gray-90';
  const deviceStyle = {
    pc: 'h-[64px] p-[20px]',
    mobile: 'h-[52px] p-[16px]'
  }[device];

  //input창 상태관리
  const [inputStatus, setInputStatus] = useState<InputStatusType>('default');
  //focus 상태관리
  const [isFocused, setIsFocused] = useState<boolean>(false);

  //error 떴을 때, 에러 아닐 때 해소
  useEffect(() => {
    if (isError) {
      setInputStatus('error');
    } else if (String(value).length === 0) {
      setInputStatus('default');
    } else {
      if (isFocused) {
        setInputStatus('writing');
      } else {
        setInputStatus('done');
      }
    }
  }, [isError, value, isFocused]);

  //상태에 따른 style 관리
  const statusStyle = {
    default: '',
    writing: 'bg-gray-30',
    done: '',
    error: 'border-[1px] border-red bg-red-10',
    still: ''
  }[inputStatus];

  //status에 따른 icon 설정
  let icon;
  if (inputStatus === 'writing' && String(value).length > 0) {
    icon = (
      <button
        tabIndex={-1}
        type="button"
        onMouseDown={e => {
          e.preventDefault(); //포커스 해제 방지해 done으로 상태 바뀌는거 막기
          onChange('');
        }}
      >
        {<TextBoxDeleteIcon />}
      </button>
    );
  } else if (inputStatus === 'error') {
    icon = <TextBoxErrorIcon />;
  }

  //Status가 Error일 때는 값이 변해야 writing으로 전환
  function onchange(e: ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    onChange(newValue); //외부로 값 전달

    if (inputStatus !== 'error') {
      setInputStatus('writing');
    }
  }

  ///Status가 Error가 아닐 때 focus되면 writing으로 전환
  function onfocus() {
    setIsFocused(true);
    if (inputStatus !== 'error') {
      setInputStatus('writing');
    }
  }

  //Status가 Error가 아닐 때 blur되면 default(0글자) 또는 done으로 전환
  function onblur() {
    setIsFocused(false);
    if (inputStatus !== 'error') {
      if (String(value).length === 0) {
        setInputStatus('default');
      } else setInputStatus('done');
    }
  }

  return (
    <div className="flex flex-col justify-start items-start gap-[8px]">
      <p className="text-med-14 text-gray-90 font-medium">{title}</p>
      <div className={clsx(baseStyle, deviceStyle, statusStyle)}>
        <input
          className="flex-1 bg-transparent"
          placeholder={placeholder}
          value={value}
          onFocus={onfocus}
          onBlur={onblur}
          onChange={onchange}
          inputMode={inputMode || 'text'}
          onClick={onClick}
        />
        {icon}
      </div>

      {inputStatus === 'error' ? (
        <p className="text-reg-14 font-regular text-red">
          {errorCode && errorMessageMap
            ? errorMessageMap[errorCode] || '알 수 없는 오류입니다.'
            : errorMessage}
        </p>
      ) : (
        <p className="text-reg-14 font-regular text-gray-70">{description}</p>
      )}
    </div>
  );
}
