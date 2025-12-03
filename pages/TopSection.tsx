import BannerSection from '@common/bagstrap/banner/BannerSection';
import { useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import getBannersByType from 'src/apis/banner/getBannersByType';
import { components } from 'src/types/api';

type BannerResponse = components['schemas']['BannerViewDto'][];

interface TopSectionProps {
  bigBanners?: BannerResponse | null;
  smallBanners?: BannerResponse | null;
}

const TopSection = ({ bigBanners, smallBanners }: TopSectionProps) => {
  const isMobile = useMediaQuery('(max-width:550px)');

  return (
    !isMobile ? (
      <div className='flex gap-5 w-full max-w-[1920px] mx-auto'>
        {/* Big banner - maintains 856:267 aspect ratio */}
        <div className='flex-1 aspect-[856/267] min-w-0'>
          <BannerSection
            banners={bigBanners}
          />
        </div>
        {/* Small banner - maintains 406:267 aspect ratio */}
        <div className='w-[32%] aspect-[406/267] flex-shrink-0'>
          <BannerSection
            banners={smallBanners}
          />
        </div>
      </div>
    ) : (
      <div className='aspect-[375/116] w-full max-w-[550px] mx-auto'>
        <BannerSection banners={bigBanners} />
      </div>
    )
  )
}

export default TopSection;
