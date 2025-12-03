import clsx from 'clsx';
import React from 'react';
import { useField } from 'formik';

import { USER_EMAIL_VERIFICATION_VSCHEMA } from '@constants/vschema/user/user-email-verification.vschema.constant';

import NextStepIcon from '@public/icons/next-step.svg';

import BaseFormIndex from '@common/form';
import BaseFormButton from '@common/form/BaseFormButton';
import BaseFormTextField from '@common/form/BaseFormTextField';
import HelperMessage from '@common/bagstrap/etc/HelperMessage';

import UserEmailVerificationFormRow from './UserEmailVerificationFormRow';
import { InputType } from 'types/inputTypes';

export interface UserPasswordResetEmailVerificationFormProps {
  onEmailVerificationCompleted?: (email: string) => void;
}

const UserPasswordResetEmailVerificationForm = (
  props: UserPasswordResetEmailVerificationFormProps
): JSX.Element => {
  const { onEmailVerificationCompleted } = props;

  return (
    <BaseFormIndex<{ name: string; email: string; isEmailVerified?: boolean }>
      validationSchema={USER_EMAIL_VERIFICATION_VSCHEMA}
      initialValues={{
        name: '',
        email: '',
        isEmailVerified: undefined
      }}
      onSubmit={({ email }) => {
        onEmailVerificationCompleted?.call(null, email);
      }}
    >
      <div className="space-y-4">
        <NameFormField />
        <UserEmailVerificationFormRow type="password" />
      </div>

      <div className={clsx('flex-center py-9', 'md:pt-12')}>
        <BaseFormButton>
          <NextStepIcon />
        </BaseFormButton>
      </div>
    </BaseFormIndex>
  );
};

export default UserPasswordResetEmailVerificationForm;

const NameFormField = (): JSX.Element => {
  const [, meta] = useField<string>('name');
  const [{ value: isEmailVerified }] = useField<boolean>('isEmailVerified');

  return (
    <div className="space-y-1.5">
      <BaseFormTextField
        inputType={InputType.FullBorder}
        name="name"
        label="이름"
        disabled={isEmailVerified}
      />
      {meta.touched && meta.error && <HelperMessage type="error" text={meta.error} />}
    </div>
  );
};
