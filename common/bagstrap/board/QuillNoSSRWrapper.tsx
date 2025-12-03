import dynamic from 'next/dynamic';

import ReactQuill, { ReactQuillProps } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
let quillMagicUrl: any = null;

if (typeof window !== 'undefined') {
  quillMagicUrl = require('quill-magic-url');
}

interface ForwardedQuillComponent extends ReactQuillProps {
  forwardedRef: React.Ref<ReactQuill>;
}

const QuillNoSSRWrapper = dynamic(
  async () => {
    const { default: ReactQuill } = await import('react-quill');

    // Quill 플러그인 등록
    if (quillMagicUrl) {
      const Quill = (await import('quill')).default;
      Quill.register('modules/magicUrl', quillMagicUrl.default || quillMagicUrl);
    }

    return (props: any) => <ReactQuill {...props} />;
  },
  { loading: () => <div>...loading</div>, ssr: false }
);

export default QuillNoSSRWrapper;
