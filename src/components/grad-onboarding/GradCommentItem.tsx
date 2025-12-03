import React, { useState, useRef, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import SchoolIcon from '@assets/icons/community/school.svg';
import ChevronRightIcon from '@assets/icons/community/reply.svg';
import { Comment } from 'src/components/community/post/Post.types';
import {
    COOKIE_NS,
    COOKIE_NS_APPLE_OAUTH,
    COOKIE_NS_KAKAO_OAUTH
} from '@constants/common/cookie.constant';
import { useStore } from '@stores/useStore.hook';
import { useMediaQuery } from '@mui/material';
import CommentForm from '../community/comments/CommentForm';
import deleteComment from '@api/community/comments/deleteComment';
import editComment from '@api/community/comments/editComment';
import GradCommentActions from './GradCommentActions';

interface CommentItemProps {
    comment: Comment;
    currentUserId?: string;
    isReply?: boolean;
    isPostAuthor?: boolean;
    postAuthorId?: string;
    onRefresh?: () => void;
    rootCommentId?: string; // 최상위 댓글 ID (답글의 답글을 위함)
}

export default function GradCommentItem({
    comment,
    currentUserId,
    isReply = false,
    isPostAuthor = false,
    postAuthorId,
    onRefresh,
    rootCommentId
}: CommentItemProps) {
    console.log('CommentItem 렌더링됨:', comment.id);

    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [isDeleting, setIsDeleting] = useState(false);
    const [cookies] = useCookies();
    const { UserStore } = useStore();
    const isMobile = useMediaQuery('(max-width:550px)');
    // accessToken 가져오기
    const accessToken =
        cookies[COOKIE_NS]?.authPayload?.access_token ||
        cookies[COOKIE_NS_APPLE_OAUTH]?.authPayload?.access_token ||
        cookies[COOKIE_NS_KAKAO_OAUTH]?.authPayload?.access_token;

    const isOwn = UserStore.getUserId() === comment.author.id;
    const isDeleted = comment.status === 'DELETED';
    const replyFormRef = useRef<HTMLDivElement>(null);
    const commentRef = useRef<HTMLDivElement>(null);

    // 컴포넌트 마운트 테스트
    useEffect(() => {
    }, []);

    // 답글 상태 변경 테스트
    useEffect(() => {
    }, [showReplyForm]);

    // // 답글 폼이 열릴 때 댓글로 스크롤
    // useEffect(() => {
    //   if (showReplyForm && commentRef.current) {
    //     // 약간의 지연을 두고 스크롤 (답글 폼이 완전히 렌더링된 후)
    //     setTimeout(() => {
    //       commentRef.current?.scrollIntoView({
    //         behavior: 'smooth',
    //         block: 'nearest'
    //       });
    //     }, 100);
    //   }
    // }, [showReplyForm]);

    // 외부 클릭 감지로 답글 폼 닫기
    useEffect(() => {
        if (!showReplyForm) {
            return;
        }

        const handleOutsideClick = (event: MouseEvent) => {
            if (replyFormRef.current && !replyFormRef.current.contains(event.target as Node)) {
                setShowReplyForm(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [showReplyForm]);

    // 댓글 수정
    const handleEdit = async () => {
        if (!editContent.trim() || editContent === comment.content) {
            setIsEditing(false);
            setEditContent(comment.content);
            return;
        }

        try {
            const result = await editComment({
                uuid: comment.id,
                content: editContent.trim()
            }, accessToken);

            if (result.success) {
                setIsEditing(false);
                onRefresh?.();
            } else {
                alert(result.messages || '댓글 수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('Comment edit error:', error);
            alert('댓글 수정 중 오류가 발생했습니다.');
        }
    };

    // 댓글 삭제
    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteComment({ uuid: comment.id }, accessToken);

            if (result.success) {
                onRefresh?.();
            } else {
                alert(result.messages || '댓글 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('Comment delete error:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div
            ref={commentRef}
            className={`bg-white transition-all duration-300`}
        >
            {
                isDeleted ? (
                    <div className='flex flex-row items-center w-full'>
                        {isReply && (
                            <ChevronRightIcon className="w-5 h-5 text-gray-60" />
                        )}
                        <div className="bg-gray-40 rounded-xl px-5 py-3 mt-4 w-full">
                            <span className="text-med-14 text-gray-70">작성자가 삭제한 댓글입니다.</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* 댓글 헤더 - 피그마 디자인에 맞춰 단순화 */}
                        <div className="flex items-center justify-between pt-5 pb-3">
                            <div className="flex items-center gap-2">
                                {isReply && (
                                    <ChevronRightIcon className="w-5 h-5 text-gray-60" />
                                )}

                                <div className="flex items-center gap-2">
                                    {!comment.author.isAnonymous && (
                                        <img
                                            src={comment.author.profileImage}
                                            alt={`${comment.author.id} profile`}
                                            className="w-6 h-6 rounded-full object-cover"
                                            onError={(e) => {
                                                // Fallback to default image on error
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    )}
                                    <span className={`${isMobile ? 'text-semibold-12' : 'text-bold-14'} ${isPostAuthor
                                        ? 'text-normal'
                                        : 'text-gray-90'
                                        }`}>
                                        {isPostAuthor
                                            ? '끈쓴이'
                                            : comment.author.nickname || '익명'}
                                    </span>
                                </div>

                                {comment.author.school && (
                                    <div className="flex items-center gap-1">
                                        <SchoolIcon className="w-5 h-5 text-gray-60" />
                                        <span className={`${isMobile ? 'text-semibold-12' : 'text-bold-14'} text-gray-60`}>{comment.author.school.name}</span>
                                    </div>
                                )}
                            </div>

                            {/* 더보기 버튼 - 피그마 디자인과 동일하게 */}
                            <GradCommentActions
                                commentId={comment.id}
                                authorId={comment.author.id}
                                likeCount={comment.likeCount}
                                isLiked={comment.isLiked}
                                isOwn={isOwn}
                                isAnnonymousAuthor={comment.author.isAnonymous}
                                accessToken={accessToken}
                                onRefresh={onRefresh}
                                onEdit={() => setIsEditing(true)}
                                onDelete={handleDelete}
                                onReply={() => setShowReplyForm(!showReplyForm)}
                                compact={true}
                            />
                        </div>

                        {/* 답글 관련 전체 영역 */}
                        <div ref={replyFormRef}>
                            {/* 댓글 내용과 좋아요 - 피그마 디자인에 맞춰 justify-between 배치 */}
                            <div className="flex items-start justify-between w-full">
                                <div className="flex flex-col gap-1 items-start flex-1">
                                    {isEditing ? (
                                        <div className="space-y-3 w-full">
                                            <textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className="w-full p-3 border border-gray-30 rounded-lg text-med-14 resize-none"
                                                rows={3}
                                                autoFocus
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setEditContent(comment.content);
                                                    }}
                                                    className="px-3 py-1 text-med-12 text-gray-60 hover:text-gray-90 transition-colors"
                                                >
                                                    취소
                                                </button>
                                                <button
                                                    onClick={handleEdit}
                                                    className="px-3 py-1 bg-normal text-white rounded text-med-12"
                                                >
                                                    저장
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* 댓글 내용 - 피그마 Med-16 스타일 적용 */}
                                            <p className={`${isMobile ? 'text-med-14' : 'text-med-16'} text-gray-90 leading-[22px] tracking-[0.0912px] whitespace-normal break-all`}>
                                                {comment.content}
                                            </p>
                                            {/* 답글 달기 - 피그마 Med-12 스타일 적용 */}
                                            <button
                                                onClick={() => setShowReplyForm(!showReplyForm)}
                                                className="text-med-12 text-gray-60 hover:text-gray-90 transition-colors"
                                            >
                                                답글 달기
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* 좋아요 버튼 - 피그마 디자인과 동일한 위치 */}
                                {!isEditing && (
                                    <div className="ml-4">
                                        <GradCommentActions
                                            commentId={comment.id}
                                            authorId={comment.author.id}
                                            likeCount={comment.likeCount}
                                            isLiked={comment.isLiked}
                                            isOwn={isOwn}
                                            accessToken={accessToken}
                                            onRefresh={onRefresh}
                                            onEdit={() => setIsEditing(true)}
                                            onDelete={handleDelete}
                                            onReply={() => setShowReplyForm(!showReplyForm)}
                                            likeOnly={true}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* 답글 입력 폼 */}
                            {showReplyForm && (
                                <div className={`pt-3 pb-5`}>
                                    <CommentForm
                                        parentReviewUuid={isReply ? rootCommentId : comment.id}
                                        parentEntityType="ARTICLE_REVIEW"
                                        parentEntityUuid={isReply ? (rootCommentId || comment.id) : comment.id}
                                        placeholder="답글을 입력하세요..."
                                        accessToken={accessToken}
                                        onSubmit={() => {
                                            setShowReplyForm(false);
                                            onRefresh?.();
                                        }}
                                        onCancel={() => setShowReplyForm(false)}
                                        showCancel={true}
                                        autoFocus={true}
                                    />
                                </div>
                            )}
                        </div>
                    </>
                )
            }

            {/* 답글 목록 */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="pt-1">
                    {comment.replies.map((reply) => (
                        <GradCommentItem
                            key={reply.id}
                            comment={reply}
                            currentUserId={currentUserId}
                            isReply={true}
                            isPostAuthor={reply.author.id === postAuthorId}
                            postAuthorId={postAuthorId}
                            onRefresh={onRefresh}
                            rootCommentId={rootCommentId || comment.id}
                        />
                    ))}
                </div>
            )}

            {isDeleting && (
                <div className="pb-3">
                    <div className="flex items-center gap-2 text-med-14 text-gray-60">
                        <div className="w-4 h-4 border border-gray-60 border-t-transparent rounded-full animate-spin" />
                        댓글을 삭제하는 중...
                    </div>
                </div>
            )}
        </div>
    );
}