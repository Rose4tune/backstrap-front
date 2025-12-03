import clsx from 'clsx';
import Image from 'next/image';

import BaseLink from '@common/BaseLink';

import AppStore from 'public/images/appstore-apple.png';
import PlayStore from 'public/images/appstore-google.png';
import AppBanner from 'public/images/app-banner.png';

const MOBILE_APP = {
  GOOGLE: {
    Link: 'https://play.google.com/store/apps/details?id=com.bagstrap.bagstrapmobile',
    Logo: PlayStore
  },
  APPLE: {
    Link: 'https://apps.apple.com/kr/app/%EA%B0%80%EB%B0%A9%EB%81%88/id1555399067',
    Logo: AppStore
  }
};

// @deprecated https://bagstrap.netlify.app
const AppLinkBannerSection = (): JSX.Element => {
  return (
    <section
      className={clsx(
        'relative',
        'h-14',
        'md:h-[160px]',
        'xl:col-span-1 xl:pt-[72%] xl:h-auto'
      )}
    >
      <div
        className={clsx(
          'absolute inset-0 bg-primary-light rounded-2xl',
          'flex items-center gap-[22px] px-5',
          'md:rounded-[28px]',
          'xl:flex-col xl:items-start xl:justify-between xl:py-6 xl:overflow-hidden'
        )}
      >
        <div
          className={clsx(
            'absolute bottom-0 right-0 w-[66px] h-[70px]',
            'md:w-[134px] md:h-[150px]',
            'xl:w-2/3 xl:-right-30 xl:h-[200px]'
          )}
        >
          <Image
            src={AppBanner}
            alt="app with hands"
            placeholder="blur"
            width={256}
            height={291}
          />
        </div>
        <div className={clsx('leading-none', 'md:space-y-2', 'xl:space-y-1')}>
          <p
            className={clsx(
              'text-grey5 typo-body10 scale-[0.8] origin-left leading-tight',
              'sm:scale-100',
              'md:typo-body5 md:font-light',
              'xl:typo-body3'
            )}
          >
            내 손 안의
            <br />
            똑똑한 대학원 생활,
          </p>
          <div className="leading-none">
            <strong className={clsx('text-grey5 text-[13px] font-bold', 'md:typo-body3')}>
              가방끈
            </strong>
          </div>
        </div>
        <div className={clsx('flex-center gap-1', 'xl:flex-row xl:gap-2 xl:w-4/5')}>
          <BaseLink
            target="_blank"
            href={MOBILE_APP.GOOGLE.Link}
            className={clsx(
              'w-[76px] h-[26px]',
              'md:w-[118px] md:h-10',
              'xl:w-full xl:h-auto'
            )}
            style={{ zIndex: 99, backgroundColor: 'white', borderRadius: '10px' }}
            aria-label="play store link"
          >
            <Image
              src={MOBILE_APP.GOOGLE.Logo}
              alt="play store icon"
              placeholder="blur"
            />
          </BaseLink>
          <BaseLink
            target="_blank"
            href={MOBILE_APP.APPLE.Link}
            className={clsx(
              'w-[76px] h-[26px]',
              'md:w-[118px] md:h-10',
              'xl:w-full xl:h-auto'
            )}
            style={{ zIndex: 99, backgroundColor: 'white', borderRadius: '10px' }}
            aria-label="app store link"
          >
            <Image src={MOBILE_APP.APPLE.Logo} alt="app store icon" placeholder="blur" />
          </BaseLink>
          {/* <div
            className={clsx(
              'absolute bottom-0 right-0 w-[66px] h-[70px]',
              'md:w-[134px] md:h-[150px]',
              'xl:w-2/3 xl:-right-30 xl:h-[200px]'
            )}
          >
            <Image
              src={AppBanner}
              alt="app with hands"
              placeholder="blur"
              width={256}
              height={291}
            />
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default AppLinkBannerSection;
