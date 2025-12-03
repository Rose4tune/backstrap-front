import mixpanel from 'mixpanel-browser';
import MentoringCardBannerIllust from 'src/assets/icons/mentoring/[renewal]MentoringCardBannerIllust.svg';

export default function DesktopCardBanner() {
  return (
    <div className="px-[80px] min-w-[1440px]">
      <a
        href="https://walla.my/v/raiBQBxxHOYdDVPSD5Su"
        target="_blank"
        rel="noopener noreferrer"
        className="flex bg-[#8FA4FF] h-[256px] rounded-[20px] w-full flex-1 overflow-hidden"
        onClick={() => mixpanel.track('click_tobe_mentor', { view: 'mentoring' })}
      >
        <div
          className="relative flex flex-1 bg-[#8FA4FF] overflow-hidden w-full h-[256px] rounded-[20px]"
          style={{ backgroundColor: '#8FA4FF' }}
        >
          <MentoringCardBannerIllust className="absolute left-[33%] w-[889px] h-[256px]" />
          <p className="absolute top-[32px] left-[32px] text-semibold-22 text-[#465DC2]">
            대학원 경험 나누고 수익창출!
          </p>
          <p className="absolute top-[64px] left-[32px] text-bold-36 text-white">
            나도 멘토가 될 수 있어요
          </p>
          <div className="absolute bottom-[32px] left-[32px] bg-white px-[20px] py-[16px] text-bold-20 text-gray-90 rounded-[16px]">
            멘토 지원하기
          </div>
        </div>
      </a>
    </div>
  );
}
