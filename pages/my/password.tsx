import clsx from 'clsx';
import React from 'react';
import type { NextPage } from 'next';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';

import { useStore } from '@stores/useStore.hook';
import { SocialProvider, useCheckPasswordLazyQuery } from '@generated/graphql';

import MyPageLayout from '@layouts/MyPageLayout';

import BaseLink from '@common/BaseLink';
import BaseButton from '@common/button/BaseButton';
import MuiOutlinedTextInput from '@common/input/mui/MuiTextInput';
import UserPasswordChangeForm from '@common/bagstrap/user/UserPasswordChangeForm';
import HelperMessage from '@common/bagstrap/etc/HelperMessage';

const MyPasswordPage: NextPage = () => {
  const [currentPassword, setCurrentPassword] = React.useState<string | undefined>();

  const router = useRouter();
  const { MeStore } = useStore();

  React.useEffect(() => {
    if (MeStore.getMe().provider !== SocialProvider.App) {
      router.replace('/my/profile');
    }
  }, [MeStore.me]);

  return (
    <MyPageLayout>
      <div
        className={clsx(
          'max-w-[484px] mx-auto',
          'pt-5',
          'md:border md:border-grey2 md:rounded-[10px] md:my-8 md:pt-0'
        )}
      >
        <div className={clsx('hidden', 'md:block md:py-9')}>
          <h1 className={clsx('typo-body1 font-bold text-center')}>비밀번호 변경</h1>
        </div>
        {currentPassword ? (
          <section className={clsx('px-6', 'md:px-9')}>
            <UserPasswordChangeForm currentPassword={currentPassword} />
          </section>
        ) : (
          <PasswordCheckSection
            onPasswordCheckCompleted={password => {
              setCurrentPassword(password);
            }}
          />
        )}
      </div>
    </MyPageLayout>
  );
};

export default observer(MyPasswordPage);

const PasswordCheckSection = ({
  onPasswordCheckCompleted
}: {
  onPasswordCheckCompleted: (password: string) => void;
}): JSX.Element => {
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>();

  const [checkPassword, checkPasswordQueryResult] = useCheckPasswordLazyQuery({
    onCompleted: ({ checkPassword }) => {
      if (checkPassword) {
        onPasswordCheckCompleted(password);
      } else {
        setErrorMessage(
          '잘못된 비밀번호입니다. 다시 시도하거나 비밀번호를 재설정하세요.'
        );
      }
    },
    onError: err => {
      setErrorMessage(err.message);
    }
  });

  React.useEffect(() => {
    if (errorMessage) {
      setErrorMessage(undefined);
    }
  }, [password]);

  const hasError =
    !!errorMessage ||
    (checkPasswordQueryResult.data ?? checkPasswordQueryResult.previousData)
      ?.checkPassword === false;

  return (
    <section className={clsx('px-6 space-y-4', 'md:px-9 md:space-y-7')}>
      <p className={clsx('typo-body7 font-medium text-center', 'md:typo-body5')}>
        보안을 위해 현재 사용중인 비밀번호를 입력해주세요.
      </p>

      <div className={clsx('space-y-5', 'md:space-y-7')}>
        <div className="space-y-1.5">
          {/* password check input */}
          <MuiOutlinedTextInput
            label="현재 사용중인 비밀번호"
            type="password"
            value={password}
            onChange={evt => {
              setPassword(evt.target.value);
            }}
            error={!!errorMessage}
          />

          {/* error message */}
          {errorMessage && <HelperMessage type="error" text={errorMessage} />}
        </div>

        {/* password reset link */}
        {hasError && (
          <div className="w-full py-1">
            <p className="text-grey5 typo-body8 font-bold text-right">
              혹시 비밀번호를 잊으셨나요?{' '}
              <BaseLink href="/user/password" className="text-primary underline">
                비밀번호 재설정
              </BaseLink>
            </p>
          </div>
        )}

        <div className={clsx('flex-center py-9', 'md:pt-12')}>
          <BaseButton
            onClick={() => {
              checkPassword({
                variables: {
                  password
                }
              });
            }}
            disabled={!password}
            className={clsx(
              'border rounded-[5px] h-8 px-3 typo-body7 font-medium',
              'md:h-[52px] md:px-4 md:rounded-[10px] md:typo-body4 md:font-semibold',
              password ? 'border-black text-black' : 'border-grey2 text-grey2'
            )}
          >
            비밀번호 입력
          </BaseButton>
        </div>
      </div>
    </section>
  );
};
