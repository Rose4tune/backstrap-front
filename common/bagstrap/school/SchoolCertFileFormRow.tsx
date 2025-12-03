import clsx from 'clsx';
import React from 'react';
import { useField } from 'formik';

import PlusIcon from '@public/icons/plus.svg';

import BaseButton from '@common/button/BaseButton';
import HelperMessage from '@common/bagstrap/etc/HelperMessage';

import useModalDialog from '@hooks/useModalDialog.hook';
import useFileRead from '@hooks/useFileRead.hook';
import useFileUpload from '@hooks/bagstrap/file/useFileUpload.hook';

export interface SchoolCertFileFormRowProps {}

export type UploadedFile = {
  uuid: string;
  name: string;
  url: string;
  fileObj?: File;
};

const SchoolCertFileFormRow = (): JSX.Element => {
  const [, meta] = useField<UploadedFile[]>('files');

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <HelperMessage
          type={meta.touched && meta.error ? 'error' : 'info'}
          text="학위 정보 확인을 위한 증빙 자료를 제출해주세요."
          responsive
        />

        <p className={clsx('font-light text-[13px]', 'md:text-sm')}>
          (ex. 학생증, 연구실 멤버확인캡쳐본, 합격증)
        </p>
      </div>
      <FileUploadFormField />
    </div>
  );
};

export default SchoolCertFileFormRow;

const FileUploadFormField = (): JSX.Element => {
  const [field, , helper] = useField<UploadedFile[]>('files');

  const { value: files = [] } = field;

  const [fileUuidToDel, setFileUuidToDel] = React.useState<string | undefined>();

  const [dialogEl, openModalDialog, closeModalDialog] = useModalDialog({
    header: '첨부파일 삭제',
    body: (
      <div className="py-2">
        <p className="text-grey5 typo-body5">정말로 삭제하시겠습니까?</p>
      </div>
    ),
    actions: [
      <BaseButton
        className="flex-1 border border-[#566789] border-opacity-[26%] rounded-lg h-[42px]"
        onClick={() => {
          closeModalDialog();

          setFileUuidToDel(undefined);
        }}
      >
        <span className="font-medium text-[#151920] typo-body6 opacity-50">취소</span>
      </BaseButton>,
      <BaseButton
        onClick={() => {
          const newArr = [...files];

          const idx = newArr.findIndex(({ uuid }) => uuid === fileUuidToDel);

          if (idx >= 0) {
            newArr.splice(idx, 1);
          }

          helper.setValue(newArr);

          setFileUuidToDel(undefined);

          closeModalDialog();
        }}
        className="flex-1 bg-black rounded-lg h-[42px] font-medium text-white typo-body6"
      >
        삭제
      </BaseButton>
    ]
  });

  const [fileUploadEl, uploadFile, isLoading] = useFileUpload(
    {
      isSecured: true
    },
    ({ uuid, name, url, fileObj }) => {
      helper.setValue([
        ...files,
        {
          uuid,
          name,
          url,
          fileObj
        }
      ]);
    }
  );

  React.useEffect(() => {
    if (fileUuidToDel) {
      openModalDialog();
    }
  }, [fileUuidToDel]);

  return (
    <div>
      {fileUploadEl}
      {dialogEl}
      <BaseButton
        fullWidth
        onClick={() => {
          uploadFile();
        }}
        className="flex-center flex-col gap-1 border border-dashed border-grey5 rounded-3xl h-[60px]"
      >
        <div className="flex-center gap-2 text-grey5">
          <PlusIcon />
          <p className="underline font-bold text-grey5 text-sm leading-none">
            파일 첨부하기
          </p>
        </div>
        <p className="font-bold text-point-blue typo-body8 leading-none">
          jpeg, gif, png, apng, svg, bmp, heic 등 이미지 파일
        </p>
      </BaseButton>
      <ul className={clsx('grid grid-cols-3 gap-4 mt-3', 'md:mt-4')}>
        {files.map(file => (
          <UploadedFileListItem
            key={file.uuid}
            {...file}
            onDelete={() => {
              setFileUuidToDel(file.uuid);
            }}
          />
        ))}
      </ul>
    </div>
  );
};

const UploadedFileListItem = ({
  name,
  fileObj,
  onDelete
}: UploadedFile & {
  onDelete?: () => void;
}): JSX.Element => {
  const [, blob] = useFileRead(fileObj!);

  return (
    <li className="space-y-2">
      <div className="relative rounded-3xl w-full pt-[100%] overflow-hidden">
        {blob && (
          <img
            src={blob.toString()}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <BaseButton
          onClick={() => {
            onDelete?.call(null);
          }}
          className={clsx(
            'flex-center absolute bottom-0 left-0 right-0 h-1/4 bg-black bg-opacity-70 rounded-b-3xl',
            'text-white typo-body9',
            'md:typo-body7'
          )}
        >
          삭제
        </BaseButton>
      </div>

      <div className="text-grey5 typo-body9 font-bold leading-none break-all">
        {name.slice(0, 50)} {name.length > 50 && '...'}
      </div>
    </li>
  );
};
