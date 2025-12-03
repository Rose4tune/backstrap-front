import clsx from 'clsx';
import React from 'react';

import NextStepIcon from '@public/icons/next-step.svg';
import CheckboxIcon from '@public/icons/checkbox.svg';

import BaseLink from '@common/BaseLink';
import BaseButton from '@common/button/BaseButton';
import BaseCheckInput from '@common/input/BaseCheckInput';

import {
  AgreementSection,
  AgreementDescription,
  LinkButton,
  CheckContainer,
  CheckText,
  NextButton
} from './UserSignupAgreementSection.style';

export interface UserSignupAgreementSectionProps extends BaseProps {
  onNext: () => void;
}

const UserSignupAgreementSection = ({
  className,
  onNext
}: UserSignupAgreementSectionProps): JSX.Element => {
  const [isTermAgreed, setIsTermAgreed] = React.useState(false);

  return (
    <AgreementSection>
      <div>
        <AgreementDescription>
          아래 버튼을 눌러 약관 내용을 확인하세요.
        </AgreementDescription>
        <AgreementDescription>
          미동의시 회원가입 진행이 불가능합니다.
        </AgreementDescription>
      </div>
      <div>
        <BaseLink
          href="/terms"
          target="_blank"
          className="w-full flex-center h-[42px] border border-primary-dark rounded-[21px]"
        >
          <LinkButton>서비스 약관 보러가기</LinkButton>
        </BaseLink>
      </div>

      <CheckContainer>
        <BaseCheckInput
          iconSet={{
            checked: <CheckboxIcon className="text-primary" />,
            unchecked: <CheckboxIcon className="text-[#D7D7D7]" />
          }}
          checked={isTermAgreed}
          onChange={evt => {
            setIsTermAgreed(evt.target.checked);
          }}
        />
        <CheckText isTermAgreed={isTermAgreed}>예, 서비스 약관에 동의합니다.</CheckText>
      </CheckContainer>

      <NextButton>
        <BaseButton
          disabled={!isTermAgreed}
          onClick={() => {
            onNext();
          }}
          className={clsx(isTermAgreed ? 'text-primary' : 'text-grey2')}
        >
          <NextStepIcon />
        </BaseButton>
      </NextButton>
    </AgreementSection>
  );
};

export default UserSignupAgreementSection;
