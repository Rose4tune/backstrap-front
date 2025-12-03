import React, { useState } from 'react';
import SendIcon from '@assets/icons/community/post.svg';

interface CommentInputProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function CommentInput({
  onSubmit,
  placeholder = '댓글을 입력하세요...',
  isLoading = false,
  onFocus,
  onBlur
}: CommentInputProps) {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || isLoading) {
      return;
    }

    onSubmit(content.trim());
    setContent('');
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };


  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      {/* 댓글 입력 필드 */}
      <div className="flex-1 relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          className={`w-full resize-none border rounded-xl px-4 py-3 text-med-14 text-gray-90 leading-[20px] placeholder-gray-50 transition-all duration-200 ${
            isFocused
              ? 'border-normal bg-white'
              : 'border-gray-30 bg-gray-20'
          } ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{ minHeight: '44px' }}
        />
      </div>

      {/* 전송 버튼 */}
      <button
        type="submit"
        disabled={!content.trim() || isLoading}
        className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200 ${
          content.trim() && !isLoading
            ? 'bg-normal hover:bg-hover text-white'
            : 'bg-gray-30 text-gray-50 cursor-not-allowed'
        }`}
        aria-label="댓글 전송"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-gray-50 border-t-transparent rounded-full animate-spin" />
        ) : (
          <SendIcon className="w-5 h-5" />
        )}
      </button>
    </form>
  );
}