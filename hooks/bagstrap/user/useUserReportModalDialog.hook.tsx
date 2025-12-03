import React from 'react';

import {
  EntityType,
  useRegisterUserReportMutation,
  UserReportType,
  UserSummaryFragment
} from '@generated/graphql';

import InfoIcon from '@public/icons/info.svg';

import BaseButton from '@common/button/BaseButton';

import useModalDialog from '@hooks/useModalDialog.hook';

export default function useUserReportModalDialog(
  entityType: EntityType,
  uuid: string,
  user?: Pick<UserSummaryFragment, 'uuid' | 'name'>,
  title?: string | null
): [React.ReactNode, () => void, () => void] {
  const [userReportUuid, setUserReportUuid] = React.useState<string | undefined>();
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>();

  const [registerUserReport, registerUserReportMutationResult] =
    useRegisterUserReportMutation();

  const [el, openDialog, closeDialog] = useModalDialog(
    {
      // loading: registerUserReportMutationResult.loading,
      size: userReportUuid || errorMessage ? 'lg' : 'md',
      header: errorMessage ? (
        <p className="w-full text-center">신고 접수 실패</p>
      ) : userReportUuid ? (
        <p className="w-full text-center">신고가 접수되었습니다.</p>
      ) : (
        <div className="pt-2">
          <InfoIcon className="text-point-red" />
        </div>
      ),
      body: errorMessage ? (
        <p className="typo-body5 text-grey5 text-center">{errorMessage}</p>
      ) : userReportUuid ? (
        <p className="typo-body5 text-grey5 text-center">
          신고 내용은 앱 이용약관 및 정책에 따라 처리되며,
          <br />
          허위 신고 시 서비스 이용이 제한될 수 있습니다.
        </p>
      ) : (
        <div className="">
          <div className="py-4 leading-none">
            <p className="typo-body1 font-bold">
              {entityType === EntityType.Board && '이 글을 신고할까요?'}
              {entityType === EntityType.Review && '이 댓글을 신고할까요?'}
              {entityType === EntityType.User && '이 사용자를 신고할까요?'}
            </p>
          </div>
          <div className="py-2">
            {entityType === EntityType.User ? (
              <p className="typo-body5 break-all flex">
                [&nbsp;
                <div className="break-all line-clamp-1 text-ellipsis overflow-hidden">
                  {user?.name}
                </div>
                &nbsp;] 님
              </p>
            ) : (
              <>
                <p className="typo-body5 break-all flex">
                  [&nbsp;
                  <div className="break-all line-clamp-1 text-ellipsis overflow-hidden">
                    {user?.name}
                  </div>
                  &nbsp;] 님이 쓰신&nbsp;
                </p>
                <br />
                <span className="flex">
                  [&nbsp;
                  <div className="break-all line-clamp-1 text-ellipsis overflow-hidden">
                    {title}
                  </div>
                  &nbsp;]
                </span>
              </>
            )}
          </div>
        </div>
      ),
      actions:
        userReportUuid || errorMessage
          ? [
              <BaseButton
                onClick={() => {
                  closeDialog();
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
                    registerUserReport({
                      variables: {
                        input: {
                          parentEntityType: entityType,
                          parentEntityUuid: uuid,
                          reportedUuid: user.uuid,
                          userReportType: UserReportType.Abuse
                        }
                      },
                      onCompleted: ({ registerUserReport }) => {
                        if (registerUserReport.uuid) {
                          setUserReportUuid(registerUserReport.uuid);
                        }
                      },
                      onError: err => {
                        setErrorMessage(err.message);
                      }
                    });
                  }
                }}
                className="flex-1 bg-point-red rounded-lg h-[42px] text-white typo-body6 font-semibold"
              >
                신고하기
              </BaseButton>
            ]
    },
    () => {
      setUserReportUuid(undefined);
      setErrorMessage(undefined);
    }
  );

  return user ? [el, openDialog, closeDialog] : [el, () => {}, () => {}];
}
