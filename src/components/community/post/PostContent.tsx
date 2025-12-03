import React from 'react';
import { PostContentProps } from './Post.types';
import LinkDisplay from './LinkDisplay';
import ImagePreviewList from './ImagePreviewList';
import { useMediaQuery } from '@mui/material';

export default function PostContent({
  title,
  content,
  images,
  tags
}: PostContentProps) {
  const isMobile = useMediaQuery('(max-width:550px)');
  return (
    <div>
      {/* 이미지 미리보기 리스트 (맨 위에 배치) */}
      <ImagePreviewList images={images || []} />

      {/* 본문 내용 */}
      <LinkDisplay
        content={content}
        className={`${isMobile?'text-reg-14':'text-med-16'} text-gray-90 leading-[24px]`}
      />
    </div>
  );
}