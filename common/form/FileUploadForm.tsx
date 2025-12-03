import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import useFileUpload, {
  FileUploadActionResponse
} from '@hooks/bagstrap/file/useFileUpload.hook';

interface UploadedFileInfo {
  description: string;
  displayOrder: number;
  fileType: 'MENTOR_CERTIFICATE' | 'SCHOOL_CERTIFICATE';
  fileUuid: string;
}

interface FileUploadFormProps {
  onChangeFile: (file: UploadedFileInfo) => void;
}

export default function FileUploadForm({ onChangeFile }: FileUploadFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  //Todo: 이미지 업로드 주석 추가
  const [fileUploadEl, uploadFile, isLoading] = useFileUpload(
    { isSecured: false },
    (result: FileUploadActionResponse & { fileObj?: File }) => {
      if (result.fileObj) {
        const uploadedFile: UploadedFileInfo = {
          description: result.name,
          displayOrder: 0,
          fileType: 'SCHOOL_CERTIFICATE',
          fileUuid: result.uuid
        };
        onChangeFile(uploadedFile);

        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(result.fileObj);
      }
    }
  );

  //Drag and Drop 시 실행 함수
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      uploadFile(file);
    }
  };

  return (
    <div className="w-full space-y-[8px]">
      <p className="text-med-14 text-gray-90">증빙 자료</p>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={clsx(
          'relative w-full px-[51px] border-[2px] border-dashed rounded-[12px] flex flex-col items-center gap-[20px] cursor-pointer',
          {
            'py-[40px]': !previewUrl,
            'border-blue-500 bg-blue-50': dragOver,
            'border-gray-50 bg-white': !dragOver
          }
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) {
              uploadFile(file);
            }
          }}
          className="hidden"
        />

        {isLoading ? (
          <div className="h-[224px] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="업로드된 이미지"
              className="object-cover h-[224px]"
            />
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-black/20 flex items-center justify-center rounded-[12px]">
              <div className="text-gray-90 bg-gray-30 px-[12px] py-[8px] text-bold-14 rounded-[12px]">
                다른 사진 업로드
              </div>
            </div>
          </>
        ) : (
          <>
            <Image
              src="/images/[renewal]ImageSearch.png"
              alt="file upload"
              width={100}
              height={100}
            />
            <div className="flex flex-col gap-[4px] text-center">
              <p className="text-med-16 text-gray-60">재학 증빙 이미지를 선택해주세요</p>
              <p className="text-reg-14 text-gray-50">
                학생증, 연구실 멤버 확인 캡쳐본, 합격증 등<br />
                대학교, 이름, 학과 정보가 포함된 자료를 첨부해주세요.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
