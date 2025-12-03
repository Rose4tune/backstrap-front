import shuffle from 'lodash/shuffle';
import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import YoutubeIcon from '@public/icons/[home]youtube.svg';
import ChevronRightIcon from '@public/icons/[home]chevron-right.svg';
import BaseLink from '@common/BaseLink';

import BagstrapLogo from 'public/images/bagstrapprof.png';
import Youtube_5 from 'public/assets/[youtube]thumbnail_ep05.jpg';
import Youtube_7 from 'public/assets/[youtube]thumbnail_ep07.png';
import Youtube_8 from 'public/assets/[youtube]thumbnail_ep08.png';
import Youtube_10 from 'public/assets/[youtube]thumbnail_ep10.jpg';
import Youtube_12 from 'public/assets/[youtube]thumbnail_ep12.jpg';
import { Link, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import ArrowRightIcon from '@public/icons/arrow-right.svg';
export interface YoutubeChannelOverviewSectionProps extends BaseProps {
  vertical?: boolean;
}
interface Video {
  key: string;
  thumbnailAsset: StaticImageData;
  linkUrl: string;
}
const VIDEOS: Video[] = [
  // {
  //   key: "EP01",
  //   thumbnailAsset: Youtube_1,
  //   linkUrl: "https://www.youtube.com/watch?v=QXc0Agfw2zQ",
  // },
  {
    key: 'EP12',
    thumbnailAsset: Youtube_12,
    linkUrl: 'https://www.youtube.com/watch?v=01w6MIZpxzA'
  },
  {
    key: 'EP10',
    thumbnailAsset: Youtube_10,
    linkUrl: 'https://www.youtube.com/watch?v=Ei9r4pHlVfg&t=241s'
  },
  {
    key: 'EP08',
    thumbnailAsset: Youtube_8,
    linkUrl: 'https://www.youtube.com/watch?v=ulshlrd-aAw&lc=UgxJfy6d6OIPEpft3Gp4AaABAg'
  },
  {
    key: 'EP05',
    thumbnailAsset: Youtube_5,
    linkUrl: 'https://www.youtube.com/watch?v=8b2w6kFVxtU'
  },
  {
    key: 'EP07',
    thumbnailAsset: Youtube_7,
    linkUrl: 'https://www.youtube.com/watch?v=0cxl8OTfjx4&t=151s'
  }
];

const YoutubeChannelOverviewSection = (
  props: YoutubeChannelOverviewSectionProps
): JSX.Element => {
  const { className } = props;
  const [selectedVideos, setSelectedVideos] = useState<Video[]>();

  useEffect(() => {
    // const randomVideos = shuffle(VIDEOS).slice(0, props.vertical ? 3 : 8);
    // setSelectedVideos(randomVideos);

    setSelectedVideos(VIDEOS.slice(0, props.vertical ? 3 : 8));
  }, []);

  const videoSkeleton = useMemo(
    () => (
      <>
        <div className="aspect-video w-full rounded-[13px] bg-slate-200" />
        <div className="aspect-video w-full rounded-[13px] bg-slate-200" />
        <div className="aspect-video w-full rounded-[13px] bg-slate-200" />
        <div className="aspect-video w-full rounded-[13px] bg-slate-200" />
        <div className="aspect-video w-full rounded-[13px] bg-slate-200" />
        <div className="aspect-video w-full rounded-[13px] bg-slate-200" />
      </>
    ),
    []
  );
  return (
    // <section className={clsx("h-fit", "space-y-2", className)}>
    //   <div className="flex-between border border-grey5 rounded-[15px] h-[52px] px-4">
    //     <div className="gap-2 flex-center text-grey5">
    //       <YoutubeIcon />
    //       <span className="text-base font-light">가방끈 유튜브 채널</span>
    //     </div>
    //     <BaseLink
    //       href="https://www.youtube.com/channel/UCs6Gm2QwhwLAg_IZnKqsKvg/featured"
    //       target="_blank"
    //       className="gap-2 flex-center"
    //     >
    //       <span className="font-bold text-point-red underline text-[11px]">
    //         채널방문
    //       </span>
    //       <Image
    //         src={BagstrapLogo}
    //         alt="bagstrap logo"
    //         width={25}
    //         height={25}
    //       />
    //     </BaseLink>
    //   </div>
    <>
      <div
        className={clsx(
          props.vertical
            ? 'flex flex-col gap-[12px]'
            : 'flex-between gap-[12px] w-[1600px]'
        )}
      >
        {selectedVideos
          ? selectedVideos.map(video => (
              <BaseLink
                key={video.key}
                href={video.linkUrl}
                target="_blank"
                className={clsx(
                  'group relative',
                  'flex-1 rounded-[13px] overflow-hidden'
                )}
              >
                <Image
                  className="w-full h-auto"
                  sizes="100vw"
                  src={video.thumbnailAsset}
                  alt={`youtube thumbnail ${video.key}`}
                  placeholder="blur"
                />
                <div
                  className={clsx(
                    'group-hover:visible group-hover:animate-fade-in invisible',
                    'flex-center gap-1.5',
                    'absolute inset-0 bg-primary-dark bg-opacity-90',
                    'text-white typo-body6 font-semibold'
                  )}
                >
                  영상 보러가기
                  <ChevronRightIcon />
                </div>
              </BaseLink>
            ))
          : videoSkeleton}
      </div>
    </>
    // </section>
  );
};

export default React.memo(YoutubeChannelOverviewSection);
