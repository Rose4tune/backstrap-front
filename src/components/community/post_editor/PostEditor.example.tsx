import React from 'react';
import PostEditor from './PostEditor';

// 사용 예시
export default function PostEditorExample() {
  const handleSubmit = (data: any) => {
    console.log('게시글 제출:', data);
    // 여기에 실제 API 호출 로직을 추가하세요
  };

  return (
      <PostEditor
        onSubmit={handleSubmit}
        isLoading={false}
        initialData={{
          category: 'free',
          isAnonymous: true,
        }}
      />
  );
}

// 사용법 설명:
/*
1. 기본 사용법:
   <PostEditor onSubmit={handleSubmit} />

2. 초기 데이터와 함께 사용:
   <PostEditor
     onSubmit={handleSubmit}
     initialData={{
       title: "기존 제목",
       content: "기존 내용",
       category: "free",
       isAnonymous: true
     }}
   />

3. 로딩 상태 관리:
   <PostEditor
     onSubmit={handleSubmit}
     isLoading={isSubmitting}
   />
*/