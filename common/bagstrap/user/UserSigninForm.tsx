import clsx from 'clsx';
import React from 'react';

import BaseFormIndex from '@common/form';
import BaseFormButton from '@common/form/BaseFormButton';
import BaseFormTextField from '@common/form/BaseFormTextField';
import LoadingSurface from '@common/surface/LoadingSurface';
import HelperMessage from '@common/bagstrap/etc/HelperMessage';

import useHttpPostOAuthToken from '@hooks/bagstrap/user/useHttpPostOAuthToken.hook';
import { InputType } from 'types/inputTypes';

export interface UserSigninFormProps {
  onSignin?: (result: AuthPayload) => void;
  queryId: string;
}

const resolveErrorMessage = (errorCode: string): string | undefined => {
  if (errorCode === 'unauthorized') {
    return '존재하지 않는 아이디입니다.';
  }

  if (errorCode === 'invalid_grant') {
    return '잘못된 비밀번호입니다. 다시 시도하거나 비밀번호를 재설정하세요.';
  }
};

const UserSigninForm = (props: UserSigninFormProps): JSX.Element => {
  const { onSignin } = props;

  const [errorCode, setErrorCode] = React.useState<string | undefined>();

  const [state, signinWithEmail] = useHttpPostOAuthToken();

  React.useEffect(() => {
    if (state?.result) {
      onSignin?.call(null, state.result);
    }

    if (state?.error) {
      setErrorCode(state.error);
    }
  }, [state]);

  const errorMessage = errorCode && resolveErrorMessage(errorCode);

  return (
    <div>
      <LoadingSurface open={state.loading ?? false} global />

      <BaseFormIndex<{ username: string; password: string }>
        onSubmit={({ username, password }) => {
          setErrorCode(undefined);

          signinWithEmail(username, password);
        }}
        initialValues={{ username: '', password: '' }}
      >
        <div
          className={clsx(
            'py-[18px]',
            'text-grey5 typo-body7 font-medium text-center',
            'xl:text-left xl:typo-body4 xl:font-bold xl:py-6'
          )}
        >
          가방끈 계정으로 로그인
        </div>
        <div className={clsx('space-y-4', 'xl:space-y-5')}>
          <div className="space-y-1.5">
            <BaseFormTextField
              inputType={InputType.FullBorder}
              size="medium"
              name="username"
              label="아이디"
              color="#00CBBC"
              borderColor="#D5E8E7"
              labelColor="#D5E8E7"
              error={errorCode === 'unauthorized'}
              onChange={() => {
                if (errorCode === 'unauthorized') {
                  setErrorCode(undefined);
                }
              }}
            />
            {errorCode === 'unauthorized' && errorMessage && (
              <HelperMessage type="error" text={errorMessage} />
            )}
          </div>

          <div className="space-y-1.5">
            <BaseFormTextField
              inputType={InputType.FullBorder}
              size="medium"
              name="password"
              label="비밀번호"
              type="password"
              color="#00CBBC"
              borderColor="#D5E8E7"
              labelColor="#D5E8E7"
              error={errorCode === 'invalid_grant'}
              onChange={evt => {
                if (errorCode === 'invalid_grant') {
                  setErrorCode(undefined);
                }
              }}
            />
            {errorCode === 'invalid_grant' && errorMessage && (
              <HelperMessage type="error" text={errorMessage} />
            )}
          </div>

          <BaseFormButton
            fullWidth
            className="h-[50px] rounded-[10px] bg-gradient-to-r from-[#00CBBC] to-[#D5E8E7] box-shadow"
          >
            <span className="font-bold text-white underline text-base">로그인</span>
          </BaseFormButton>
        </div>
      </BaseFormIndex>
    </div>
  );
};

export default UserSigninForm;
