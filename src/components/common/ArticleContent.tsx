import React from "react";

interface QuillOp {
  insert: string | { image?: string };
  attributes?: {
    link?: string;
    bold?: boolean;
    italic?: boolean;
    header?: number;
  };
}

export default function ArticleContent({
  content,
}: {
  content: string | object;
}) {
  if (!content) return <div>내용이 없습니다.</div>;

  // HTML 형태로 저장된 내용 처리
  if (typeof content === "string" && content.trim().startsWith("<")) {
    return (
      <div
        className="ql-editor-viewer"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // JSON 형태(Quill Delta) 처리
  const elements = convertQuillToHtmlElements(content);

  return (
    <div className="ql-editor-viewer">
      {elements.map((el, i) => (
        <React.Fragment key={i}>{el}</React.Fragment>
      ))}

      <style jsx global>{`
        .ql-editor-viewer {
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: #1a1a1a;
          font-size: 15px;
          line-height: 1.8;
          font-family: "Pretendard", "Wanted Sans", sans-serif;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .ql-editor-viewer a {
          color: #007aff;
          text-decoration: underline;
        }

        .ql-editor-viewer img {
          max-width: 40%;
          height: auto;
          margin: 8px 0;
          display: block;
          border-radius: 0;
        }

        .ql-editor-viewer h1 {
          font-size: 22px !important;
          font-weight: 700 !important;
          margin: 20px 0 8px !important;
        }

        .ql-editor-viewer h2 {
          font-size: 20px !important;
          font-weight: 600 !important;
          margin: 18px 0 6px !important;
        }

        .ql-editor-viewer h3 {
          font-size: 18px !important;
          font-weight: 600 !important;
          margin: 16px 0 4px !important;
        }

        .ql-editor-viewer ol,
        .ql-editor-viewer ul {
          padding-left: 1.8em;
        }

        .ql-editor-viewer ol {
          list-style-type: decimal;
        }

        .ql-editor-viewer ul {
          list-style-type: disc;
        }

        @media (min-width: 1920px) {
          .ql-editor-viewer {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
}

function convertQuillToHtmlElements(deltaInput: string | object): JSX.Element[] {
  try {
    const delta =
      typeof deltaInput === "string" ? JSON.parse(deltaInput) : deltaInput;

    if (!delta || !Array.isArray((delta as any).ops)) return [];

    const elements: JSX.Element[] = [];
    let currentLine: React.ReactNode[] = [];

    // 현재 줄을 저장하고 초기화하는 함수
    const saveCurrentLine = (key: string, headingLevel?: number) => {
      if (currentLine.length === 0) return;

      const lineContent = <>{currentLine}</>;
      if (headingLevel) {
        const HeadingTag = `h${headingLevel}` as keyof JSX.IntrinsicElements;
        elements.push(<HeadingTag key={key}>{lineContent}</HeadingTag>);
      } else {
        elements.push(
          <p key={key} className="whitespace-pre-wrap break-words">
            {lineContent}
          </p>
        );
      }
      currentLine = [];
    };

    (delta as any).ops.forEach((op: QuillOp, index: number) => {
      // 이미지 처리
      if (typeof op.insert === "object" && op.insert.image) {
        saveCurrentLine(`line-before-image-${index}`);
        elements.push(
          <img
            key={`img-${index}`}
            src={op.insert.image}
            alt="본문 이미지"
            className="my-4 rounded-xl max-w-full"
          />
        );
        return;
      }

      // 텍스트 처리
      if (typeof op.insert === "string") {
        // 줄바꿈일 경우 한 단락 마감
        if (op.insert === "\n") {
          const headingSize = op.attributes?.header;
          saveCurrentLine(`line-${index}`, headingSize);
        } else {
          let textNode: React.ReactNode = op.insert;

          // 링크 처리
          if (op.attributes?.link) {
            textNode = (
              <a
                href={op.attributes.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {textNode}
              </a>
            );
          }
          if (op.attributes?.bold) {
            textNode = <strong>{textNode}</strong>;
          }
          if (op.attributes?.italic) {
            textNode = <em>{textNode}</em>;
          }

          currentLine.push(
            <React.Fragment key={`text-${index}`}>{textNode}</React.Fragment>
          );
        }
      }
    });

    // 마지막 줄 저장
    saveCurrentLine("end-line");

    return elements;
  } catch (error) {
    console.error("Delta 파싱 실패:", error);
    return [<span key="error">내용을 불러올 수 없습니다.</span>];
  }
}
