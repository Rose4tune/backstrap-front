// Post 컴포넌트 통합 export 파일

export { default as Post } from './Post';
export { default as PostHeader } from './PostHeader';
export { default as PostMoreMenu } from './PostMoreMenu';
export { default as PostContent } from './PostContent';
export { default as PostActions } from './PostActions';
export { default as CommentSection } from './CommentSection';
export { default as CommentList } from './CommentList';
export { default as CommentInput } from './CommentInput';

// 타입 export
export type {
  Author,
  PostInteraction,
  Comment,
  PostData,
  PostProps,
  PostHeaderProps,
  PostContentProps,
  PostActionsProps,
  CommentListProps,
  CommentInputProps,
} from './Post.types';

export type { PostMoreMenuProps } from './PostMoreMenu';