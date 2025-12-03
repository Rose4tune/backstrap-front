import clsx from 'clsx';
import React, { useCallback } from 'react';
import { useFormikContext } from 'formik';

import {
  DegreeCourseType,
  FileType,
  TotiMentorRegisterDtoInput,
  FaEntityFileRegisterDtoInput
} from '@generated/graphql';

import NextStepIcon from '@public/icons/next-step.svg';

import BaseFormIndex from '@common/form';
import BaseFormButton from '@common/form/BaseFormButton';
import BaseFormTextField from '@common/form/BaseFormTextField';

import SchoolCertFileFormRow, { UploadedFile } from './SchoolCertFileFormRow';
import HelperMessage from '../etc/HelperMessage';
import BaseFormSelectField from '@common/form/BaseFormSelectField';
import { SCHOOL_TYPE_LABEL } from '@constants/bagstrap/label/school.label.constant';
import { InputType } from 'types/inputTypes';
import { DEGREE_COURSE_TYPE_LABEL } from '@constants/bagstrap/degreeCourse.constant';
import usePostgradCertConfirmModalDialog from '@hooks/bagstrap/school/usePostgradCertConfirmModalDialog.hook';
import { POSTGRADUATE_CERT_VSCHEMA } from '@constants/vschema/school/postgraduate-cert.vschema.constant';

export interface PostgradCertFormProps {
  onSubmit?: () => void;
}

export type PostgradCertFormValues = Pick<
  TotiMentorRegisterDtoInput,
  | 'degreeCollege'
  | 'degreeMajor'
  | 'labName'
  | 'researchTitle'
  | 'isHomeCollege'
  | 'degreeCourseType'
  | 'bachelorCollege'
  | 'bachelorMajor'
> & { files?: UploadedFile[] };

function PostgradCertForm(props: PostgradCertFormProps) {
  const { onSubmit } = props;

  const [postgradCertConfirmModalDialogEl, openPostgradCertConfirmModalDialog] =
    usePostgradCertConfirmModalDialog(onSubmit);

  const initialFormValues = {
    degreeCollege: '',
    degreeMajor: '',
    labName: '',
    researchTitle: '',
    isHomeCollege: true,
    degreeCourseType: DegreeCourseType.Joint,
    bachelorCollege: '',
    bachelorMajor: ''
  };

  const onSubmitForm = useCallback(
    (values: PostgradCertFormValues) => {
      const {
        degreeCollege,
        degreeMajor,
        labName,
        researchTitle,
        isHomeCollege,
        degreeCourseType,
        files,
        bachelorCollege,
        bachelorMajor
      } = values;

      openPostgradCertConfirmModalDialog({
        degreeCollege: degreeCollege ?? '',
        degreeMajor: degreeMajor ?? '',
        labName,
        researchTitle,
        isHomeCollege,
        degreeCourseType: degreeCourseType ?? DegreeCourseType.Joint,
        bachelorCollege: bachelorCollege ?? '',
        bachelorMajor: bachelorMajor ?? '',
        files: files?.map<FaEntityFileRegisterDtoInput>(({ uuid }, index) => ({
          fileUuid: uuid,
          displayOrder: index,
          fileType: FileType.SchoolCertificate
        }))
      });
    },
    [openPostgradCertConfirmModalDialog]
  );

  return (
    <div>
      <BaseFormIndex<PostgradCertFormValues>
        initialValues={initialFormValues}
        validationSchema={POSTGRADUATE_CERT_VSCHEMA}
        onSubmit={onSubmitForm}
      >
        <div className={clsx('pb-12 space-y-8')}>
          <div className="space-y-5">
            <BaseFormTextField
              inputType={InputType.Underline}
              name="degreeCollege"
              label="학교명 (필수)*"
              placeholder="예) 방끈대학교"
            />

            <BaseFormTextField
              inputType={InputType.Underline}
              name="degreeMajor"
              label="전공 및 학위*"
              placeholder="예) 신소재공학과"
            />

            <BaseFormTextField
              inputType={InputType.Underline}
              name="labName"
              label="연구실*"
              placeholder="예) 방끈 연구실"
            />

            <BaseFormTextField
              inputType={InputType.Underline}
              name="researchTitle"
              label="연구 주제*"
              placeholder="예) 페로브스카이트 태양전지 연구"
            />

            <div className={clsx('space-y-4', 'md:space-y-3')}>
              <HelperMessage size="md" type="info" text="소속을 선택하세요." />
              <BaseFormSelectField
                name="isHomeCollege"
                type="chip"
                options={[
                  {
                    label: SCHOOL_TYPE_LABEL.HOME,
                    value: true
                  },
                  {
                    label: SCHOOL_TYPE_LABEL.AWAY,
                    value: false
                  }
                ]}
              />
            </div>

            <div className={clsx('space-y-4', 'md:space-y-3')}>
              <HelperMessage size="md" type="info" text="과정을 선택하세요." />
              <BaseFormSelectField
                inputClassName="grid-cols-3"
                name="degreeCourseType"
                type="chip"
                options={[
                  {
                    label: DEGREE_COURSE_TYPE_LABEL[DegreeCourseType.Joint],
                    value: DegreeCourseType.Joint
                  },
                  {
                    label: DEGREE_COURSE_TYPE_LABEL[DegreeCourseType.Philosophy],
                    value: DegreeCourseType.Philosophy
                  },
                  {
                    label: DEGREE_COURSE_TYPE_LABEL[DegreeCourseType.Master],
                    value: DegreeCourseType.Master
                  }
                ]}
              />
            </div>
          </div>

          <SchoolCertFileFormRow />

          <div className="space-y-5">
            <BaseFormTextField
              inputType={InputType.Underline}
              name="bachelorCollege"
              label="학부 정보"
              placeholder="예) 방끈대학교"
            />

            <BaseFormTextField
              inputType={InputType.Underline}
              name="bachelorMajor"
              label="전공 및 학위"
              placeholder="예) 신소재공학과"
            />
          </div>
        </div>
        <SchoolCertFormButtonRow />
      </BaseFormIndex>

      {postgradCertConfirmModalDialogEl}
    </div>
  );
}

export default PostgradCertForm;

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
