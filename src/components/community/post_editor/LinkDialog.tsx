import React, { useState, useEffect } from 'react';
import { LinkDialogProps } from './RichTextEditor.types';

const LinkDialog: React.FC<LinkDialogProps> = ({
  isOpen,
  onClose,
  onInsert,
  initialUrl = '',
  initialText = ''
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);
  const [urlError, setUrlError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
      setText(initialText);
      setUrlError('');
    }
  }, [isOpen, initialUrl, initialText]);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInsert = () => {
    if (!url.trim()) {
      setUrlError('URL을 입력해주세요.');
      return;
    }

    if (!validateUrl(url)) {
      setUrlError('올바른 URL 형식을 입력해주세요.');
      return;
    }

    onInsert(url.trim(), text.trim() || url.trim());
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInsert();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">링크 추가</h3>
        
        <div className="space-y-4">
          {/* URL 입력 */}
          <div>
            <label htmlFor="link-url" className="block text-sm font-medium text-gray-700 mb-2">
              URL *
            </label>
            <input
              id="link-url"
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setUrlError('');
              }}
              onKeyDown={handleKeyDown}
              placeholder="https://example.com"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                urlError ? 'border-red-500' : 'border-gray-300'
              }`}
              autoFocus
            />
            {urlError && (
              <p className="text-sm text-red-600 mt-1">{urlError}</p>
            )}
          </div>

          {/* 링크 텍스트 입력 */}
          <div>
            <label htmlFor="link-text" className="block text-sm font-medium text-gray-700 mb-2">
              링크 텍스트 (선택사항)
            </label>
            <input
              id="link-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="링크에 표시될 텍스트"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">
              비워두면 URL이 그대로 표시됩니다.
            </p>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleInsert}
            className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            추가
          </button>
        </div>

        {/* 미리보기 */}
        {url && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">미리보기:</p>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline break-all"
            >
              {text || url}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkDialog;