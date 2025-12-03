import { type ReactNode } from 'react';
import { PostPageLayoutContainer } from './PostPageLayout.style';
import PostEditPopup from 'src/components/community/PostEditPopup';

const PostPageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <PostPageLayoutContainer>
      {children}
    </PostPageLayoutContainer>
  );
};

export default PostPageLayout;
