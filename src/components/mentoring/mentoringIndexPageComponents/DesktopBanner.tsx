import Image from 'next/image';
import MentoringDesktopBanner from 'src/assets/images/mentoring/[renewal]DesktopBanner.png';
export default function DesktopBanner() {
  return (
    <div className="relative w-full overflow-hidden mx-auto">
      <Image
        src={MentoringDesktopBanner}
        alt="멘토링 배너"
        height={356}
        className='object-cover mx-auto'
      />
    </div>
  );
}
