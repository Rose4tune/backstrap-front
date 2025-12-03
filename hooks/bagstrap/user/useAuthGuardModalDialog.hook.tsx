import React from 'react';
import { useRouter } from 'next/router';

import InfoIcon from '@public/icons/info.svg';

import BaseButton from '@common/button/BaseButton';

import useModalDialog from '@hooks/useModalDialog.hook';

export default function useAuthGuardModalDialog(): [
  React.ReactNode,
  () => void,
  () => void
] {
  const router = useRouter();

  const [el, openDialog, closeDialog] = useModalDialog({
    size: 'md',
    header: (
      <div className="pt-2">
        <InfoIcon className="text-primary" />
      </div>
    ),
    body: (
      <div className="">
        <div className="py-4 leading-none">
          <p className="typo-body1 font-bold">로그인이 필요합니다.</p>
        </div>
        <div className="py-2">
          <p className="typo-body5">
            지금 로그인하시고 전국 대학원생들과
            <br />더 자유롭게 소통하세요!
          </p>
        </div>
      </div>
    ),
    actions: [
      <BaseButton
        onClick={() => {
          closeDialog();
        }}
        className="flex-1 border border-[#566789] border-opacity-[26%] rounded-lg h-[42px]"
      >
        <span className="text-[#151920] opacity-50 typo-body6 font-semibold">취소</span>
      </BaseButton>,
      <BaseButton
        autoFocus
        onClick={() => {
          const redirectUri = router.asPath.includes('mentoring')
            ? '/mentoring'
            : router.asPath;

          router.push(`/user/sign-in?redirectUri=${redirectUri}`);
          closeDialog();
        }}
        className="flex-1 bg-primary rounded-lg h-[42px] text-white typo-body6 font-semibold"
      >
        로그인 하러가기
      </BaseButton>
    ]
  });

  return [el, openDialog, closeDialog];
}
