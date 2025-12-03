/* eslint-disable react/jsx-key */
import React, { useCallback, useMemo } from 'react';

import {
  UserEditDtoInput,
  useEditUserMutation,
  useRegisterTotiMentorMutation,
  SchoolVerificationStatus
} from '@generated/graphql';

import InfoIcon from '@public/icons/info.svg';
import BaseButton from '@common/button/BaseButton';
import useModalDialog from '@hooks/useModalDialog.hook';
import { PostgradCertFormValues } from '@common/bagstrap/school/PostgradCertForm';
import { SchoolCertDtoInput } from './useSchoolCertConfirmModalDialog.hook';

export type PostgradCertDtoInput = Omit<PostgradCertFormValues, 'files'> &
  Pick<UserEditDtoInput, 'files'>;

export default function usePostgradCertConfirmModalDialog(
  onSubmit?: (input: PostgradCertDtoInput) => void
): [React.ReactNode, (input: PostgradCertDtoInput) => void, () => void] {
  const [dtoInput, setDtoInput] = React.useState<PostgradCertDtoInput | undefined>();
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>();

  const [editUser, editUserMutationResult] = useEditUserMutation();
  const [registerTotiMentor, registerTotiMentorMutationResult] =
    useRegisterTotiMentorMutation();

  const isSubModal =
    editUserMutationResult.data &&
    editUserMutationResult.data.editUser.schoolVerificationStatus !==
      SchoolVerificationStatus.None &&
    !!registerTotiMentorMutationResult.data?.registerTotiMentor.uuid;

  const modalSize = isSubModal || errorMessage ? 'lg' : 'md';

  const modalHeaderComponent = useMemo(() => {
    if (errorMessage) {
      return <p className="w-full text-center">학교인증 신청 실패</p>;
    } else {
      if (isSubModal) {
        return <p className="w-full text-center">학교인증 신청 완료</p>;
      } else {
        return (
          <div className="pt-2">
            <InfoIcon className="text-point-primary" />
          </div>
        );
      }
    }
  }, [errorMessage, isSubModal]);

  const modalBodyComponent = useMemo(() => {
    if (errorMessage) {
      return <p className="typo-body5 text-grey5 text-center">{errorMessage}</p>;
    } else {
      if (isSubModal) {
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
  }, [errorMessage, isSubModal]);

  const onClickConfirm = useCallback(() => {
    if (dtoInput) {
      const totiMentorRegisterDto = { ...dtoInput, name: '' };
      delete totiMentorRegisterDto.files;

      const editUserDto: SchoolCertDtoInput = {
        major: dtoInput.degreeMajor,
        schoolName: dtoInput.degreeCollege,
        files: dtoInput.files
      };

      // NOTE: 학교 인증과 토티 멘토 생성이 별개로 구성되어 있어서 요청을 2번 보내야 함. (서버 로직 수정 필요)
      editUser({
        variables: {
          input: editUserDto
        },
        onCompleted: () => {
          registerTotiMentor({
            variables: {
              input: totiMentorRegisterDto
            },
            onError: err => {
              setErrorMessage(err.message);

              // NOTE: registerTotiMentor에서 에러가 날 경우, 앞서 요청한 editUser를 되돌리는 작업.
              editUser({
                variables: {
                  input: {
                    major: undefined,
                    schoolName: undefined,
                    files: undefined
                  }
                }
              });
            }
          });
        },
        onError: err => {
          setErrorMessage(err.message);
        }
      });
    }
  }, [dtoInput, editUser, registerTotiMentor]);

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
        loading={
          editUserMutationResult.loading || registerTotiMentorMutationResult.loading
        }
        onClick={onClickConfirm}
        className="flex-1 bg-black rounded-lg h-[42px] text-white typo-body6 font-semibold"
        loaderColor="#ffffff"
      >
        학교 인증 신청
      </BaseButton>
    ];
  }, [
    editUserMutationResult.loading,
    registerTotiMentorMutationResult.loading,
    onClickConfirm
  ]);

  const formErrorModalButtons: [React.ReactNode, React.ReactNode] = useMemo(() => {
    return [
      <BaseButton
        onClick={() => {
          closeDialog();

          if (isSubModal && dtoInput) {
            onSubmit?.call(null, dtoInput);
          }
        }}
        className="flex-1 bg-black rounded-lg h-[42px] text-white typo-body6 font-semibold"
      >
        확인
      </BaseButton>,
      undefined
    ];
  }, [dtoInput, isSubModal, onSubmit]);

  const modalActions =
    isSubModal || errorMessage ? formErrorModalButtons : formSuccessModalButtons;

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
