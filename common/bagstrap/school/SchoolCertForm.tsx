import clsx from 'clsx';
import React from 'react';
import { useFormikContext } from 'formik';

import { SCHOOL_CERT_VSCHEMA } from '@constants/vschema/school/school-cert.vschema.constant';
import { FileType, UserEditDtoInput } from '@generated/graphql';
import NextStepIcon from '@public/icons/next-step.svg';
import BaseFormIndex from '@common/form';
import BaseFormButton from '@common/form/BaseFormButton';
import BaseFormTextField from '@common/form/BaseFormTextField';
import useSchoolCertConfirmModalDialog from '@hooks/bagstrap/school/useSchoolCertConfirmModalDialog.hook';
import { InputType } from 'types/inputTypes';
import SchoolCertFileFormRow, { UploadedFile } from './SchoolCertFileFormRow';

export interface SchoolCertFormProps {
  onSubmit?: (values: UserEditDtoInput) => void;
}

type SchoolCertFormValues = Pick<UserEditDtoInput, 'schoolName' | 'major'> & {
  files?: UploadedFile[];
};

const SchoolCertForm = (props: SchoolCertFormProps): JSX.Element => {
  const { onSubmit } = props;

  const [schoolCertConfirmModalDialogEl, openSchoolCertConfirmModalDialog] =
    useSchoolCertConfirmModalDialog(onSubmit);

  return (
    <div>
      <BaseFormIndex<SchoolCertFormValues>
        initialValues={{
          schoolName: '',
          major: '',
          files: []
        }}
        validationSchema={SCHOOL_CERT_VSCHEMA}
        onSubmit={({ major, schoolName, files }) => {
          openSchoolCertConfirmModalDialog({
            major,
            schoolName,
            files: files?.map(({ uuid }, index) => ({
              fileUuid: uuid,
              displayOrder: index,
              fileType: FileType.SchoolCertificate
            }))
          });
        }}
      >
        <div className={clsx('pb-12 space-y-8')}>
          <div className="space-y-5">
            <BaseFormTextField
              inputType={InputType.Underline}
              name="schoolName"
              label="소속 학교명"
            />
            <BaseFormTextField
              inputType={InputType.Underline}
              name="major"
              label="소속 학과명"
            />
          </div>
          <SchoolCertFileFormRow />
        </div>
        <SchoolCertFormButtonRow />
      </BaseFormIndex>

      {schoolCertConfirmModalDialogEl}
    </div>
  );
};

export default SchoolCertForm;

const SchoolCertFormButtonRow = (): JSX.Element => {
  const formik = useFormikContext();

  return (
    <div className="flex-center">
      <BaseFormButton className="flex-center flex-col gap-2">
        <NextStepIcon />
        {formik.isValid && formik.dirty && (
          <span className="text-sm font-semibold underline">제출하기</span>
        )}
      </BaseFormButton>
    </div>
  );
};
