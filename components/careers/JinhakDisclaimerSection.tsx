import Image from 'next/image';

import type CareersMainType from '@mock/careers/types/careersMainType';

interface JinhakDisclaimerSectionProps {
  jobData: CareersMainType;
}

const JinhakDisclaimerSection = ({ jobData }: JinhakDisclaimerSectionProps) => {
  return (
    <div className="flex items-center gap-2 justify-center lg:gap-10 rounded-2xl p-6 bg-[#E8F2FD] mb-10 lg:mb-0">
      <div className="relative w-32 flex-shrink-0 overflow-hidden rounded-lg">
        <Image src="/logos/logo-jinhakpro.png" alt="JINHAKPRO" width={196} height={42} />
      </div>
      <div className="text-center text-gray-90">
        <p className="text-med-14 lg:text-med-16 mb-1">
          본 자료는 진학프로(https://www.jinhakpro.com/)에서 제공된 정보이며, 무단복제 및 배포를 금지합니다.
        </p>
        <p className="text-reg-12 lg:text-reg-12">
          This material is provided by JinhakPro(https://www.jinhakpro.com/) and unauthorized reproduction
          and distribution are prohibited.
        </p>
      </div>
    </div>
  );
};

export default JinhakDisclaimerSection;

