import React, { useState, useRef } from 'react';
import CheckFilledIcon from '@assets/icons/community/check-filled.svg';
import CheckEmptyIcon from '@assets/icons/community/check-empty.svg';
import PostIcon from '@assets/icons/community/post.svg';
import registerComment from '../../../apis/community/comments/registerComment';
import { useMediaQuery } from '@mui/material';
import useAuthGuardModalDialog from '@hooks/bagstrap/user/useAuthGuardModalDialog.hook';

interface CommentFormProps {
  parentEntityType: 'BOARD' | 'REVIEW' | 'ARTICLE' | 'ARTICLE_REVIEW';
  parentEntityUuid: string;
  placeholder?: string;
  accessToken?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
  autoFocus?: boolean;
  parentReviewUuid?: string;
}

export default function CommentForm({
  parentEntityType,
  parentEntityUuid,
  placeholder = "댓글을 입력해 주세요",
  accessToken,
  onSubmit,
  onCancel,
  showCancel = false,
  autoFocus = false,
  parentReviewUuid
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [AuthModalComponent, openAuthModal, closeAuthModal] = useAuthGuardModalDialog();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useMediaQuery('(max-width:550px)');

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting || !accessToken) return;

    setIsSubmitting(true);
    try {
      const result = await registerComment({
        parentEntityType,
        parentEntityUuid,
        parentReviewUuid,
        content: content.trim(),
        isAnonymous
      }, accessToken);

      if (result.success) {
        setContent('');
        onSubmit?.();
      } else {
        alert(result.messages || '댓글 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('Comment submit error:', error);
      alert('댓글 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };



  if (isMobile) return (
    <div className='w-full flex bg-white fixed bottom-0 left-0 px-5 pb-3 pt-3' style={{ zIndex: 20000000 }}>
      <div className={`bg-gray-20 w-full rounded-2xl px-5 py-3`}>
        <div className="flex flex-col gap-3">
          {/* 입력창 */}
          <div className="flex gap-3 items-center">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-med-14 text-gray-90 placeholder-gray-60 outline-none resize-none min-h-[20px] max-h-32"
              onKeyPress={handleKeyPress}
              autoFocus={autoFocus}
              rows={1}
              style={{
                height: 'auto',
                minHeight: '20px'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
            {/* 하단 액션 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  className='flex items-center'
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  type="button"
                >
                  {isAnonymous ? (
                    <CheckFilledIcon className="w-6 h-6 text-normal" />
                  ) : (
                    <CheckEmptyIcon className="w-6 h-6 text-gray-50" />
                  )}
                </button>
                <span className={`text-semibold-14 ${isAnonymous ? 'text-normal' : 'text-gray-50'}`}>
                  익명
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={!content.trim() || isSubmitting || !accessToken}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-med-14 transition-colors ${content.trim() && !isSubmitting && accessToken
                    ? 'text-normal hover:bg-normal-dark'
                    : 'text-gray-60 cursor-not-allowed'
                    }`}
                  type="button"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
                      등록중...
                    </>
                  ) : (
                    <>
                      <PostIcon className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
  else return (
    <div className={`bg-gray-20 rounded-2xl px-5 py-4`}>
      {AuthModalComponent}
      <div className="flex flex-col gap-3">
        {/* 입력창 */}
        <div className="flex gap-3 items-center">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-med-14 text-gray-90 placeholder-gray-60 outline-none resize-none min-h-[20px] max-h-32"
            onKeyPress={handleKeyPress}
            // autoFocus={autoFocus}
            onFocus={async (e) => {
              if (!accessToken) {
                await e.target.blur();
                openAuthModal();
              }
            }}
            rows={1}
            style={{
              height: 'auto',
              minHeight: '20px'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />
          {/* 하단 액션 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                className='flex items-center'
                onClick={() => setIsAnonymous(!isAnonymous)}
                type="button"
              >
                {isAnonymous ? (
                  <CheckFilledIcon className="w-6 h-6 text-normal" />
                ) : (
                  <CheckEmptyIcon className="w-6 h-6 text-gray-50" />
                )}
              </button>
              <span className={`text-semibold-14 ${isAnonymous ? 'text-normal' : 'text-gray-50'}`}>
                익명
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={!content.trim() || isSubmitting || !accessToken}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-med-14 transition-colors ${content.trim() && !isSubmitting && accessToken
                  ? 'text-normal hover:bg-normal-dark'
                  : 'text-gray-60 cursor-not-allowed'
                  }`}
                type="button"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
                    등록중...
                  </>
                ) : (
                  <>
                    <PostIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}