// Community 컴포넌트 통합 export 파일

export { default as PostEditor } from './PostEditor';
export { default as VoteComponent } from './VoteComponent';
export { default as ImageUploadComponent } from './ImageUploadComponent';
export { default as Recent } from '../box/Recent';
export { default as Best } from '../box/Best';
export { default as CommunityNavigator } from '../CommunityNavigator';

// 타입 export
export type {
  PostData,
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
} from './PostEditor.types';