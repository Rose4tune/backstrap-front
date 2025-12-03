import clsx from 'clsx';
import React from 'react';
import { useFormikContext } from 'formik';

import { formatTimeDisplay } from '@utils/common/time.util';

import {
  useSendVerificationCodeMutation,
  useSendResetPasswordEmailMutation,
  useVerifyCodeMutation
} from '@generated/graphql';

import CheckIcon from '@public/icons/[sign]check.svg';

import BaseButton from '@common/button/BaseButton';
import BaseTextInput from '@common/input/BaseTextInput';
import BaseFormTextField from '@common/form/BaseFormTextField';
import HelperMessage from '@common/bagstrap/etc/HelperMessage';

import useTimer from '@hooks/bagstrap/etc/useTimer.hook';
import { InputType } from 'types/inputTypes';

import {
  EmailFormContainer,
  EmailFieldContainer,
  EmailField,
  EmailSendContainer,
  EmailSendTimer,
  EmailSendTimerText,
  Empty,
  Br,
  CodeFieldContainer,
  CodeFieldVerifiedContainer,
  CodeFieldVerifiedText,
  CodeFieldInputContainer
} from './UserEmailVerificationFormRow.style';

export interface UserEmailVerificationFormRowProps {
  type: 'signup' | 'password';

  onEmailVerified?: (email: string) => void;
}

const EXPIRATION_TIME = 60 * 10; // 10 mins

const UserEmailVerificationFormRow = (
  props: UserEmailVerificationFormRowProps
): JSX.Element => {
  const { type, onEmailVerified } = props;

  const [isSent, setIsSent] = React.useState(false);
  const [verificationCode, setVerificationCode] = React.useState('');
  const [sendErrorMessage, setSendErrorMessage] = React.useState<string | undefined>();
  const [verificationErrorMessage, setVerificationErrorMessage] = React.useState<
    string | undefined
  >();

  const formik = useFormikContext<{ isEmailVerified?: boolean }>();

  const emailField = formik.getFieldMeta<string | undefined>('email');

  const email = emailField.value;

  const nameField = formik.getFieldMeta<string | undefined>('name');

  const name = nameField.value;

  const isEmailVerifiedField = formik.getFieldMeta<boolean | undefined>(
    'isEmailVerified'
  );

  const isEmailVerified = isEmailVerifiedField.value;

  const isEmailSendEnabled = !emailField.error && (type === 'signup' || !nameField.error);

  const [sendVerificationCode] = useSendVerificationCodeMutation();
  const [sendResetPasswordEmail] = useSendResetPasswordEmailMutation();
  const [verifyCode] = useVerifyCodeMutation();

  const [time, startTimer, stopTimer] = useTimer(EXPIRATION_TIME, () => {
    // setIsSent(false);
  });

  const handleEmailSend = () => {
    if (type === 'signup' && email) {
      sendVerificationCode({
        variables: {
          email
        },
        onCompleted: () => {
          setIsSent(true);
          setSendErrorMessage(undefined);
          startTimer(EXPIRATION_TIME);
        },
        onError: err => {
          setSendErrorMessage(err.message);
        }
      });
    }

    if (type === 'password' && email && name) {
      sendResetPasswordEmail({
        variables: {
          email,
          name
        },
        onCompleted: ({ sendResetPasswordEmail }) => {
          setIsSent(true);
          setSendErrorMessage(undefined);
          startTimer(EXPIRATION_TIME);
        },
        onError: err => {
          setSendErrorMessage(err.message);
        }
      });
    }
  };

  return (
    <EmailFormContainer>
      <EmailFieldContainer>
        <EmailField>
          <BaseFormTextField
            inputType={InputType.FullBorder}
            name="email"
            placeholder="아이디 (이메일)"
            className="flex-[2]"
            onChange={() => {
              setIsSent(false);
              setSendErrorMessage(undefined);
            }}
            disabled={isEmailVerified}
          />

          {!isEmailVerified && (
            <>
              {isSent ? (
                <EmailSendContainer>
                  {/* timer */}
                  <EmailSendTimer>
                    <EmailSendTimerText>{formatTimeDisplay(time)}</EmailSendTimerText>
                  </EmailSendTimer>

                  {/* resent */}
                  <BaseButton
                    disabled={!isEmailSendEnabled}
                    onClick={() => {
                      handleEmailSend();
                    }}
                    className="flex-center rounded-[5px] bg-black h-6 min-w-[60px] text-white typo-body9 font-bold"
                    fullWidth
                  >
                    재전송 요청
                  </BaseButton>
                </EmailSendContainer>
              ) : (
                <BaseButton
                  disabled={!isEmailSendEnabled}
                  className={clsx(
                    'border rounded-[10px] typo-body8 font-bold',
                    'h-[50px] px-2.5',
                    'md:px-6 md:typo-body5',
                    isEmailSendEnabled
                      ? 'border-point-blue text-point-blue'
                      : 'border-grey2 text-grey2'
                  )}
                  onClick={() => {
                    handleEmailSend();
                  }}
                >
                  인증번호<Empty>&nbsp;</Empty>
                  <Br />
                  전송
                </BaseButton>
              )}
            </>
          )}
        </EmailField>

        {emailField.touched && emailField.error ? (
          <HelperMessage type="error" size="sm" text={emailField.error} />
        ) : (
          <>
            {sendErrorMessage && (
              <HelperMessage type="error" size="sm" text={sendErrorMessage} />
            )}
          </>
        )}

        {isSent && (
          <HelperMessage
            type="info"
            size="sm"
            color="#6990EF"
            text="위 이메일 주소로 6자리 인증번호를 전송했습니다."
          />
        )}
      </EmailFieldContainer>

      <CodeFieldContainer>
        {isEmailVerified ? (
          <CodeFieldVerifiedContainer>
            <CheckIcon />
            <CodeFieldVerifiedText>이메일이 인증되었습니다.</CodeFieldVerifiedText>
          </CodeFieldVerifiedContainer>
        ) : (
          <CodeFieldInputContainer>
            <BaseTextInput
              disabled={!isSent}
              type="password"
              name="verificationCode"
              value={verificationCode}
              onChange={evt => {
                setVerificationCode(evt.target.value);
                setVerificationErrorMessage(undefined);
              }}
              maxLength={6}
              placeholder="인증번호를 입력하세요"
              autoComplete="off"
              className="flex-[2]"
              inputProps={{
                className: clsx(
                  'border rounded-[10px] h-[50px]',
                  isSent
                    ? 'border-point-blue placeholder:text-point-blue text-point-blue'
                    : 'bg-grey1 border-grey2 placeholder:text-grey3'
                )
              }}
            />

            {isSent && (
              <BaseButton
                onClick={() => {
                  if (email && verificationCode) {
                    verifyCode({
                      variables: {
                        email,
                        code: verificationCode
                      },
                      onCompleted: ({ verifyCode }) => {
                        if (verifyCode.verifiedAt) {
                          formik.setFieldValue('isEmailVerified', true);
                          setVerificationErrorMessage(undefined);
                          stopTimer();
                          onEmailVerified?.call(null, verifyCode.email!);
                        } else {
                          formik.setFieldValue('isEmailVerified', false);
                        }
                      },
                      onError: err => {
                        setVerificationErrorMessage(err.message);
                      }
                    });
                  }
                }}
                className={clsx(
                  'bg-point-blue rounded-[10px]',
                  'h-[50px] min-w-[60px]',
                  'text-white typo-body8 font-bold',
                  'md:flex-1 md:typo-body5'
                )}
              >
                인증하기
              </BaseButton>
            )}
          </CodeFieldInputContainer>
        )}

        {verificationErrorMessage && (
          <HelperMessage type="error" size="sm" text={verificationErrorMessage} />
        )}
      </CodeFieldContainer>
    </EmailFormContainer>
  );
};

export default UserEmailVerificationFormRow;
