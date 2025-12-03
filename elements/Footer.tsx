import { memo } from 'react';
import clsx from 'clsx';

import BaseLink from '@common/BaseLink';
import YoutubeIcon from '@public/icons/[layout]youtube.svg';
import InstagramIcon from '@public/icons/[layout]instagram.svg';

interface FooterProps {
  logoOnly?: boolean;
}

function Footer({ logoOnly }: FooterProps) {
  if (logoOnly) return null;

  return (
    <section
      className={clsx(
        'pt-12',
        'md:pt-20 md:pb-6 px-20'
        // "md:px-8"
      )}
    >
      <div
        className={clsx(
          'relative min-w-[320px] w-full mx-auto py-3',
          'flex-between'
        )}
      >
        <div className={clsx('space-y-1', 'text-[#727272] text-tiny')}>
          <div className={clsx('space-y-1', 'lg:flex lg:gap-3 lg:space-y-0')}>
            <div className={clsx('space-y-1', 'md:flex md:gap-3 md:space-y-0')}>
              <dl className={clsx('flex items-baseline gap-x-1', 'md:gap-x-3')}>
                <dt className="font-bold">회사명</dt>
                <dd className="">주식회사 아웃스탠더스</dd>
              </dl>
              <dl className={clsx('flex items-baseline gap-x-1', 'md:gap-x-3')}>
                <dt className="font-bold">주소</dt>
                <dd className="">서울시 노원구 광운로 15길 51, 3</dd>
              </dl>
            </div>
            <div className={clsx('flex items-baseline gap-8', 'md:gap-x-3')}>
              <dl className={clsx('flex items-baseline gap-x-1', 'md:gap-x-3')}>
                <dt className="font-bold">대표</dt>
                <dd className="">李智優</dd>
              </dl>
              <dl className={clsx('flex items-baseline gap-x-1', 'md:gap-x-3')}>
                <dt className="font-bold">사업자등록번호</dt>
                <dd className="">129-88-02423</dd>
              </dl>
            </div>
          </div>
          <div className={clsx('space-y-1', 'md:flex md:gap-3 md:space-y-0')}>
            <p>
              <b>Copyright © 주식회사 아웃스탠더스.</b> All rights reserved.
            </p>
          </div>
        </div>

        <div className={clsx('absolute top-3 right-3 flex-center gap-2', 'md:right-0')}>
          <BaseLink
            href="https://www.youtube.com/channel/UCs6Gm2QwhwLAg_IZnKqsKvg/featured"
            target="_blank"
            aria-label="bagstrap youtube"
          >
            <YoutubeIcon />
          </BaseLink>
          <BaseLink
            href="https://www.instagram.com/bagstrap_official/"
            target="_blank"
            aria-label="bagstrap instagram"
          >
            <InstagramIcon />
          </BaseLink>
        </div>
      </div>
    </section>
  );
}

export default memo(Footer);
