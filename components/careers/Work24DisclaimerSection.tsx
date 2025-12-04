import Image from 'next/image';

import type CareersMainType from '@mock/careers/types/careersMainType';

interface Work24DisclaimerSectionProps {
  jobData: CareersMainType;
}

const Work24DisclaimerSection = ({ jobData }: Work24DisclaimerSectionProps) => {
  return (
    <div className="flex items-center gap-2 justify-center lg:gap-10 rounded-2xl p-6 bg-red-10 mb-10 lg:mb-0">
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
        <Image
          src={
            jobData?.thumbnailUrl ||
            (jobData.recruitmentJobs &&
            Object.keys(jobData.recruitmentJobs).length > 0
              ? `/assets/[career]thumbnail_${Object.keys(jobData.recruitmentJobs)[0]}.png`
              : '/assets/[career]thumbnail_accounting.png')
          }
          alt="로고 이미지"
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>
      <div className="text-center text-gray-90">
        <p className="text-med-14 lg:text-med-16 mb-1">
          본 자료는 고용노동부 고용24(www.work24.go.kr)에서 제공된 정보이며, 무단복제 및
          배포를 금지합니다.
        </p>
        <p className="text-reg-12 lg:text-reg-12">
          This material is provided by 고용24(www.work24.go.kr) and unauthorized reproduction
          and distribution are prohibited.
        </p>
      </div>
    </div>
  );
};

export default Work24DisclaimerSection;

