import React from 'react';
import { useMedia } from 'react-use';
import { useRouter } from 'next/router';

import { useResetUserPasswordMutation } from '@generated/graphql';

import BaseButton from '@common/button/BaseButton';

import useModalDialog from '@hooks/useModalDialog.hook';
import useAuthContext from '@hooks/useAuthContext.hook';

export default function useUserPasswordResetModalDialog(
  email: string
): [React.ReactNode, (password: string) => void, () => void] {
  const router = useRouter();

  const [password, setPassword] = React.useState<string | undefined>();

  const authContext = useAuthContext();

  const isDesktop = useMedia('(min-width: 1024px)');

  const [resetUserPassword, resetPasswordMutationrResult] =
    useResetUserPasswordMutation();

  const [el, openDialog, closeDialog] = useModalDialog({
    loading: resetPasswordMutationrResult.loading,
    size: isDesktop ? 'md' : 'sm',
    header: resetPasswordMutationrResult.data?.resetUserPassword ? (
      <p className="w-full text-center">비밀번호 재설정 완료</p>
    ) : resetPasswordMutationrResult.error ? (
      <p className="w-full text-center">비밀번호 재설정 실패</p>
    ) : (
      <p>비밀번호를 재설정할까요?</p>
    ),
    body: resetPasswordMutationrResult.data?.resetUserPassword ? (
      <p className="text-grey5 typo-body5 text-center py-2">
        비밀번호를 성공적으로 재설정했습니다.
        <br />
        지금 다시 로그인해주세요.
      </p>
    ) : resetPasswordMutationrResult.error ? (
      <p className="text-grey5 typo-body5 py-2">
        {resetPasswordMutationrResult.error.message}
      </p>
    ) : (
      <p className="text-grey5 typo-body5 py-2">
        비밀번호 재설정시
        {isDesktop ? ' ' : <br />}
        재로그인이 필요합니다.
      </p>
    ),
    actions:
      resetPasswordMutationrResult.data?.resetUserPassword ||
      resetPasswordMutationrResult.error
        ? [
            <BaseButton
              onClick={() => {
                closeDialog();

                if (resetPasswordMutationrResult.data?.resetUserPassword) {
                  authContext.resetAuthPayload?.call(null, true);

                  router.replace('/user/sign-in');

                  // resetPasswordMutationrResult.reset();
                }
              }}
              className="flex-1 bg-black rounded-lg h-[42px] font-medium text-white typo-body6"
            >
              {resetPasswordMutationrResult.data?.resetUserPassword ? '로그인' : '확인'}
            </BaseButton>,
            undefined
          ]
        : [
            <BaseButton
              className="flex-1 border border-[#566789] border-opacity-[26%] rounded-lg h-[42px]"
              onClick={() => {
                closeDialog();
              }}
            >
              <span className="font-medium text-[#151920] typo-body6 opacity-50">
                취소
              </span>
            </BaseButton>,
            <BaseButton
              onClick={() => {
                // console.log(password);
                if (password) {
                  resetUserPassword({
                    variables: {
                      email,
                      password
                    }
                  });
                }
              }}
              className="flex-1 bg-black rounded-lg h-[42px] font-medium text-white typo-body6"
            >
              재설정
            </BaseButton>
          ]
  });

  return [
    el,
    password => {
      setPassword(password);

      openDialog();
    },
    closeDialog
  ];
}
