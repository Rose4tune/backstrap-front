import React, { useState, useRef, useCallback, useEffect } from 'react';
import ImageIcon from '@assets/icons/community/image.svg';
import CloseIcon from '@assets/icons/community/close.svg';
import { uploadFileWithCompression } from '../../../apis/community/uploadFile';

interface ImageData {
  id: string; // 로컬 임시 ID
  fileUuid?: string; // 서버 업로드 후 받은 UUID
  file: File;
  url: string; // 로컬 미리보기 URL 또는 서버 URL
  serverUrl?: string; // 서버에서 받은 실제 URL
  name: string;
  size: number;
  alt?: string;
  uploadStatus: 'idle' | 'uploading' | 'uploaded' | 'error';
  uploadError?: string;
}

interface ImageUploadComponentProps {
  isVisible: boolean;
  onClose?: () => void;
  onChange?: (images: ImageData[]) => void;
  initialImages?: ImageData[];
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  acceptedTypes?: string[];
  accessToken?: string; // 파일 업로드 인증용
}

export default function ImageUploadComponent({
  isVisible,
  onClose,
  onChange,
  initialImages = [],
  maxFiles = 10,
  maxFileSize = 10 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  accessToken,
}: ImageUploadComponentProps) {
  const [images, setImages] = useState<ImageData[]>(initialImages);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // initialImages가 변경될 때마다 images 상태 업데이트
  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const updateImages = useCallback((newImages: ImageData[]) => {
    console.log('📸 ImageUploadComponent updateImages called:', newImages.length, newImages);
    setImages(newImages);
    onChange?.(newImages);
  }, [onChange]);

  const handleFileSelect = useCallback(async (files: FileList) => {
    const validFiles = Array.from(files).filter(file => {
      if (!acceptedTypes.includes(file.type)) {
        alert(`지원하지 않는 파일 형식입니다: ${file.type}`);
        return false;
      }
      if (file.size > maxFileSize) {
        alert(`파일 크기가 너무 큽니다: ${file.name} (최대 ${maxFileSize / 1024 / 1024}MB)`);
        return false;
      }
      return true;
    });

    if (images.length + validFiles.length > maxFiles) {
      alert(`최대 ${maxFiles}개의 이미지만 업로드할 수 있습니다.`);
      return;
    }

    // 먼저 로컬 이미지들을 추가 (업로드 상태로)
    const newImages: ImageData[] = validFiles.map(file => ({
      id: Date.now().toString() + Math.random().toString(36),
      file,
      url: URL.createObjectURL(file), // 로컬 미리보기 URL
      name: file.name,
      size: file.size,
      uploadStatus: 'uploading' as const,
    }));

    updateImages([...images, ...newImages]);

    // 각 파일을 실제 서버에 업로드
    for (const newImage of newImages) {
      try {
        const uploadResult = await uploadFileWithCompression(newImage.file, accessToken);

        // 업로드 성공 시 상태 업데이트
        setImages(prev => {
          const updatedImages = prev.map(img =>
            img.id === newImage.id
              ? {
                  ...img,
                  fileUuid: uploadResult.uuid,
                  serverUrl: uploadResult.url,
                  uploadStatus: 'uploaded' as const,
                  alt: uploadResult.name,
                }
              : img
          );
          onChange?.(updatedImages); // 상태 업데이트와 동시에 onChange 호출
          return updatedImages;
        });
      } catch (error) {
        console.error('Image upload failed:', error);

        // 업로드 실패 시 상태 업데이트
        setImages(prev => {
          const errorImages = prev.map(img =>
            img.id === newImage.id
              ? {
                  ...img,
                  uploadStatus: 'error' as const,
                  uploadError: error instanceof Error ? error.message : '업로드에 실패했습니다.',
                }
              : img
          );
          onChange?.(errorImages); // 상태 업데이트와 동시에 onChange 호출
          return errorImages;
        });

        // 사용자에게 에러 알림 (선택적)
        if (error instanceof Error && error.message.includes('토큰')) {
          alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        } else {
          alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
        }
      }
    }
  }, [images, maxFiles, maxFileSize, acceptedTypes, updateImages]);

  const handleRemoveImage = useCallback((id: string) => {
    const imageToRemove = images.find(img => img.id === id);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    const filteredImages = images.filter(img => img.id !== id);
    updateImages(filteredImages);
  }, [images, updateImages]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
  }, [handleFileSelect]);

  const handleAddClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (!isVisible) return null;

  return (
    <div className="mt-4">
      {/* 이미지 업로드가 필요한 경우에만 업로드 영역 표시 */}
      {images.length === 0 && (
        <div className="relative">
          {/* 닫기 버튼 */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-6 h-6 absolute -top-[12px] -right-[12px] flex items-center justify-center hover:bg-gray-30 rounded-full transition-colors"
              aria-label="이미지 업로드 닫기"
            >
              <CloseIcon className='w-6 h-6 text-gray-60'/>
            </button>
          )}

          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              dragOver
                ? 'border-normal bg-normal bg-opacity-5'
                : 'border-gray-40 hover:border-gray-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleAddClick}
          >
            <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-50" />
            </div>
            <div className="text-med-14 text-gray-70 mb-1">
              이미지 추가하기
            </div>
            <div className="text-med-12 text-gray-50">
              파일을 드래그하거나 클릭하여 선택하세요
            </div>
            <div className="text-med-12 text-gray-50 mt-2">
              JPG, PNG, GIF, WEBP (최대 {maxFileSize / 1024 / 1024}MB)
            </div>
          </div>
        </div>
      )}

      {/* 업로드된 이미지들을 피그마 디자인에 맞게 가로로 나열 */}
      {images.length > 0 && (
        <div className="flex items-center gap-3">
          {images.map((image) => (
            <div key={image.id} className="relative flex-shrink-0">
              <div className="w-[82px] h-[82px] rounded-lg overflow-hidden bg-gray-30 border border-gray-20 relative">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-[82px] h-[82px] object-cover"
                  style={{ width: '82px', height: '82px', objectFit: 'cover' }}
                />

                {/* 업로드 상태 오버레이 */}
                {image.uploadStatus === 'uploading' && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}


                {image.uploadStatus === 'error' && (
                  <div className="absolute inset-0 bg-red-500 bg-opacity-75 flex items-center justify-center">
                    <span className="text-white text-xs font-medium">실패</span>
                  </div>
                )}
              </div>

              {/* 삭제 버튼 - 피그마 디자인에 맞게 우상단에 위치 */}
              <button
                type="button"
                onClick={() => handleRemoveImage(image.id)}
                className="absolute flex"
                style={{ top: '-12px', right: '-12px' }}
                aria-label={`${image.name} 삭제`}
                disabled={image.uploadStatus === 'uploading'}
              >
                <CloseIcon className='w-6 h-6 text-gray-60'/>
              </button>

              {/* 에러 툴팁 */}
              {image.uploadStatus === 'error' && image.uploadError && (
                <div className="absolute top-full left-0 mt-1 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                  {image.uploadError}
                </div>
              )}
            </div>
          ))}

          {/* 이미지 추가 버튼 - 이미지가 있을 때도 추가 가능 */}
          {images.length < maxFiles && (
            <div className="flex-shrink-0">
              <button
                type="button"
                onClick={handleAddClick}
                className="w-[82px] h-[82px] border-2 border-dashed border-gray-40 rounded-lg flex flex-col items-center justify-center hover:border-gray-50 transition-colors"
              >
                {/* <ImageIcon className='w-8 h-8 text-gray-60'/> */}
                <span className="text-med-20 text-gray-50">+</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 공통 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
}