import React from 'react';
import { useRouter } from 'next/router';
import PostEditor from './PostEditor';
import { PostData } from './PostEditor.types';

// 사용 예시: 게시글 수정 페이지
// URL에 uuid가 있으면 자동으로 수정 모드, 없으면 생성 모드
export function EditPostPage() {
  const router = useRouter();

  const handleSubmit = (data: PostData) => {
    console.log('Updated post data:', data);
    // 성공 시 게시글 상세 페이지로 이동 (router.query.uuid 사용)
    if (router.query.uuid) {
      router.push(`/community/board/${router.query.uuid}`);
    } else {
      router.push('/community');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {router.query.uuid ? '게시글 수정' : '새 게시글 작성'}
      </h1>
      
      <PostEditor onSubmit={handleSubmit} />
    </div>
  );
}

// 사용 예시: 새 게시글 작성 페이지
export function CreatePostPage() {
  const router = useRouter();

  const handleSubmit = (data: PostData) => {
    console.log('New post data:', data);
    // 성공 시 커뮤니티 메인으로 이동
    router.push('/community');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">새 게시글 작성</h1>
      
      <PostEditor onSubmit={handleSubmit} />
    </div>
  );
}

// Next.js 페이지에서 사용하는 예시
/*
// pages/community/post/write.tsx - 새 게시글 작성
import PostEditor from '../../../src/components/community/post_editor/PostEditor';

export default function CreatePost() {
  const handleSubmit = (data) => {
    console.log('New post:', data);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">새 게시글 작성</h1>
      <PostEditor onSubmit={handleSubmit} />
    </div>
  );
}

// pages/community/post/edit/[uuid].tsx - 게시글 수정
import PostEditor from '../../../../src/components/community/post_editor/PostEditor';

export default function EditPost() {
  const handleSubmit = (data) => {
    console.log('Updated post:', data);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">게시글 수정</h1>
      <PostEditor onSubmit={handleSubmit} />
    </div>
  );
}
*/

export default PostEditor;