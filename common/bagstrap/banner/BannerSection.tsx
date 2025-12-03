import clsx from 'clsx';
import { useMemo } from 'react';
import { Skeleton } from '@mui/material';

import { isNotNil } from '@utils/common/base.util';

import { BannerSummaryFragment, useBannersQuery } from '@generated/graphql';

import BannerComplexSlider from './BannerComplexSlider';
import { components } from 'src/types/api';
type BannerResponse = components['schemas']['BannerViewDto'][];

export interface BannerSectionProps extends BaseProps {
  banners?: BannerResponse | null;
}

const BannerSection = (props: BannerSectionProps): JSX.Element => {
  const { className } = props;

  const bannersQueryResult = useBannersQuery({
    skip: !!props.banners
  });

  const banners = useMemo(
    () => props.banners ?? bannersQueryResult.data?.banners.filter(isNotNil),
    [props.banners, bannersQueryResult.data?.banners]
  );

  return (
    <div className="w-full h-full">
      {!bannersQueryResult.loading && banners && banners.length > 0 ? (
        <BannerComplexSlider banners={banners as BannerResponse} />
      ) : (
        // @mui Skeleton 사용
        <Skeleton variant="rectangular" height="100%" width="100%" />
      )}
    </div>
  );
};

export default BannerSection;
