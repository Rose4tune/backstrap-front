import mixpanel from 'mixpanel-browser';
import MentoringCardBannerMobile from 'src/assets/icons/mentoring/[renewal]MentorCardBannerMobile.svg';

export default function MobileCardBanner() {
  return (
    <a
      href="https://walla.my/v/raiBQBxxHOYdDVPSD5Su"
      target="_blank"
      rel="noopener noreferrer"
      className="std:hidden"
      onClick={() => mixpanel.track('click_tobe_mentor', { action: 'mentoring' })}
    >
      <div className="max-w-[550px] w-full relative bg-[#8FA4FF] overflow-hidden mx-auto">
        <MentoringCardBannerMobile className="object-cover max-h-[256px]" />
        <p className="absolute top-[23px] left-[20px] text-semibold-14 text-[#465DC2]">
          대학원 경험 나누고 수익창출!
        </p>
        <p className="absolute top-[43px] left-[20px] text-bold-20 text-white">
          나도 멘토가 될 수 있어요
        </p>
      </div>
    </a>
  );
}
