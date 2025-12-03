import React from 'react';
import AutoLinkContentProcessor from './AutoLinkContentProcessor';

interface LinkPreviewDisplayProps {
  text: string;
  className?: string;
}

const LinkPreviewDisplay: React.FC<LinkPreviewDisplayProps> = ({ text, className = '' }) => {
  // 텍스트를 Delta로 변환하여 링크와 이미지 정보 추출
  const delta = AutoLinkContentProcessor.textToDelta(text);

  // Delta를 렌더링 가능한 JSX로 변환
  const renderContent = () => {
    if (!delta || delta.length === 0) {
      return <span>&nbsp;</span>; // 빈 공간 유지
    }

    return delta.map((op, index) => {
      if (typeof op.insert === 'string') {
        // 텍스트 처리
        if (op.attributes?.link) {
          // 링크가 있는 텍스트 - 파란색으로 표시
          return (
            <span
              key={index}
              className="text-blue-600 underline underline-offset-2"
              style={{ textDecorationColor: '#2563eb' }}
            >
              {op.insert}
            </span>
            // <></>
          );
        } else {
          // 일반 텍스트 - 회색으로 표시 (투명하게 처리됨)
          const lines = op.insert.split('\n');
          return lines.map((line, lineIndex) => (
            <React.Fragment key={`${index}-${lineIndex}`}>
              <span className="text-gray-90">{line}</span>
              {lineIndex < lines.length - 1 && <br />}
            </React.Fragment>
          ));
        }
      } else if (op.insert && typeof op.insert === 'object') {
        // 이미지 처리 - 오버레이에서는 [이미지] 텍스트로 표시
        if ('image' in op.insert) {
          return (
            // <span
            //   key={index}
            //   className="text-green-600 bg-green-100 px-2 py-1 rounded text-sm"
            // >
            //   📷 이미지
            // </span>
            <></>
          );
        }
      }

      return null;
    });
  };

  return (
    <div className={`link-preview-display ${className} whitespace-normal break-words`}>
      {renderContent()}
    </div>
  );
};

export default LinkPreviewDisplay;