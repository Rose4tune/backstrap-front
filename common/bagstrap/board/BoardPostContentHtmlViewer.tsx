import clsx from 'clsx';

import { convertLineBreak } from '@utils/common/html.util';

export interface BoardPostContentHtmlViewerProps {
  content: string;
}

const BoardPostContentHtmlViewer = (
  props: BoardPostContentHtmlViewerProps
): JSX.Element => {
  const { content } = props;

  return (
    <div className={clsx('quill', 'px-1')}>
      <div
        className="ql-editor !p-0 typo-body-post break-all"
        dangerouslySetInnerHTML={{
          __html: convertLineBreak(content)
        }}
      />
    </div>
  );
};

export default BoardPostContentHtmlViewer;
