import React, { useState, useRef } from 'react';
import { uploadFileWithCompression } from 'src/apis/community/uploadFile';

interface UseImageUploadOptions {
  onImageChange?: (imageUrl: string) => void;
  accessToken: string;
  maxSizeMB?: number;
}

export const useImageUpload = ({
  onImageChange,
  accessToken,
  maxSizeMB = 10
}: UseImageUploadOptions) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 크기 제한
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`${maxSizeMB}MB 이하의 파일만 업로드할 수 있습니다.`);
      return;
    }

    // 이미지 파일만 허용
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    try {
      setIsUploading(true);
      
      // uploadFileWithCompression 사용하여 파일 업로드
      const result = await uploadFileWithCompression(file, accessToken);
      
      // 업로드 성공 시 콜백 호출
      if (result.url && onImageChange) {
        onImageChange(result.url);
      }
      
      console.log('Image uploaded successfully:', result);
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
      // 파일 입력값 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerImageUpload = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const ImageUploadInput = () => (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      className="hidden"
    />
  );

  return {
    isUploading,
    triggerImageUpload,
    ImageUploadInput
  };
};