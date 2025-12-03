import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import CheckIcon from '@public/icons/[renewal]CheckIcon.svg';
import TextBoxDownIcon from '@public/icons/[renewal]TextBoxDownIcon.svg';
import TextBoxUpIcon from '@public/icons/[renewal]TextBoxUpIcon.svg';

interface AgreementBoxProps {
  title: string;
  description: ReactNode;
  isAgreement: boolean;
  setIsAgreement: Dispatch<SetStateAction<boolean>>;
  isNecessary: boolean;
}

export default function AgreementBox({
  title,
  description,
  isAgreement,
  setIsAgreement,
  isNecessary
}: AgreementBoxProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex justify-between items-center px-[16px]">
        <button
          onClick={() => setIsAgreement(!isAgreement)}
          className=" w-full h-[24px] text-bold-16 text-gray-90 "
        >
          <div className="flex gap-[8px] items-center">
            <CheckIcon className={isAgreement ? 'text-normal' : 'text-gray-50'} />
            <div className="flex gap-[8px]">
              <p>{title}</p>
              <p
                className={`${isNecessary ? 'text-nomarl' : 'text-gray-50'} text-semibold-14`}
              >
                {isNecessary ? '(필수)' : '(선택)'}
              </p>
            </div>
          </div>
        </button>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <TextBoxUpIcon /> : <TextBoxDownIcon />}
        </button>
      </div>
      {isOpen ? <p className="pl-[48px]">{description}</p> : <></>}
    </div>
  );
}
