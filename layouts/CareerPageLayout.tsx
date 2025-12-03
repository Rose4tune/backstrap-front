import { type ReactNode } from 'react';

import { CareerPageLayoutContainer } from './CareerPageLayout.style';

const CareerPageLayout = ({ children }: { children: ReactNode }) => {
  return <CareerPageLayoutContainer>{children}</CareerPageLayoutContainer>;
};

export default CareerPageLayout;
