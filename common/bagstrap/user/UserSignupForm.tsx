import clsx from 'clsx';
import React from 'react';

import {
  USER_SIGNUP_EMAIL_VSCHEMA,
  USER_SIGNUP_SOCIAL_VSCHEMA
} from '@constants/vschema/user/user-signup.vschema.constant';
import { STUDENT_TYPE_LABEL } from '@constants/bagstrap/label/user.label.constant';

import {
  StudentType,
  useCreateUserMutation,
  useEditUserMutation,
  UserRegisterDtoInput
} from '@generated/graphql';

import NextStepIcon from '@public/icons/next-step.svg';

import BaseFormIndex from '@common/form';
import BaseFormButton from '@common/form/BaseFormButton';
import BaseFormSelectField from '@common/form/BaseFormSelectField';
import HelperMessage from '@common/bagstrap/etc/HelperMessage';

import UserNameFormRow from './UserNameFormRow';
import UserPasswordConfirmFormRow from './UserPasswordConfirmFormRow';
import UserEmailVerificationFormRow from './UserEmailVerificationFormRow';

import {
  FormContainer,
  StudentTypeContainer,
  NextStepContainer
} from './UserSignupForm.style';

export interface UserSignupFormProps {
  onSubmit?: (values: UserSignupFormValues) => void;

  isSocial?: boolean;
}

type UserSignupFormValues = Pick<
  UserRegisterDtoInput,
  'email' | 'name' | 'realName' | 'password' | 'studentType'
> & {
  passwordConfirm?: string;
  isEmailVerified?: boolean;
};

const UserSignupForm = (props: UserSignupFormProps): JSX.Element => {
  const { onSubmit, isSocial } = props;

  const [createUser] = useCreateUserMutation();

  const [editUser] = useEditUserMutation();

  return (
    <BaseFormIndex<UserSignupFormValues>
      initialValues={{
        email: '',
        name: '',
        realName: '',
        password: '',
        passwordConfirm: '',
        studentType: undefined
      }}
      validationSchema={isSocial ? USER_SIGNUP_SOCIAL_VSCHEMA : USER_SIGNUP_EMAIL_VSCHEMA}
      onSubmit={({ email, name, password, realName, studentType }) => {
        if (isSocial) {
          const input = {
            name,
            realName,
            studentType
          };

          editUser({
            variables: {
              input: {
                name,
                realName,
                studentType
              }
            },
            onCompleted: () => {
              onSubmit?.call(null, input);
            }
          });
        } else {
          const input = {
            email,
            name,
            password,
            realName,
            studentType
          };

          createUser({
            variables: {
              input: {
                email,
                name,
                password,
                realName,
                studentType
              }
            },
            onCompleted: () => {
              onSubmit?.call(null, input);
            }
          });
        }
      }}
    >
      <HelperMessage size="md" type="info" text="아래 빈칸을 모두 채워주세요." />
      <FormContainer>
        <UserNameFormRow />

        {!isSocial && (
          <>
            <UserEmailVerificationFormRow type="signup" />

            <UserPasswordConfirmFormRow />
          </>
        )}

        <StudentTypeContainer>
          <HelperMessage size="md" type="info" text="소속을 선택하세요." />

          <BaseFormSelectField
            name="studentType"
            type="chip"
            options={[
              {
                label: STUDENT_TYPE_LABEL[StudentType.Undergraduate],
                value: StudentType.Undergraduate
              },
              {
                label: STUDENT_TYPE_LABEL[StudentType.Postgrad],
                value: StudentType.Postgrad
              }
            ]}
          />
        </StudentTypeContainer>
      </FormContainer>

      <NextStepContainer>
        <BaseFormButton>
          <NextStepIcon />
        </BaseFormButton>
      </NextStepContainer>
    </BaseFormIndex>
  );
};

export default UserSignupForm;
