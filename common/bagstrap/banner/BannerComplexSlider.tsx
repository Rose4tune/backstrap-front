import clsx from 'clsx';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Slider, { Settings } from 'react-slick';
import Image from 'next/image';

import styles from './Banner.module.scss';

import { renderLineBreak } from '@utils/common/render.util';
import { resolveLinkPath } from '@utils/bagstrap/link.util';

import { BannerAction, BannerSummaryFragment } from '@generated/graphql';
import ArrowLeftIcon from 'src/assets/icons/common/[renewal]LeftArrowIcon.svg'
import ArrowRightIcon from 'src/assets/icons/common/[renewal]RightArrowIcon.svg'

import BaseButton from '@common/button/BaseButton';

import { BannerDirectionType } from '@enums/banner/banner.enum';
import { int32ToRGB } from '@utils/common/color.util';
import { IMAGE_DEFAULT_BLUR_DATA_URL } from '@constants/image.constant';
import { useStore } from '@stores/useStore.hook';
import { components } from 'src/types/api';
import { useMediaQuery } from '@mui/material';

type BannerResponse = components['schemas']['BannerViewDto'][];

export interface BannerComplexSliderProps extends BaseProps {
  banners: BannerResponse;
}

const BannerComplexSlider = (props: BannerComplexSliderProps): JSX.Element => {
  const { banners, className } = props;
  const isMobile = useMediaQuery('(max-width:550px)');
  const router = useRouter();
  const { MeStore } = useStore();

  const sliderRef = useRef<Slider>(null);
  const [currentIdx, setCurrentIdx] = useState(0);

  const banner = banners[currentIdx];

  const autoChangeCurrentSlide = useCallback(
    (_: number, nextSlide: number) => {
      setCurrentIdx(nextSlide);
    },
    [setCurrentIdx]
  );

  const onClickBanner = useCallback(() => {
    if (banner.action === BannerAction.InternalLink) {
      const linkPath = banner.actionValue && resolveLinkPath(banner.actionValue, MeStore);

      linkPath && router.push(linkPath);
    } else if (banner.action === BannerAction.ExternalLink) {
      banner.actionValue && window.open(banner.actionValue, '_blank');
    }
  }, [banner.action, banner.actionValue, MeStore, router]);

  const onClickBannerNavigator = useCallback(
    (direction: BannerDirectionType) => () =>
      direction == BannerDirectionType.prev
        ? sliderRef.current?.slickPrev()
        : sliderRef.current?.slickNext(),
    [sliderRef.current]
  );

  return (
    // container
    <div className={clsx('w-full h-full space-y-2 md:space-y-3', className)}>
      {/* content */}
      <div
        onClick={onClickBanner}
        className={`relative overflow-hidden cursor-pointer flex w-full h-full ${isMobile ? '' : 'rounded-[16px]'}`}
      >
        {/* left */}
        <div className={`w-full h-full ${isMobile ? '' : 'rounded-[16px]'}`}>
          {/* image(slide) */}
          <Slider
            ref={sliderRef}
            slidesToScroll={1}
            slidesToShow={1}
            centerMode
            centerPadding="0px"
            arrows={false}
            speed={300}
            infinite={true}
            autoplay={true}
            autoplaySpeed={3000}
            waitForAnimate={false}
            className={clsx(styles['banner-slider'], 'w-full h-full')}
            beforeChange={autoChangeCurrentSlide}
          >
            {banners.map((banner, index) => (
              <div
                key={banner.uuid || index}
                className={`relative w-full h-full ${isMobile ? '' : 'rounded-l-[16px]'} overflow-hidden`}
              >
                {banner.imageUrl && (
                  <Image
                    src={banner.imageUrl}
                    alt={`main banner ${banner.title}`}
                    className="absolute bottom-0 h-full left-1/2"
                    placeholder="blur"
                    blurDataURL={IMAGE_DEFAULT_BLUR_DATA_URL}
                    fill
                  />
                )}
              </div>
            ))}
          </Slider>
        </div>

        {/* right */}
        {/* <div className="relative w-1/2 h-full rounded-r-[28px]">
          {/* title & description(fade in & out) */}
        {banners.map((banner, index) => (
          <div
            key={banner.uuid || index}
            className={clsx(
              'absolute inset-0 p-9',
              'flex flex-col justify-between',
              index === currentIdx
                ? 'opacity-100 animate-fade-in'
                : 'opacity-0 animate-fade-out'
            )}
          >
          </div>
        ))}

        {/* navigator */}
        {!isMobile && <><div
          className={'absolute left-[10px] top-1/2 -translate-y-1/2 flex items-center'}
        >
          <BaseButton
            onClick={onClickBannerNavigator(BannerDirectionType.prev)}
            aria-label="prev slide"
          >
            <ArrowLeftIcon width={24} height={24} className="text-gray-50" aria-label="prev slide" />
          </BaseButton>
        </div><div
          className={'absolute right-[10px] top-1/2 -translate-y-1/2 flex items-center'}
        >
            <BaseButton
              onClick={onClickBannerNavigator(BannerDirectionType.next)}
              aria-label="next slide"
            >
              <ArrowRightIcon width={24} height={24} className="text-gray-50" aria-label="next slide" />
            </BaseButton>
          </div></>}


        {/* indicator */}
        {/* <div
          className={clsx(
            'absolute md:right-8 right-4 md:bottom-10 bottom-5',
            'flex-center md:h-[22px] md:min-w-[48px] md:px-2.5 h-[16px] min-w-[32px] px-1',
            'border-[1.5px] rounded-full',
            'md:text-[11px] text-[9px] font-bold leading-none'
          )}
          style={indicatorColorStyle}
        >
          <span style={indicatorCurrentColorStyle}>{currentIdx + 1}&nbsp;</span>
          <span className="opacity-50">/ {banners.length}</span>
        </div> */}

      </div>
    </div >
  );
};

export default BannerComplexSlider;
