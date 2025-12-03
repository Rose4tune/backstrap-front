import React from 'react';
import LikeIcon from '@assets/icons/community/favorite.svg';
import LikeFilledIcon from '@assets/icons/community/favorite-filled.svg';
import { CommentListProps, Comment } from './Post.types';

function CommentItem({
  comment,
  onLike,
  onReply,
  isReply = false
}: {
  comment: Comment;
  onLike?: (commentId: string) => void;
  onReply?: (commentId: string) => void;
  isReply?: boolean;
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <div className={`flex gap-3`}>
      {/* 프로필 이미지 */}
      <div className="w-8 h-8 rounded-full bg-gray-30 overflow-hidden flex-shrink-0">
        {comment.author.profileImage ? (
          <img
            src={comment.author.profileImage}
            alt={`${comment.author.nickname || '익명'} 프로필`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-40 flex items-center justify-center">
            <span className="text-med-12 text-gray-60">
              {comment.author.isAnonymous ? '익명' : (comment.author.nickname || '익명').charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* 댓글 내용 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-semibold-12 text-gray-90 leading-[16px]">
            {comment.author.isAnonymous ? '익명' : (comment.author.nickname || '익명')}
          </span>
          <span className="text-med-10 text-gray-50 leading-[14px]">
            {formatDate(comment.createdAt)}
          </span>
        </div>

        <p className="text-med-14 text-gray-90 leading-[20px] mb-2 whitespace-pre-wrap">
          {comment.content}
        </p>

        {/* 댓글 액션 */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onLike?.(comment.id)}
            className="flex items-center gap-1 hover:bg-gray-20 rounded px-1 py-0.5 -mx-1 -my-0.5 transition-colors"
            aria-label={comment.isLiked ? '좋아요 취소' : '좋아요'}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              {comment.isLiked ? (
                <LikeFilledIcon className="w-full h-full text-red" />
              ) : (
                <LikeIcon className="w-full h-full text-gray-50" />
              )}
            </div>
            {comment.likeCount > 0 && (
              <span className={`text-med-12 leading-[16px] ${
                comment.isLiked ? 'text-red' : 'text-gray-50'
              }`}>
                {comment.likeCount}
              </span>
            )}
          </button>

          {!isReply && onReply && (
            <button
              type="button"
              onClick={() => onReply(comment.id)}
              className="text-med-12 text-gray-50 leading-[16px] hover:text-gray-70 transition-colors"
            >
              답글
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CommentList({
  comments,
  onCommentLike,
  onReply
}: CommentListProps) {
  return (
    <div className="p-5">
      {comments.map((comment) => (
        <div key={comment.id} className="space-y-3">
          <CommentItem
            comment={comment}
            onLike={onCommentLike}
            onReply={onReply ? () => onReply(comment.id, '') : undefined}
          />

          {/* 대댓글 */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onLike={onCommentLike}
                  isReply={true}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}