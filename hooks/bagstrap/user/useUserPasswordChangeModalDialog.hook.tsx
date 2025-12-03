import React from 'react';
import { useMedia } from 'react-use';
import { useRouter } from 'next/router';

import { useEditUserMutation } from '@generated/graphql';

import BaseButton from '@common/button/BaseButton';

import useModalDialog from '@hooks/useModalDialog.hook';
import useAuthPersistence from '@hooks/useAuthPersistence.hook';

export default function useUserPasswordChangeModalDialog(
  currentPassword: string
): [React.ReactNode, (password: string) => void, () => void] {
  const router = useRouter();

  const [password, setPassword] = React.useState<string | undefined>();

  const [, , reset] = useAuthPersistence();

  const isDesktop = useMedia('(min-width: 1024px)');

  const [editUser, editUserMutationResult] = useEditUserMutation();

  const [el, openDialog, closeDialog] = useModalDialog({
    loading: editUserMutationResult.loading,
    size: isDesktop ? 'md' : 'sm',
    header: editUserMutationResult.data?.editUser ? (
      <p className="w-full text-center">비밀번호 변경 완료</p>
    ) : editUserMutationResult.error ? (
      <p className="w-full text-center">비밀번호 변경 실패</p>
    ) : (
      <p>비밀번호를 변경할까요?</p>
    ),
    body: editUserMutationResult.data?.editUser ? (
      <p className="text-grey5 typo-body5 text-center py-2">
        비밀번호를 성공적으로 변경했습니다.
        <br />
        지금 다시 로그인해주세요.
      </p>
    ) : editUserMutationResult.error ? (
      <p className="text-grey5 typo-body5 py-2">{editUserMutationResult.error.message}</p>
    ) : (
      <p className="text-grey5 typo-body5 py-2">
        비밀번호 변경시
        {isDesktop ? ' ' : <br />}
        재로그인이 필요합니다.
      </p>
    ),
    actions:
      editUserMutationResult.data?.editUser || editUserMutationResult.error
        ? [
            <BaseButton
              onClick={() => {
                closeDialog();

                if (editUserMutationResult.data?.editUser) {
                  reset();

                  router.replace('/user/sign-in');

                  // editUserMutationResult.reset();
                }
              }}
              className="flex-1 bg-black rounded-lg h-[42px] font-medium text-white typo-body6"
            >
              {editUserMutationResult.data?.editUser ? '로그인' : '확인'}
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
                if (password) {
                  editUser({
                    variables: {
                      input: {
                        currentPassword,
                        password
                      }
                    }
                  });
                }
              }}
              className="flex-1 bg-black rounded-lg h-[42px] font-medium text-white typo-body6"
            >
              비밀번호 변경
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
