import React from 'react';
import { useRouter } from 'next/router';

import {
  EntityType,
  FaGroupSummaryFragment,
  useRegisterBlockInteractionMutation,
  UserSummaryFragment
} from '@generated/graphql';

import InfoIcon from '@public/icons/info.svg';

import BaseButton from '@common/button/BaseButton';

import useModalDialog from '@hooks/useModalDialog.hook';

export default function useBlockInteractionModalDialog(
  entityType: EntityType,
  uuid: string,
  user?: Pick<UserSummaryFragment, 'uuid' | 'name'>,
  category?: NilableProps<Pick<FaGroupSummaryFragment, 'uuid' | 'name' | 'code'>> | null,
  sourceUrl?: string
): [React.ReactNode, () => void, () => void] {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = React.useState<string | undefined>();

  const [registerBlockInteraction] = useRegisterBlockInteractionMutation();

  const [el, openDialog, closeDialog] = useModalDialog(
    {
      size: errorMessage ? 'lg' : 'md',
      header: errorMessage ? (
        <p className="w-full text-center">[ 사용자 차단 실패 ]</p>
      ) : (
        <div className="pt-2">
          <InfoIcon className="text-black" />
        </div>
      ),
      body: errorMessage ? (
        <p className="typo-body5 text-grey5 text-center">{errorMessage}</p>
      ) : (
        <div className="">
          <div className="py-4 leading-none">
            <strong className="typo-body1 font-bold">사용자 차단</strong>
          </div>
          <div className="py-2 leading-none">
            <p className="typo-body5 break-all">[ {user?.name} ] 님을 차단할까요?</p>
          </div>
          <div className="py-2 leading-tight">
            <p className="typo-body6 font-light text-grey5">
              사용자를 차단하면
              <br />
              해당 사용자의 활동이 모두 숨겨집니다.
              <br />[ 다시 차단을 해제할 수 없습니다. ]
            </p>
          </div>
        </div>
      ),
      actions: errorMessage
        ? [
            <BaseButton
              onClick={() => {
                closeDialog();

                router.replace(
                  sourceUrl || (category?.uuid ? `/board/${category.uuid}` : '/')
                );
              }}
              className="flex-1 bg-black rounded-lg h-[42px] text-white typo-body6 font-semibold"
            >
              확인
            </BaseButton>,
            undefined
          ]
        : [
            <BaseButton
              onClick={() => {
                closeDialog();
              }}
              className="flex-1 border border-[#566789] border-opacity-[26%] rounded-lg h-[42px]"
            >
              <span className="text-[#151920] opacity-50 typo-body6 font-semibold">
                취소
              </span>
            </BaseButton>,
            <BaseButton
              onClick={() => {
                if (user && user.uuid) {
                  registerBlockInteraction({
                    variables: {
                      registerDto: {
                        parentEntityType: entityType,
                        parentEntityUuid: uuid,
                        targetEntityType: EntityType.User,
                        targetEntityUuid: user.uuid
                      }
                    },
                    onCompleted: () => {
                      if (router.pathname.startsWith('/my/alarm/message')) {
                        router.replace(router.pathname).then(value => {
                          if (value) {
                            router.reload();
                          }
                        });
                      } else {
                        router.back();
                      }
                    },
                    onError: err => {
                      setErrorMessage(err.message);
                    }
                  });
                }
              }}
              className="flex-1 bg-black rounded-lg h-[42px] text-white typo-body6 font-semibold"
            >
              차단하기
            </BaseButton>
          ]
    },
    () => {
      setErrorMessage(undefined);
    }
  );

  return user ? [el, openDialog, closeDialog] : [el, () => {}, () => {}];
}
