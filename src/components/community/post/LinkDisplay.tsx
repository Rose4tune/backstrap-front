import React from 'react';

interface LinkDisplayProps {
  content: string;
  className?: string;
}

const LinkDisplay: React.FC<LinkDisplayProps> = ({ content, className = '' }) => {
  const URL_REGEX = /(https?:\/\/[^\s]+)/g;

  const renderContentWithLinks = () => {
    if (!content) return null;

    // HTML 태그가 포함되어 있는지 확인
    const hasHTMLTags = /<[^>]*>/g.test(content);
    
    if (hasHTMLTags) {
      // HTML이 포함된 경우 dangerouslySetInnerHTML 사용
      return (
        <div 
          dangerouslySetInnerHTML={{ 
            __html: content.replace(/\n/g, '<br>') 
          }} 
        />
      );
    }

    // 일반 텍스트인 경우 기존 로직 사용
    const lines = content.split('\n');

    return lines.map((line, lineIndex) => {
      const parts = line.split(URL_REGEX);

      return (
        <React.Fragment key={lineIndex}>
          {parts.map((part, partIndex) => {
            if (URL_REGEX.test(part)) {
              // URL인 경우 링크로 렌더링
              return (
                <a
                  key={partIndex}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline underline-offset-2 hover:text-blue-800 transition-colors break-all"
                >
                  {part}
                </a>
              );
            } else {
              // 일반 텍스트
              return <div className='flex whitespace-normal break-words break-all' key={partIndex}>{part}</div>;
            }
          })}
          {lineIndex < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div className={className}>
      {renderContentWithLinks()}
    </div>
  );
};

export default LinkDisplay;