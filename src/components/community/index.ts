// Community 컴포넌트 통합 export 파일

// Post Editor 관련
export { default as PostEditor } from './post_editor/PostEditor';
export { default as VoteComponent } from './post_editor/VoteComponent';
export { default as ImageUploadComponent } from './post_editor/ImageUploadComponent';

// Post 관련
export {
  Post,
  PostHeader,
  PostContent,
  PostActions,
  CommentSection,
  CommentList,
  CommentInput
} from './post';

// 커뮤니티 페이지 컴포넌트들
export { default as Recent } from './box/Recent';
export { default as Best } from './box/Best';
export { default as Similar } from './box/Similar';
export { default as CommunityNavigator } from './CommunityNavigator';
export { default as MainList } from './MainList';

// Post Editor 타입 export
export type {
  PostData as PostEditorData,
  PostEditorProps,
  CategoryOption,
  CategoryDropdownProps,
  CheckboxProps,
  ToolbarProps,
  PostCategory,
  PostStatus,
  PostEditorError,
  ValidationResult,
  PostEditorEventHandlers,
  PostEditorState,
  VoteOption,
  VoteData,
  ImageData,
} from './post_editor/PostEditor.types';

// Post 타입 export
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
} from './post';