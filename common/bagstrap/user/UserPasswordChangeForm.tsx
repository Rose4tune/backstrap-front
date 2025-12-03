import clsx from 'clsx';
import React from 'react';

import { useFormikContext } from 'formik';

import { USER_PASSWORD_CHANGE_VSCHEMA } from '@constants/vschema/user/user-password.vschema.constant';

import NextStepIcon from '@public/icons/next-step.svg';

import BaseFormIndex from '@common/form';
import BaseFormButton from '@common/form/BaseFormButton';
import HelperMessage from '@common/bagstrap/etc/HelperMessage';

import useUserPasswordChangeModalDialog from '@hooks/bagstrap/user/useUserPasswordChangeModalDialog.hook';

import UserPasswordConfirmFormRow from './UserPasswordConfirmFormRow';

export interface UserPasswordChangeFormProps {
  currentPassword: string;
}

const UserPasswordChangeForm = (props: UserPasswordChangeFormProps): JSX.Element => {
  const { currentPassword } = props;

  const [passwordChangeConfirmModalDialogEl, openPasswordChangeConfirmModalDialog] =
    useUserPasswordChangeModalDialog(currentPassword);

  return (
    <BaseFormIndex<{ password: string; passwordConfirm: string }>
      validationSchema={USER_PASSWORD_CHANGE_VSCHEMA}
      initialValues={{
        password: '',
        passwordConfirm: ''
      }}
      onSubmit={({ password }) => {
        openPasswordChangeConfirmModalDialog(password);
      }}
    >
      {passwordChangeConfirmModalDialogEl}

      <div className="space-y-4">
        <HelperMessage
          type="info"
          text="새로 사용할 비밀번호를 입력해주세요."
          size="md"
        />

        <UserPasswordConfirmFormRow />
      </div>

      <div className={clsx('flex-center py-9', 'md:pt-12')}>
        <PasswordChangeFormButton />
      </div>
    </BaseFormIndex>
  );
};

export default UserPasswordChangeForm;

const PasswordChangeFormButton = (): JSX.Element => {
  const formik = useFormikContext();

  return (
    <BaseFormButton className={clsx('flex-col gap-2')}>
      <NextStepIcon />
      {formik.isValid && formik.dirty && (
        <span className="text-sm font-semibold underline">비밀번호 변경</span>
      )}
    </BaseFormButton>
  );
};
