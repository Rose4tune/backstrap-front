import Header from '@common/Header';
import { ReactNode } from 'react';

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col w-full max-w-[1440px] mx-auto">
      <div className="fixed top-0 left-0 w-full z-50 bg-white">
        <Header view="onboarding" />
      </div>
      <div className="pt-[86px]">{children}</div>
    </div>
  );
}
