import clsx from 'clsx';
import { useField } from 'formik';

import BaseFormTextField from '@common/form/BaseFormTextField';
import HelperMessage from '@common/bagstrap/etc/HelperMessage';
import { InputType } from 'types/inputTypes';

import { PasswordFormContainer, PasswordField } from './UserPasswordConfirmFormRow.style';

export interface UserPasswordConfirmFormRowProps extends BaseProps {}

const UserPasswordConfirmFormRow = (
  props: UserPasswordConfirmFormRowProps
): JSX.Element => {
  const { className } = props;

  return (
    <PasswordFormContainer>
      <PasswordFormField />
      <PasswordConfirmFormField />
    </PasswordFormContainer>
  );
};

export default UserPasswordConfirmFormRow;

const PasswordFormField = (): JSX.Element => {
  const [field, meta] = useField<string>('password');

  return (
    <PasswordField>
      <BaseFormTextField
        inputType={InputType.FullBorder}
        name="password"
        placeholder="비밀번호"
        type="password"
        error={(meta.touched || !!field.value) && !!meta.error}
      />
      {(meta.touched || field.value) && (
        <HelperMessage
          type={meta.error ? 'error' : 'pass'}
          text={meta.error || '올바른 입력입니다.'}
        />
      )}
    </PasswordField>
  );
};

const PasswordConfirmFormField = (): JSX.Element => {
  const [field, meta] = useField<string>('passwordConfirm');

  return (
    <PasswordField>
      <BaseFormTextField
        inputType={InputType.FullBorder}
        name="passwordConfirm"
        placeholder="비밀번호 재확인"
        type="password"
        error={(meta.touched || !!field.value) && !!meta.error}
      />
      {(meta.touched || field.value) && (
        <HelperMessage
          type={meta.error ? 'error' : 'pass'}
          text={meta.error || '올바른 입력입니다.'}
        />
      )}
    </PasswordField>
  );
};
