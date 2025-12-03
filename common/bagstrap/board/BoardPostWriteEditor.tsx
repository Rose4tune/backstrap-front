import React from 'react';
import { Sources } from 'quill';
// @ts-ignore
import Delta from 'quill-delta';
import ReactQuill, { UnprivilegedEditor } from 'react-quill';
import LoadingSurface from '@common/surface/LoadingSurface';

import useFileUpload, {
  FileUploadActionResponse
} from '@hooks/bagstrap/file/useFileUpload.hook';
import QuillNoSSRWrapper from './QuillNoSSRWrapper';

if (typeof window !== 'undefined') {
  const MagicUrl = require('quill-magic-url');
  const Quill = require('react-quill').Quill;
  Quill.register('modules/magicUrl', MagicUrl.default || MagicUrl);
}

export interface BoardPostWriteEditorProps {
  HTMLContent?: string;

  stringifiedDeltaContent?: string;

  onChangeHTMLContent?: (tempContent: string) => void;

  onChangeStringifiedDeltaContent?: (content: string) => void;

  onFileUpload?: (result: FileUploadActionResponse) => void;
}

const BoardPostWriteEditor = (props: BoardPostWriteEditorProps): JSX.Element => {
  const {
    HTMLContent,
    stringifiedDeltaContent,
    onChangeHTMLContent,
    onChangeStringifiedDeltaContent,
    onFileUpload
  } = props;

  const ref = React.useRef<ReactQuill>(null);

  const [el, upload, loading] = useFileUpload(undefined, result => {
    onFileUpload?.call(null, result);
  });

  const modules = React.useMemo(
    () => ({
      toolbar: {
        container: [
          { size: [false, 'small', 'large', 'huge'] },
          { align: [] },
          'bold',
          'italic',
          'underline',
          'strike',
          { color: [] },
          { background: [] },
          'blockquote',
          'link',
          'code-block',
          'formula',
          'image',
          { list: 'ordered' },
          { list: 'bullet' },
          { script: 'sub' },
          { script: 'super' },
          { indent: '-1' },
          { indent: '+1' },
          { direction: 'rtl' },
          'clean'
        ],
        handlers: {
          image: () => {
            upload();
          }
        }
      },
      clipboard: {
        matchVisual: false,
        matchers: [
          [
            'img',
            (node: Node & { src?: any }, delta: Delta) => {
              return node.src &&
                typeof node.src === 'string' &&
                node.src.startsWith('data:')
                ? {
                    ops: []
                  }
                : delta;
            }
          ]
        ]
      },
      magicUrl: true
      // autoLinks: true
    }),
    []
  );

  return (
    <div className="relative">
      <LoadingSurface open={loading} />
      <QuillNoSSRWrapper
        forwardedRef={ref}
        value={HTMLContent}
        onChange={(
          content: string,
          delta: Delta,
          source: Sources,
          editor: UnprivilegedEditor
        ) => {
          onChangeHTMLContent?.call(null, content);
          onChangeStringifiedDeltaContent?.call(
            null,
            JSON.stringify(editor.getContents().ops)
          );
        }}
        placeholder="내용을 입력하세요"
        modules={modules}
      />
      {el}
    </div>
  );
};

export default BoardPostWriteEditor;
