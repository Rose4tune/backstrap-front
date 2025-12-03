import clsx from 'clsx';
import React from 'react';
import { useField } from 'formik';

import { useExistsNickNameLazyQuery } from '@generated/graphql';

import BaseFormTextField from '@common/form/BaseFormTextField';
import HelperMessage from '@common/bagstrap/etc/HelperMessage';
import { InputType } from 'types/inputTypes';

import { NameFormContainer } from './UserNameFormRow.style';

export interface UserNameFormRowProps extends BaseProps {}

const UserNameFormRow = (props: UserNameFormRowProps): JSX.Element => {
  const { className } = props;

  return (
    <NameFormContainer>
      <RealNameFormField />
      <NameFormField />
    </NameFormContainer>
  );
};

export default UserNameFormRow;

const RealNameFormField = (): JSX.Element => {
  const [field, meta] = useField<string>('realName');

  return (
    <div>
      <BaseFormTextField
        inputType={InputType.FullBorder}
        name="realName"
        placeholder="이름(실명)"
        error={(meta.touched || !!field.value) && !!meta.error}
      />
      {meta.value && meta.error && <HelperMessage type="error" text={meta.error} />}
    </div>
  );
};

const NameFormField = (): JSX.Element => {
  const [field, meta] = useField<string>('name');
  const [
    { value: isNameDuplicate },
    { error: isNameDuplicateError },
    { setValue: setIsNameDuplicate }
  ] = useField<boolean | undefined>('isNameDuplicate');

  const [existsNickname] = useExistsNickNameLazyQuery();

  React.useEffect(() => {
    if (field.value) {
      existsNickname({
        variables: {
          nickname: field.value
        }
      }).then(({ data }) => {
        if (data) {
          setIsNameDuplicate(data.existsNickName);
        }
      });
    }
  }, [field.value]);

  return (
    <div>
      <BaseFormTextField
        inputType={InputType.FullBorder}
        name="name"
        placeholder="닉네임"
        error={(meta.touched || !!field.value) && !!meta.error}
      />
      {field.value &&
        (meta.error ||
          (isNameDuplicateError && (
            <HelperMessage type="error" text={meta.error || isNameDuplicateError} />
          )))}
    </div>
  );
};
