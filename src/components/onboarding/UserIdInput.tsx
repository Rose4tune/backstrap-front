import { ChangeEvent, useEffect } from 'react';
import clsx from 'clsx';
import TextBoxDeleteIcon from '@public/icons/[renewal]TextBoxDeleteIcon.svg';
import TextBoxErrorIcon from '@public/icons/[renewal]TextBoxErrorIcon.svg';

type InputStatusType = 'default' | 'writing' | 'error' | 'done' | 'still';
type DeviceType = 'pc' | 'mobile';

interface UserIdInputInterface {
  device: DeviceType;
  placeholder?: string | undefined;
  description?: string;
  inputStatus: InputStatusType;
  setInputStatus: React.Dispatch<React.SetStateAction<InputStatusType>>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  errorMessage?: string;
}

export default function UserIdInput({
  device,
  description,
  placeholder,
  inputStatus,
  setInputStatus,
  value,
  setValue,
  errorMessage
}: UserIdInputInterface) {
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
  }, [value]);

  //상태에 따른 style 관리
  const statusStyle = {
    default: '',
    writing: 'bg-gray-30 text-gray-90',
    done: 'text-gray-90',
    error: 'text-gray-90 border-[1px] border-red',
    still: ''
  }[inputStatus];

  //status에 따른 icon 설정
  let icon;
  if ((inputStatus === 'writing' || inputStatus === 'done') && value.length > 0) {
    icon = (
      <button tabIndex={-1} type="button" onClick={() => setValue('')}>
        <TextBoxDeleteIcon />
      </button>
    );
  } else if (inputStatus === 'error') {
    icon = <TextBoxErrorIcon />;
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
      <p className="text-med-14 text-gray-90 font-medium">이메일</p>
      <div className={clsx(baseStyle, deviceStyle, statusStyle)}>
        <input
          className="flex-1 bg-transparent"
          placeholder={placeholder}
          value={value}
          onFocus={onfocus}
          onBlur={onblur}
          onChange={onchange}
          autoComplete="off"
        />
        {icon}
      </div>

      {inputStatus === 'error' ? (
        <p className="text-reg-14 font-regular text-red">{errorMessage}</p>
      ) : (
        ''
      )}
      {description ? <p className="text-reg-14 font-regular">{description}</p> : <></>}
    </div>
  );
}
