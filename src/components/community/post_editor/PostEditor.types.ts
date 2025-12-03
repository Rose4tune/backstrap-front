// PostEditor 관련 타입 정의
import { DeltaContent } from './RichTextEditor.types';

export interface VoteOption {
  id: string;
  text: string;
}

export interface VoteData {
  title: string;
  options: VoteOption[];
}

export interface ImageData {
  id: string; // 로컬 임시 ID
  fileUuid?: string; // 서버 업로드 후 받은 UUID
  file: File;
  url: string; // 로컬 미리보기 URL 또는 서버 URL
  serverUrl?: string; // 서버에서 받은 실제 URL
  name: string;
  size: number;
  alt?: string; // alt 텍스트 추가
  uploadStatus: 'idle' | 'uploading' | 'uploaded' | 'error';
  uploadError?: string;
}

export interface PostData {
  title: string;
  content: string | DeltaContent; // 일반 텍스트 또는 Delta 형식 지원
  category: string;
  isAnonymous: boolean;
  hasImage: boolean;
  hasVote: boolean;
  voteData?: VoteData;
  images?: ImageData[];
  // Rich content 관련 필드 추가
  contentType?: 'text' | 'rich'; // 콘텐츠 타입 구분
  contentHtml?: string; // HTML 변환된 내용
  contentText?: string; // 순수 텍스트
}

export interface PostEditorProps {
  onSubmit?: (data: PostData) => void;
  isLoading?: boolean;
  initialData?: Partial<PostData>;
  className?: string;
  boardUuid?: string; // 수정할 게시글의 UUID (선택적)
  mode?: 'create' | 'edit'; // 생성 모드인지 수정 모드인지
  initialCategory?: string; // 초기 카테고리 UUID
}

export interface CategoryOption {
  value: string;
  label: string;
}

export interface CategoryDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: CategoryOption[];
  className?: string;
}

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
}

export interface ToolbarProps {
  onImageClick: () => void;
  onVoteClick: () => void;
  hasImage: boolean;
  hasVote: boolean;
  mode?: 'create' | 'edit'; // 편집 모드 구분
  isImageUploading?: boolean; // 이미지 업로드 상태
  className?: string;
}

// 게시글 카테고리 타입
export type PostCategory = 'free' | 'question' | 'study' | 'job';

// 게시글 상태 타입
export type PostStatus = 'draft' | 'published' | 'archived';

// 에러 타입
export interface PostEditorError {
  field: keyof PostData;
  message: string;
}

// 유효성 검사 결과 타입
export interface ValidationResult {
  isValid: boolean;
  errors: PostEditorError[];
}

// 컴포넌트 이벤트 핸들러 타입
export interface PostEditorEventHandlers {
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onCategoryChange: (category: string) => void;
  onAnonymousChange: (isAnonymous: boolean) => void;
  onImageToggle: () => void;
  onVoteToggle: () => void;
  onSubmit: () => void;
}

// 컴포넌트 상태 타입
export interface PostEditorState {
  formData: PostData;
  errors: PostEditorError[];
  isSubmitting: boolean;
  isDirty: boolean;
}