import Image from 'next/image';
import MentoringMobileBanner from 'src/assets/images/mentoring/[renewal]MobileBanner.png';

export default function MobileBanner() {
  return (
    <div className="max-w-[550px] relative w-full left-1/2 -translate-x-1/2 h-[250px] overflow-hidden">
      <Image
        src={MentoringMobileBanner}
        alt="멘토링 배너"
        fill
        className='object-cover'
      />
    </div>
  );
}
