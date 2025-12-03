import { Dispatch, useEffect, useState } from 'react';
import CheckIcon from '@public/icons/[renewal]CheckIcon.svg';
import AgreementBox from './AgreementBox';
import {
  CommunityAgreement,
  MarketingAgreement,
  PrivacyAgreement,
  ServiceAgreement
} from './AgreementContents';
import { userSignupStore } from '@stores/useSignupStore';
type ButtonStatusType = 'active' | 'click' | 'disable' | 'hover' | 'loading' | 'empty';
export type AgreedTermType =
  | 'SERVICE_USE' // 서비스 이용 약관
  | 'PERSONAL_INFO_USE' // 개인정보 수집 및 이용
  | 'COMMUNITY_RULE' // 커뮤니티 규칙
  | 'MARKETING'; // 마케팅 동의 (선택)
interface UserSignUpAgreementInterface {
  setButtonStatus: Dispatch<React.SetStateAction<ButtonStatusType>>;
}
export default function UserSignupAgreement({
  setButtonStatus
}: UserSignUpAgreementInterface) {
  const [isWholeAgreement, setIsWholeAgreement] = useState<boolean>(false); //전체 동의 : 나머지 4개 조절
  const [isServiceAgreement, setIsServiceAgreement] = useState<boolean>(false); //서비스이용약관 동의
  const [isPrivacyAgreement, setIsPrivacyAgreement] = useState<boolean>(false); //개인정보 수집 및 이용 동의
  const [isCommunityAgreement, setIsCommunityAgreement] = useState<boolean>(false); //커뮤니티 동의
  const [isMarketingAgreement, setIsMarketingAgreement] = useState<boolean>(false); //마케팅 동의

  //4개 모두 체크 => Whole Agreement로 관리
  useEffect(() => {
    const isAllAgreed =
      isServiceAgreement &&
      isPrivacyAgreement &&
      isCommunityAgreement &&
      isMarketingAgreement;

    setIsWholeAgreement(isAllAgreed);
  }, [
    isServiceAgreement,
    isPrivacyAgreement,
    isCommunityAgreement,
    isMarketingAgreement
  ]);

  //전체 동의 체크 시 4개 각각에 대해 일괄적용
  const handleWholeAgreementToggle = (checked: boolean) => {
    setIsWholeAgreement(checked);
    setIsServiceAgreement(checked);
    setIsPrivacyAgreement(checked);
    setIsCommunityAgreement(checked);
    setIsMarketingAgreement(checked);
  };

  useEffect(() => {
    const agreed: AgreedTermType[] = [];
    if (isServiceAgreement) agreed.push('SERVICE_USE');
    if (isPrivacyAgreement) agreed.push('PERSONAL_INFO_USE');
    if (isCommunityAgreement) agreed.push('COMMUNITY_RULE');
    if (isMarketingAgreement) agreed.push('MARKETING');
    userSignupStore.update({ agreedTerms: agreed });
  }, [
    isServiceAgreement,
    isPrivacyAgreement,
    isCommunityAgreement,
    isMarketingAgreement
  ]);

  useEffect(() => {
    setButtonStatus(
      (isServiceAgreement && isPrivacyAgreement && isCommunityAgreement) ||
        isWholeAgreement
        ? 'active'
        : 'disable'
    );
  }, [isWholeAgreement, isServiceAgreement, isPrivacyAgreement, isCommunityAgreement]);

  return (
    <div className="flex flex-col gap-[12px]">
      <button
        onClick={() => {
          handleWholeAgreementToggle(!isWholeAgreement);
        }}
        className={`${isWholeAgreement ? 'bg-bagstrap-10' : 'bg-gray-20'} flex w-full h-[56px] rounded-[12px] text-bold-16 text-gray-90 items-center px-[16px] gap-[8px]`}
      >
        <CheckIcon className={isWholeAgreement ? 'text-normal' : 'text-gray-50'} />
        <p>{'전체 동의'}</p>
      </button>
      <div className="flex flex-col gap-[8px]">
        <AgreementBox
          title="서비스이용약관 동의"
          description={<ServiceAgreement />}
          isAgreement={isServiceAgreement}
          setIsAgreement={setIsServiceAgreement}
          isNecessary={true}
        />
        <AgreementBox
          title="개인정보 수집 및 이용 동의"
          description={<PrivacyAgreement />}
          isAgreement={isPrivacyAgreement}
          setIsAgreement={setIsPrivacyAgreement}
          isNecessary={true}
        />
        <AgreementBox
          title="커뮤니티 이용 규칙 확인"
          description={<CommunityAgreement />}
          isAgreement={isCommunityAgreement}
          setIsAgreement={setIsCommunityAgreement}
          isNecessary={true}
        />
        <AgreementBox
          title="마케팅 이용 • 수신 동의"
          description={<MarketingAgreement />}
          isAgreement={isMarketingAgreement}
          setIsAgreement={setIsMarketingAgreement}
          isNecessary={false}
        />
      </div>
      <p className="px-[20px] text-gray-60 text-med-12 pb-[200px]">
        <p>문의: support@bagstrap.team</p>
        <p>주식회사 아웃스탠더스</p>
      </p>
    </div>
  );
}
