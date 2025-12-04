import { FileUploadActionResponse } from '@hooks/bagstrap/file/useFileUpload.hook';

/**
 * 파일 업로드 API 함수 (Promise 기반)
 */
export const uploadFile = (file: File, accessToken?: string): Promise<FileUploadActionResponse> => {
  return new Promise((resolve, reject) => {
    // HTML5 FileReader를 사용하여 파일을 FormData로 변환
    console.log(JSON.stringify(file))
    const formData = new FormData();
    formData.append('file', file, file.name);

    // REST API 호출
    const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
    const uploadUrl = `/api/v1/files/action/upload`;

    // 인증 헤더 설정 (필요한 경우)
    const headers: HeadersInit = {
      'Accept': '*/*',
      // Content-Type은 FormData 사용시 자동 설정되므로 생략
    };

    // accessToken이 제공된 경우 Authorization 헤더 추가
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    fetch(uploadUrl, {
      method: 'POST',
      headers,
      body: formData,
    })
      .then(async response => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Upload failed: ${response.status} ${errorText}`);
        }
        return response.json();
      })
      .then((result: FileUploadActionResponse) => {
        resolve(result);
      })
      .catch(error => {
        console.error('File upload error:', error);
        reject(error);
      });
  });
};

/**
 * 이미지 압축 함수 (8MB 이상일 때 자동 압축)
 */
export const compressImageIfNeeded = (file: File): Promise<File> => {
  const COMPRESSION_THRESHOLD = 8 * 1024 * 1024; // 8MB

  if (file.size < COMPRESSION_THRESHOLD) {
    return Promise.resolve(file);
  }

  return new Promise((resolve) => {
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
        0.7 // 70% 품질
      );
    };

    reader.readAsDataURL(file);
  });
};

/**
 * 파일 업로드 with 자동 압축
 */
export const uploadFileWithCompression = async (file: File, accessToken?: string): Promise<FileUploadActionResponse> => {
  try {
    // 1. 필요한 경우 이미지 압축
    const processedFile = await compressImageIfNeeded(file);

    // 2. 파일 업로드
    const result = await uploadFile(processedFile, accessToken);

    return result;
  } catch (error) {
    console.error('File upload with compression failed:', error);
    throw error;
  }
};

export default uploadFileWithCompression;