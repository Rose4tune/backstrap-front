import Image from 'next/image';

import CommonButton from '@common/button/CommonButton';

import type CareersMainType from '@mock/careers/types/careersMainType';

interface JinhakProSectionProps {
  jobData: CareersMainType;
  onButtonClick: () => void;
}

const JinhakProSection = ({ jobData, onButtonClick }: JinhakProSectionProps) => {
  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-gray-40 bg-white py-16 px-6">
      <div>
        <Image src="/logos/logo-jinhakpro.png" alt="JINHAKPRO" width={196} height={42} />
      </div>
      <div className="text-center">
        <h3 className="mb-2 text-med-14 lg:text-lg font-bold text-gray-90">{jobData.title}</h3>
        <p className="text-reg-12 lg:text-sm text-gray-70">
          석·박사 채용 접수 플랫폼, 진학프로에서 자세한 공고 내용을 확인해보세요!
        </p>
      </div>
      <CommonButton
        text="진학프로에서 확인"
        size="full"
        emphasis="primary"
        onClick={onButtonClick}
        className="text-med-14 lg:text-med-16 max-w-[155px] !bg-[#3285E7]"
      />
    </div>
  );
};

export default JinhakProSection;
