import React from 'react';
import Post from './Post';

// 사용 예시: UUID로 API에서 데이터 로딩
export function PostExample() {
  return (
    <div className="container mx-auto max-w-4xl p-4">
      <h2 className="text-xl font-bold mb-4">Post 컴포넌트 사용 예시</h2>
      <Post uuid="existing-board-uuid-here" />
    </div>
  );
}

// Next.js 페이지에서 사용하는 예시
/*
// pages/community/post/[uuid].tsx - UUID로 게시글 표시
import { useRouter } from 'next/router';
import Post from '../../../src/components/community/post/Post';

export default function PostDetail() {
  const router = useRouter();
  const { uuid } = router.query;

  if (!uuid || typeof uuid !== 'string') {
    return <div>게시글을 불러오는 중...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Post uuid={uuid} />
    </div>
  );
}

// pages/community/index.tsx - 게시글 목록에서 각 항목을 UUID로 표시
import Post from '../src/components/community/post/Post';

export default function CommunityHome() {
  // UUID 배열 (실제로는 게시글 목록 API에서 가져온 UUID들)
  const postUuids = [
    'uuid-1',
    'uuid-2', 
    'uuid-3'
  ];

  return (
    <div className="container mx-auto p-4">
      {postUuids.map(uuid => (
        <Post key={uuid} uuid={uuid} />
      ))}
    </div>
  );
}
*/

export default PostExample;