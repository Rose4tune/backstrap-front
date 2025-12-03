import clsx from 'clsx';
import { useState, useMemo, useEffect } from 'react';
import type { NextPage } from 'next';
import { observer } from 'mobx-react';
import { useMedia } from 'react-use';
import Link from 'next/link';

import { STUDENT_TYPE_LABEL } from '@constants/bagstrap/label/user.label.constant';
import { SCHOOL_VERIFICATION_STATUS_LABEL } from '@constants/bagstrap/label/school.label.constant';

import { useStore } from '@stores/useStore.hook';
import {
  SchoolVerificationStatus,
  useExistsNickNameLazyQuery,
  useEditUserMutation,
  useSetDefaultProfileImageMutation,
  StudentType
} from '@generated/graphql';
import ProfileChangerIcon from '@public/icons/profile-changer.svg';
import MyPageLayout from '@layouts/MyPageLayout';
import BaseLink from '@common/BaseLink';
import BaseButton from '@common/button/BaseButton';
import BaseTextInput from '@common/input/BaseTextInput';
import useModalDialog from '@hooks/useModalDialog.hook';
import useFileUpload from '@hooks/bagstrap/file/useFileUpload.hook';

import {
  ProfileFieldRowContainer,
  ProfileFieldRowTitleContainer,
  ProfileFieldRowTitleLabelAndDescription,
  ProfileFieldRowTitleLabel,
  ProfileFieldRowTitleDescription,
  ProfileFieldRowTitleAction,
  ProfileFieldRowValueContainer,
  ProfileFieldRowValue,
  ProfileFieldContainer,
  ProfileFieldImageChangeContainer,
  ProfileFieldImage,
  ProfileFieldImageChangeButton,
  ProfileFieldImageChangeButtonContainer,
  ProfileFieldImageUploadContainer,
  ProfileFieldImageUploadButton,
  ProfileFieldImageUploadFileName,
  ProfileFieldImageSaveButton,
  NicknameFieldContainer,
  NicknameFieldSaveButtonContainer,
  NicknameFieldValidText,
  SchoolVerificationFieldSchoolName,
  SchoolVerificationFieldStatusInReview,
  SchoolVerificationFieldStatusRejected
} from '@styles/pages/my/profile.style';

type UploadedFile = {
  uuid: string;
  name: string;
  url: string;
  fileObj?: File;
};

const MyProfilePage: NextPage = () => {
  const { MeStore } = useStore();

  const [isProfileImageChanging, setIsProfileImageChanging] = useState(false);
  const [isNicknameChanging, setIsNicknameChanging] = useState(false);
  const [isNicknameValid, setIsNicknameValid] = useState<boolean | undefined>();

  const [nickname, setNickname] = useState<string | undefined>();
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | undefined>();
  const [isProfileImageDeleted, setIsProfileImageDeleted] = useState(false);

  const [existsNickname] = useExistsNickNameLazyQuery();

  const [editUser] = useEditUserMutation();

  const [setDefaultProfileImage] = useSetDefaultProfileImageMutation();

  const isDesktop = useMedia('(min-width: 1024px)', true);

  const schoolVerifyLink =
    MeStore.getMe().studentType === StudentType.Postgrad
      ? '/user/cert/postgraduate'
      : '/user/cert/undergraduate';

  const [
    profileImageDeleteConfirmModalDialogEl,
    openProfileImageDeleteConfirmModalDialog,
    closeProfileImageDeleteConfirmModalDialog
  ] = useModalDialog({
    size: isDesktop ? 'md' : 'sm',
    header: '프로필 사진 삭제',
    body: <p className="typo-body5 text-grey5">정말로 삭제하시겠습니까?</p>,
    actions: [
      <BaseButton
        onClick={() => {
          closeProfileImageDeleteConfirmModalDialog();
        }}
        className="flex-1 border border-[#566789] border-opacity-[26%] rounded-lg h-[42px]"
      >
        <span className="text-[#151920] opacity-50 typo-body6 font-semibold">취소</span>
      </BaseButton>,
      <BaseButton
        onClick={() => {
          setUploadedFile(undefined);

          setIsProfileImageDeleted(true);

          closeProfileImageDeleteConfirmModalDialog();
        }}
        className="flex-1 bg-black rounded-lg h-[42px] text-white typo-body6 font-semibold"
      >
        삭제
      </BaseButton>
    ]
  });

  const [fileUploadEl, openFileUpload, isFileUploadLoading] = useFileUpload(
    {},
    ({ uuid, name, url, fileObj }) => {
      setUploadedFile({
        uuid,
        name,
        url,
        fileObj
      });
    },
    10 * 1000 * 1000 // 10mb
  );

  useEffect(() => {
    if (nickname && nickname !== MeStore.getMe().name) {
      existsNickname({
        variables: {
          nickname
        }
      }).then(({ data }) => {
        if (data) {
          setIsNicknameValid(!data.existsNickName);
        }
      });
    }
  }, [nickname, MeStore.me]);

  const imageUrl = useMemo(
    () => uploadedFile?.url || MeStore.getMe().profileImage,
    [uploadedFile, MeStore.me]
  );

  return (
    <MyPageLayout>
      {!!MeStore.getMe() && (
        <>
          <ProfileFieldRow
            label="프로필 사진"
            description="10Mb 이하의 JPG, GIF, PNG 파일을 지원합니다."
            value={
              <ProfileFieldContainer>
                <ProfileFieldImageChangeContainer>
                  <ProfileFieldImageChangeContainer>
                    {imageUrl && !isProfileImageDeleted ? (
                      <ProfileFieldImage src={imageUrl} />
                    ) : (
                      <ProfileChangerIcon />
                    )}

                    {isProfileImageChanging && imageUrl && !isProfileImageDeleted && (
                      <ProfileFieldImageChangeButton
                        onClick={() => {
                          openProfileImageDeleteConfirmModalDialog();
                        }}
                      >
                        삭제
                      </ProfileFieldImageChangeButton>
                    )}
                  </ProfileFieldImageChangeContainer>
                </ProfileFieldImageChangeContainer>

                {isProfileImageChanging && (
                  <ProfileFieldImageChangeButtonContainer>
                    <ProfileFieldImageUploadContainer>
                      <BaseButton
                        onClick={() => {
                          openFileUpload();
                        }}
                        className={clsx(
                          'border border-[#727272] w-[86px] h-7 rounded-[10px]',
                          'lg:w-[136px] lg:h-[44px]'
                        )}
                      >
                        <ProfileFieldImageUploadButton>
                          파일 업로드
                        </ProfileFieldImageUploadButton>
                      </BaseButton>

                      {uploadedFile && (
                        <ProfileFieldImageUploadFileName>
                          {uploadedFile?.name}
                        </ProfileFieldImageUploadFileName>
                      )}
                    </ProfileFieldImageUploadContainer>

                    <BaseButton
                      disabled={!(uploadedFile || isProfileImageDeleted)}
                      onClick={() => {
                        const onCompleted = () => {
                          MeStore.refetch().then(() => {
                            setIsProfileImageDeleted(false);
                            setIsProfileImageChanging(false);
                            setUploadedFile(undefined);
                          });
                        };

                        if (isProfileImageDeleted) {
                          setDefaultProfileImage({
                            onCompleted
                          });
                        }

                        if (uploadedFile) {
                          editUser({
                            variables: {
                              input: {
                                profileImageUrl: uploadedFile.url
                              }
                            },
                            onCompleted
                          });
                        }
                      }}
                      className={clsx(
                        'w-[86px] h-7 rounded-[10px]',
                        'lg:w-[136px] lg:h-[44px]',
                        uploadedFile || isProfileImageDeleted ? 'bg-black' : 'bg-grey3'
                      )}
                    >
                      <ProfileFieldImageSaveButton>저장</ProfileFieldImageSaveButton>
                    </BaseButton>
                  </ProfileFieldImageChangeButtonContainer>
                )}
              </ProfileFieldContainer>
            }
            action={
              <BaseButton
                onClick={() => {
                  setIsProfileImageChanging(prev => !prev);
                  setIsProfileImageDeleted(false);
                  setUploadedFile(undefined);
                }}
              >
                변경
              </BaseButton>
            }
          />
          <ProfileFieldRow label="이름" value={MeStore.getMe().realName} />
          <ProfileFieldRow
            label="닉네임"
            value={
              isNicknameChanging ? (
                <NicknameFieldContainer>
                  <BaseTextInput
                    value={nickname}
                    onChange={evt => {
                      setNickname(evt.target.value);
                    }}
                    inputProps={{
                      className: clsx(
                        'border border-grey2 rounded-full h-9',
                        'lg:h-[62px] lg:typo-body2'
                      )
                    }}
                  />
                  <NicknameFieldSaveButtonContainer>
                    <BaseButton
                      onClick={() => {
                        editUser({
                          variables: {
                            input: {
                              name: nickname
                            }
                          },
                          onCompleted: ({ editUser }) => {
                            MeStore.refetch().then(() => {
                              setIsNicknameChanging(false);
                            });
                          }
                        });
                      }}
                      className={clsx(
                        'flex-center rounded-[10px] h-7 px-8',
                        'text-white typo-body7 font-medium underline',
                        'lg:typo-body3 lg:h-[44px] lg:px-12',
                        isNicknameValid && nickname && nickname !== MeStore.getMe().name
                          ? 'bg-black'
                          : 'bg-grey3'
                      )}
                    >
                      저장
                    </BaseButton>
                    {isNicknameValid != null && nickname && (
                      <NicknameFieldValidText isNicknameValid={isNicknameValid}>
                        {isNicknameValid
                          ? '사용 가능한 닉네임입니다.'
                          : '이미 사용중인 닉네임입니다.'}
                      </NicknameFieldValidText>
                    )}
                  </NicknameFieldSaveButtonContainer>
                </NicknameFieldContainer>
              ) : (
                MeStore.getMe().name
              )
            }
            action={
              <BaseButton
                onClick={() => {
                  setIsNicknameChanging(prev => !prev);
                  setIsNicknameValid(undefined);
                  MeStore.getMe().name && setNickname(MeStore.getMe().name!);
                }}
              >
                변경
              </BaseButton>
            }
          />
          <ProfileFieldRow
            label="소속"
            value={
              MeStore.getMe().studentType &&
              STUDENT_TYPE_LABEL[MeStore.getMe().studentType!]
            }
          />

          <ProfileFieldRow
            label="학교"
            value={
              MeStore.getMe().schoolVerificationStatus && (
                <>
                  {MeStore.getMe().schoolVerificationStatus ===
                    SchoolVerificationStatus.Approved && (
                    <SchoolVerificationFieldSchoolName>
                      {MeStore.getMe().school?.name}
                    </SchoolVerificationFieldSchoolName>
                  )}

                  {MeStore.getMe().schoolVerificationStatus ===
                    SchoolVerificationStatus.InReview && (
                    <SchoolVerificationFieldStatusInReview>
                      {
                        SCHOOL_VERIFICATION_STATUS_LABEL[
                          MeStore.getMe().schoolVerificationStatus!
                        ]
                      }
                    </SchoolVerificationFieldStatusInReview>
                  )}

                  {(MeStore.getMe().schoolVerificationStatus ===
                    SchoolVerificationStatus.Rejected ||
                    MeStore.getMe().schoolVerificationStatus ===
                      SchoolVerificationStatus.None) && (
                    <SchoolVerificationFieldStatusRejected>
                      {
                        SCHOOL_VERIFICATION_STATUS_LABEL[
                          MeStore.getMe().schoolVerificationStatus!
                        ]
                      }
                    </SchoolVerificationFieldStatusRejected>
                  )}
                </>
              )
            }
            action={
              (MeStore.getMe().schoolVerificationStatus ===
                SchoolVerificationStatus.None ||
                MeStore.getMe().schoolVerificationStatus ===
                  SchoolVerificationStatus.Rejected) && (
                <BaseLink href={schoolVerifyLink}>학교 인증</BaseLink>
              )
            }
          />

          <ProfileFieldRow label="ID" value={MeStore.getMe().email} />
          <Link href="/careers/bookmarked" passHref>
            <ProfileFieldRow label="북마크한 채용끈" />
          </Link>
        </>
      )}

      {fileUploadEl}
      {profileImageDeleteConfirmModalDialogEl}
    </MyPageLayout>
  );
};

export default observer(MyProfilePage);

// const ProfileImage = ({
//   fileObj,
//   url,
// }: {
//   fileObj?: File;
//   url?: string;
// }): JSX.Element => {
//   const [, blob] = useFileRead(fileObj!);

//   return <>{blob && <img src={blob} className="w-full h-full" />}</>;
// };

const ProfileFieldRow = ({
  label,
  description,
  value,
  action
}: {
  label: string;
  description?: string;
  value?: React.ReactNode;
  action?: React.ReactNode;
}): JSX.Element => {
  return (
    <ProfileFieldRowContainer>
      <ProfileFieldRowTitleContainer>
        <ProfileFieldRowTitleLabelAndDescription>
          <ProfileFieldRowTitleLabel>{label}</ProfileFieldRowTitleLabel>
          <ProfileFieldRowTitleDescription>{description}</ProfileFieldRowTitleDescription>
        </ProfileFieldRowTitleLabelAndDescription>
        <ProfileFieldRowTitleAction>{action}</ProfileFieldRowTitleAction>
      </ProfileFieldRowTitleContainer>
      <ProfileFieldRowValueContainer>
        <ProfileFieldRowValue>{value}</ProfileFieldRowValue>
      </ProfileFieldRowValueContainer>
    </ProfileFieldRowContainer>
  );
};
