// Post 컴포넌트 관련 타입 정의
import { components } from 'src/types/api';

// 학교 정보 타입 (api.d.ts의 SchoolTypeEntityView 기반)
export interface School {
  name?: string;
  region?: string;
  code?: string;
}

export interface Author {
  id: string;
  nickname?: string; // API에서 optional
  profileImage?: string;
  isAnonymous?: boolean;
  school?: School;
}

export interface PostInteraction {
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  bookmarkCount?: number;
  isBookmarked?: boolean;
  isScraped?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
  likeCount: number;
  isLiked: boolean;
  replies?: Comment[];
  status?: "ACTIVE" | "BLOCKED" | "DELETED" | "INVALID" | "SEARCHABLE";
}

export interface PostData {
  id: string;
  title: string;
  content: string;
  author: Author;
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
  images?: string[];
  category: string;
  categoryUuid?: string;
  interaction: PostInteraction;
  comments: Comment[];
  vote?: components['schemas']['VoteEntityView']; // 투표 데이터 추가
}

export interface PostProps {
  boardData: components['schemas']['BoardEntityView'];
  accessToken?: string;
  onRefresh?: () => void;
}

export interface PostHeaderProps {
  title: string;
  author: Author;
  createdAt: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onSendMessage?: () => void;
  onBlockUser?: () => void;
  onReportUser?: () => void;
  isDeleteLoading?: boolean;
  isBlockLoading?: boolean;
  isReportLoading?: boolean;
  category?: string;
  categoryUuid?: string;
}

export interface PostContentProps {
  title: string;
  content: string;
  images?: string[];
  tags?: string[];
}

export interface PostActionsProps {
  interaction: PostInteraction;
  postUuid: string;
  accessToken?: string;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onScrap?: () => void;
  onBookmark?: () => void;
  onRefresh?: () => void;
}

export interface CommentListProps {
  comments: Comment[];
  onCommentLike?: (commentId: string) => void;
  onReply?: (commentId: string, content: string) => void;
}

export interface CommentInputProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}