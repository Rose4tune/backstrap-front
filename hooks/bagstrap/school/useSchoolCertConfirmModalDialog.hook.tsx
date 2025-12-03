import React, { useMemo } from 'react';

import {
  UserEditDtoInput,
  useEditUserMutation,
  SchoolVerificationStatus
} from '@generated/graphql';
import InfoIcon from '@public/icons/info.svg';
import BaseButton from '@common/button/BaseButton';
import useModalDialog from '@hooks/useModalDialog.hook';

export type SchoolCertDtoInput = Pick<UserEditDtoInput, 'major' | 'schoolName' | 'files'>;

export default function useSchoolCertConfirmModalDialog(
  onSubmit?: (input: SchoolCertDtoInput) => void
): [React.ReactNode, (input: SchoolCertDtoInput) => void, () => void] {
  const [dtoInput, setDtoInput] = React.useState<SchoolCertDtoInput | undefined>();
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>();

  const [editUser, editUserMutationResult] = useEditUserMutation();

  const modalSize =
    (editUserMutationResult.data &&
      editUserMutationResult.data.editUser.schoolVerificationStatus !==
        SchoolVerificationStatus.None) ||
    errorMessage
      ? 'lg'
      : 'md';

  const modalHeaderComponent = useMemo(() => {
    if (errorMessage) {
      return <p className="w-full text-center">학교인증 신청 실패</p>;
    } else {
      if (
        editUserMutationResult.data &&
        editUserMutationResult.data.editUser.schoolVerificationStatus !==
          SchoolVerificationStatus.None
      ) {
        return <p className="w-full text-center">학교인증 신청 완료</p>;
      } else {
        return (
          <div className="pt-2">
            <InfoIcon className="text-point-primary" />
          </div>
        );
      }
    }
  }, [editUserMutationResult.data, errorMessage]);

  const modalBodyComponent = useMemo(() => {
    if (errorMessage) {
      return <p className="typo-body5 text-grey5 text-center">{errorMessage}</p>;
    } else {
      if (
        editUserMutationResult.data &&
        editUserMutationResult.data.editUser.schoolVerificationStatus !==
          SchoolVerificationStatus.None
      ) {
        return (
          <p className="typo-body5 text-grey5 text-center">
            인증 처리는 영업일 기준
            <br />
            1-3일 소요됩니다.
          </p>
        );
      } else {
        return (
          <div className="">
            <div className="py-4 leading-none">
              <p className="typo-body1 font-bold">학교 인증 신청</p>
            </div>
            <div className="py-2">
              <p className="typo-body5 break-all">
                증빙 자료의 내용과 입력하신 내용이
                <br />
                상이할 경우 인증이 반려됩니다.
              </p>
            </div>
            <div>
              <p className="text-grey5 typo-body6 font-light break-all">
                인증 신청 결과는 마이페이지에서 조회하시거나 가방끈 APP/WEB 소식 탭으로
                받아보실 수 있습니다.
              </p>
            </div>
          </div>
        );
      }
    }
  }, [editUserMutationResult.data, errorMessage]);

  const formSuccessModalButtons: [React.ReactNode, React.ReactNode] = useMemo(() => {
    return [
      <BaseButton
        onClick={() => {
          closeDialog();
        }}
        className="flex-1 border border-[#566789] border-opacity-[26%] rounded-lg h-[42px]"
      >
        <span className="text-[#151920] opacity-50 typo-body6 font-semibold">취소</span>
      </BaseButton>,
      <BaseButton
        loading={editUserMutationResult.loading}
        onClick={() => {
          if (dtoInput) {
            editUser({
              variables: {
                input: dtoInput
              },
              onError: err => {
                setErrorMessage(err.message);
              }
            });
          }
        }}
        className="flex-1 bg-black rounded-lg h-[42px] text-white typo-body6 font-semibold"
      >
        학교 인증 신청
      </BaseButton>
    ];
  }, [dtoInput, editUser]);

  const formErrorModalButtons: [React.ReactNode, React.ReactNode] = useMemo(() => {
    return [
      <BaseButton
        onClick={() => {
          closeDialog();

          if (
            editUserMutationResult.data &&
            editUserMutationResult.data.editUser.schoolVerificationStatus !==
              SchoolVerificationStatus.None &&
            dtoInput
          ) {
            onSubmit?.call(null, dtoInput);
          }
        }}
        className="flex-1 bg-black rounded-lg h-[42px] text-white typo-body6 font-semibold"
      >
        확인
      </BaseButton>,
      undefined
    ];
  }, [dtoInput, editUserMutationResult.data, onSubmit]);

  const modalActions =
    (editUserMutationResult.data &&
      editUserMutationResult.data.editUser.schoolVerificationStatus !==
        SchoolVerificationStatus.None) ||
    errorMessage
      ? formErrorModalButtons
      : formSuccessModalButtons;

  const [el, openDialog, closeDialog] = useModalDialog(
    {
      // loading: editUserMutationResult.loading,
      size: modalSize,
      header: modalHeaderComponent,
      body: modalBodyComponent,
      actions: modalActions
    },
    () => {
      setDtoInput(undefined);
      setErrorMessage(undefined);
    }
  );

  return [
    el,
    input => {
      setDtoInput(input);

      openDialog();
    },
    closeDialog
  ];
}
