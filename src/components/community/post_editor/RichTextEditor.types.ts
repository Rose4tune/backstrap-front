// Rich Text Editor 관련 타입 정의
import { DeltaStatic } from 'quill';

// Delta Operation 타입 (Quill.js 표준)
export interface DeltaOperation {
  insert: string | { image: string } | { video: string };
  attributes?: {
    link?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strike?: boolean;
    color?: string;
    background?: string;
    font?: string;
    size?: string;
    align?: 'left' | 'center' | 'right' | 'justify';
    list?: 'ordered' | 'bullet';
    indent?: number;
    header?: 1 | 2 | 3 | 4 | 5 | 6;
    blockquote?: boolean;
    'code-block'?: boolean;
    alt?: string; // 이미지 alt 텍스트
  };
}

// Delta Content 타입
export type DeltaContent = DeltaOperation[];

// Rich Text Editor Props
export interface RichTextEditorProps {
  value?: DeltaContent;
  onChange?: (delta: DeltaContent, html: string, text: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
  modules?: any; // Quill modules 설정
  formats?: string[]; // 허용된 포맷 목록
  onImageUpload?: (file: File) => Promise<string>; // 이미지 업로드 핸들러
  maxLength?: number;
  minHeight?: number;
  maxHeight?: number;
}

// Rich Text Toolbar Props
export interface RichTextToolbarProps {
  id: string; // Quill 에디터 ID와 연결
  onLinkClick?: () => void;
  onImageClick?: () => void;
  className?: string;
}

// Link Dialog Props
export interface LinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string, text?: string) => void;
  initialUrl?: string;
  initialText?: string;
}

// Enhanced PostData with Rich Content
export interface RichPostData {
  title: string;
  content: DeltaContent; // Delta 형태의 rich content
  contentHtml?: string; // HTML 변환된 내용 (미리보기/저장용)
  contentText?: string; // 순수 텍스트 (검색/요약용)
  category: string;
  isAnonymous: boolean;
  hasImage: boolean;
  hasVote: boolean;
  voteData?: VoteData;
  images?: ImageData[];
}

// Content Transformer 인터페이스
export interface ContentTransformer {
  deltaToApi(delta: DeltaContent): string;
  apiToDelta(content: string): DeltaContent;
  deltaToHtml(delta: DeltaContent): string;
  deltaToText(delta: DeltaContent): string;
  extractImages(delta: DeltaContent): string[];
  validateContent(delta: DeltaContent): { isValid: boolean; errors: string[] };
}

// Quill 에디터 설정
export interface QuillConfig {
  theme: 'snow' | 'bubble';
  modules: {
    toolbar: any;
    clipboard?: any;
    history?: any;
    keyboard?: any;
  };
  formats: string[];
  placeholder?: string;
  readOnly?: boolean;
  bounds?: string | HTMLElement;
  scrollingContainer?: string | HTMLElement;
}

// 이미지 데이터 타입 (기존 확장)
export interface ImageData {
  id: string;
  file: File;
  url: string;
  name: string;
  size: number;
  alt?: string; // alt 텍스트 추가
}

// 투표 데이터 타입 (기존 재사용)
export interface VoteData {
  title: string;
  options: VoteOption[];
}

export interface VoteOption {
  id: string;
  text: string;
}

// Error 타입
export interface RichTextError {
  field: string;
  message: string;
  code?: string;
}

// Validation 결과 타입
export interface RichTextValidationResult {
  isValid: boolean;
  errors: RichTextError[];
  warnings?: string[];
}

// 에디터 상태 타입
export interface RichTextEditorState {
  delta: DeltaContent;
  html: string;
  text: string;
  isEmpty: boolean;
  length: number;
  isValid: boolean;
  errors: RichTextError[];
}

// 커스텀 포맷 설정
export interface CustomFormats {
  enableBold?: boolean;
  enableItalic?: boolean;
  enableUnderline?: boolean;
  enableLink?: boolean;
  enableImage?: boolean;
  enableList?: boolean;
  enableHeader?: boolean;
  enableBlockquote?: boolean;
  enableCodeBlock?: boolean;
  enableColor?: boolean;
  enableAlign?: boolean;
  maxImageSize?: number; // bytes
  allowedImageTypes?: string[]; // ['image/jpeg', 'image/png', 'image/gif']
  linkValidation?: (url: string) => boolean;
}