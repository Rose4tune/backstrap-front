import React from 'react';

import {
  API_PATH_FILES_ACTION_UPLOAD,
  API_PATH_FILES_ACTION_UPLOAD_WITHSCURE
} from '@constants/bagstrap/api/file.api.constant';

import { generateHttpAuthorizationHeader } from '@utils/common/http.util';

import useAuthPayload from '@hooks/useAuthPayload.hook';
import useHttpMultipartPost from '@hooks/useHttpMultipartPost.hook';

export type FileUploadActionResponse = {
  contentType: string;
  createdDate: string;
  elapsedCreatedDate: string;
  entityStatus: null;
  name: string;
  s3Key: string;
  url: string;
  uuid: string;
};

const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

export default function useFileUpload(
  meta?: { readonly isSecured?: boolean },
  onUploaded?: (result: FileUploadActionResponse & { fileObj?: File }) => void,
  limit?: number
): [React.ReactNode, (data?: any, name?: string) => void, boolean] {
  const COMPRESSION_THRESHOLD = 8 * 1024 * 1024; // 8MB

  const ref = React.useRef<HTMLInputElement | null>(null);
  const [fileObj, setFileObj] = React.useState<File | undefined>();

  const url = `${
    meta?.isSecured
      ? API_PATH_FILES_ACTION_UPLOAD_WITHSCURE
      : API_PATH_FILES_ACTION_UPLOAD
  }`;

  const authPayload = useAuthPayload();

  const [state, request] = useHttpMultipartPost<{}, any>(url, {
    headers: {
      Authorization: generateHttpAuthorizationHeader(authPayload)
    }
  });

  React.useEffect(() => {
    const formData = new FormData();

    if (fileObj != null) {
      formData.append('file', fileObj, fileObj.name);

      if (meta) {
        formData.append('isSecured', JSON.stringify(meta.isSecured));
      }

      request(formData);
    } else {
      ref.current && (ref.current.value = '');
    }
  }, [fileObj]);

  React.useEffect(() => {
    if (state.result && !state.loading) {
      const fileSize = fileObj?.size || 1000000;

      setTimeout(() => {
        onUploaded?.call(
          null,
          Object.assign(
            {
              fileObj
            },
            state.result
          )
        );
      }, fileSize / 1000);

      setFileObj(undefined);
    }
  }, [state]);

  React.useEffect(() => {
    const handlePaste = async (event: Event) => {
      const clipboardEvent = event as ClipboardEvent;

      const items = clipboardEvent.clipboardData?.items;
      if (!items) return;

      let handled = false;

      for (const item of items) {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file && !handled) {
            handled = true;

            clipboardEvent.preventDefault();

            const isLarge = file.size >= COMPRESSION_THRESHOLD;
            const processed = isLarge ? await compressImageWithCanvas(file) : file;

            setFileObj(processed);
          }

          // if (file && !handled) {
          //   handled = true;

          //   clipboardEvent.preventDefault();

          //   const compressed = await compressImageWithCanvas(file);
          //   setFileObj(compressed);
          // }
        }
      }
    };

    window.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  // React.useEffect(() => {
  //   const handlePaste = async (event: Event) => {
  //     const clipboardEvent = event as ClipboardEvent;

  //     clipboardEvent.preventDefault();

  //     const items = clipboardEvent.clipboardData?.items;
  //     if (!items) return;

  //     let handled = false;

  //     for (const item of items) {
  //       if (item.kind === 'file' && item.type.startsWith('image/')) {
  //         const file = item.getAsFile();
  //         if (file && !handled) {
  //           handled = true;
  //           const compressed = await compressImageWithCanvas(file);
  //           setFileObj(compressed);
  //           event.preventDefault();
  //         }
  //       }
  //     }
  //   };
  //   window.addEventListener('paste', handlePaste);

  //   return () => {
  //     window.removeEventListener('paste', handlePaste);
  //   };
  // }, []);

  const compressImageWithCanvas = (file: File): Promise<File> => {
    return new Promise(resolve => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = e => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1024;

        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          blob => {
            const compressedFile = new File([blob!], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          },
          file.type,
          0.7
        );
      };

      reader.readAsDataURL(file);
    });
  };

  return [
    <input
      type="file"
      accept="image/*"
      style={{ display: 'none' }}
      ref={ref}
      onChange={async event => {
        const file = event.target.files?.[0];
        if (file) {
          if (limit && file.size > limit) {
            alert(`${limit / (1000 * 1000)}Mb 이하의 파일을 선택해주세요.`);
            return;
          }

          const isLarge = file.size >= COMPRESSION_THRESHOLD;
          const processed = isLarge ? await compressImageWithCanvas(file) : file;

          setFileObj(processed);
        }

        // if (file) {
        //   if (limit && file.size > limit) {
        //     alert(`${limit / (1000 * 1000)}Mb 이하의 파일을 선택해주세요.`);
        //     return;
        //   }
        //   const compressed = await compressImageWithCanvas(file);

        //   setFileObj(compressed);
        // }
      }}
    />,
    (data: string | File, name = '') => {
      if (data) {
        if (typeof data === 'string') {
          const mimeType = data.split(',')[0].match(/:(.*?);/)?.[1];

          fetch(data).then(res => {
            res.blob().then(async blob => {
              const file = new File([blob], name, { type: blob.type });

              const isLarge = file.size >= COMPRESSION_THRESHOLD;
              const processed = isLarge ? await compressImageWithCanvas(file) : file;

              setFileObj(processed);

              // const file = new File([blob], name, { type: blob.type });

              // const compressed = await compressImageWithCanvas(file);
              // setFileObj(compressed);
            });
          });
        } else if (data instanceof File) {
          setFileObj(data);
        }
      } else {
        ref.current?.click();
      }
    },
    state.loading ?? false
  ];
}
