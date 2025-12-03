import clsx from 'clsx';
import React from 'react';
import { useFormikContext } from 'formik';

import { USER_PASSWORD_RESET_VSCHEMA } from '@constants/vschema/user/user-password.vschema.constant';

import NextStepIcon from '@public/icons/next-step.svg';

import BaseFormIndex from '@common/form';
import BaseFormButton from '@common/form/BaseFormButton';
import HelperMessage from '@common/bagstrap/etc/HelperMessage';

import useUserPasswordResetModalDialog from '@hooks/bagstrap/user/useUserPasswordResetModalDialog.hook';

import UserPasswordConfirmFormRow from './UserPasswordConfirmFormRow';

export interface UserPasswordResetFormProps {
  email: string;
}

const UserPasswordResetForm = (props: UserPasswordResetFormProps): JSX.Element => {
  const { email } = props;

  const [userPasswordResetModalDialogEl, openUserPasswordResetModalDialog] =
    useUserPasswordResetModalDialog(email);

  return (
    <BaseFormIndex<{ password: string; passwordConfirm: string }>
      validationSchema={USER_PASSWORD_RESET_VSCHEMA}
      initialValues={{
        password: '',
        passwordConfirm: ''
      }}
      onSubmit={({ password }) => {
        // console.log(password);

        openUserPasswordResetModalDialog(password);
      }}
    >
      {userPasswordResetModalDialogEl}

      <div className="space-y-4">
        <HelperMessage
          type="info"
          text="새로 사용할 비밀번호를 입력해주세요."
          size="md"
        />

        <UserPasswordConfirmFormRow />
      </div>

      <div className={clsx('flex-center py-9', 'md:pt-12')}>
        <PassworResetFormButton />
      </div>
    </BaseFormIndex>
  );
};

export default UserPasswordResetForm;

const PassworResetFormButton = (): JSX.Element => {
  const formik = useFormikContext();

  return (
    <BaseFormButton className={clsx('flex-col gap-2')}>
      <NextStepIcon />
      {formik.isValid && formik.dirty && (
        <span className="text-sm font-semibold underline">비밀번호 재설정</span>
      )}
    </BaseFormButton>
  );
};
