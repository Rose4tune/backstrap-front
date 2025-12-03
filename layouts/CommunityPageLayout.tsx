import { type ReactNode } from 'react';
import { CommunityPageLayoutContainer } from './CommunityPageLayout.style';

const CommunityPageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <CommunityPageLayoutContainer>
      {children}
    </CommunityPageLayoutContainer>
  );
};

export default CommunityPageLayout;
