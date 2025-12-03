import { useState } from 'react';

const useCopyLink = () => {
  const [copied, setCopied] = useState(false);

  const copyLink = async (link?: string) => {
    const url = link || window.location.href;

    try {
      // 첫 번째 시도: 현대적인 클립보드 API (HTTPS 환경에서만 작동)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch (err) {
      console.warn('클립보드 API 실패, 폴백 방법 시도:', err);
    }

    try {
      // 두 번째 시도: 레거시 방법 (execCommand) - 모바일에서 더 안정적
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch (err) {
      console.warn('execCommand 복사 실패:', err);
    }

    try {
      // 세 번째 시도: 모바일에서 텍스트 선택 후 복사 (iOS Safari 등)
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.readOnly = true;
      textArea.style.position = 'absolute';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);

      // iOS에서는 setSelectionRange 사용
      if (navigator.userAgent?.match(/ipad|iphone/i)) {
        const range = document.createRange();
        range.selectNodeContents(textArea);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        textArea.setSelectionRange(0, 999999);
      } else {
        textArea.select();
      }

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch (err) {
      console.warn('모바일 복사 폴백 실패:', err);
    }

    // 모든 방법이 실패한 경우 사용자에게 알림
    console.error('모든 복사 방법 실패');
    alert(`링크 복사에 실패했습니다.\n수동으로 복사해주세요:\n${url}`);
  };

  return { copyLink, copied };
};

export default useCopyLink;
