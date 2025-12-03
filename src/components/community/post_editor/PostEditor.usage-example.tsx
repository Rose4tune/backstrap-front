// PostEditor 사용 예제
import React from 'react';
import { PostEditor } from 'src/components/community';

// 예제 1: 특정 카테고리로 초기화하여 새 글 작성
const CreatePostWithCategory = () => {
  const handleSubmit = (data: any) => {
    console.log('Submitted data:', data);
  };

  return (
    <PostEditor
      mode="create"
      initialCategory="some-category-uuid" // 원하는 카테고리 UUID 전달
      onSubmit={handleSubmit}
    />
  );
};

// 예제 2: URL 파라미터에서 카테고리를 받아서 사용
const CreatePostWithURLCategory = () => {
  const router = useRouter();
  const { categoryUuid } = router.query;

  return (
    <PostEditor
      mode="create"
      initialCategory={categoryUuid as string}
      onSubmit={(data) => {
        // 제출 처리
        console.log('Post data:', data);
      }}
    />
  );
};

// 예제 3: initialData와 initialCategory 함께 사용
const CreatePostWithInitialData = () => {
  const initialData = {
    title: '초기 제목',
    content: '초기 내용',
    isAnonymous: false,
  };

  return (
    <PostEditor
      mode="create"
      initialData={initialData}
      initialCategory="specific-category-uuid" // initialData의 category보다 우선순위가 낮음
      onSubmit={(data) => {
        console.log('Post data:', data);
      }}
    />
  );
};

export { CreatePostWithCategory, CreatePostWithURLCategory, CreatePostWithInitialData };