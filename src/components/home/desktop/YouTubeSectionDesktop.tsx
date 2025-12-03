import React, { useState, useRef, useEffect } from 'react';
import SectionHeaderDesktop from './SectionHeaderDesktop';
import { StaticImageData } from 'next/image';
import YoutubeIcon from "src/assets/icons/common/YoutubeIcon.svg"
import Youtube_5 from 'public/assets/[youtube]thumbnail_ep05.jpg';
import Youtube_7 from 'public/assets/[youtube]thumbnail_ep07.png';
import Youtube_8 from 'public/assets/[youtube]thumbnail_ep08.png';
import Youtube_10 from 'public/assets/[youtube]thumbnail_ep10.jpg';
import Image from "next/image"
import { getYoutubeThumbnail } from 'src/utils/getYoutubeThumbnail';

interface Video {
  key: string;
  thumbnailAsset: StaticImageData;
  linkUrl: string;
}
const VIDEOS: Video[] = [
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

type GetYoutubeUrlsResponse = string[] | null;

export const YoutubeSectionDesktop = ({ youtubeList }: { youtubeList: GetYoutubeUrlsResponse | undefined }) => {  
  // Scroll state management
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Update scroll button visibility
  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1); // -1 for precision
    }
  };

  // Handle scroll navigation
  const scrollLeft = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Initialize scroll state and add event listeners
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    // Initial state
    updateScrollButtons();

    // Add scroll event listener
    scrollContainer.addEventListener('scroll', updateScrollButtons);
    
    // Add resize listener to handle window size changes
    window.addEventListener('resize', updateScrollButtons);

    return () => {
      scrollContainer.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [youtubeList]);

  return (
    <div className='flex flex-col w-full space-y-5'>
      <SectionHeaderDesktop 
        icon={YoutubeIcon} 
        content={'가방끈 유튜브 채널'} 
        navigateText='전체보기' 
        onClick={() => window.open("https://www.youtube.com/channel/UCs6Gm2QwhwLAg_IZnKqsKvg/featured", "_blank")}
      />
      
      {/* Scroll container with navigation arrows */}
      <div className='relative'>
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className='absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105'
            aria-label='이전 동영상들 보기'
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-700">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className='absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105'
            aria-label='다음 동영상들 보기'
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-700">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* Scrollable content */}
        <div 
          ref={scrollRef}
          className='flex w-full gap-4 overflow-x-scroll scrollbar-hide'
          style={{ scrollbarWidth: 'none' }}
        >
          {youtubeList?.map((link, idx) => {
            return (
              <a key={idx} href={link} target='_blank' rel='noreferrer noopener'>
                <div className='w-[308px] h-[172px] rounded-[16px] overflow-hidden relative flex-shrink-0'>
                  <Image
                    src={getYoutubeThumbnail(link)}
                    alt={`[youtube thumbnail ${idx}]`}
                    height={172}
                    width={308}
                    className='w-[308px] h-[172px] object-cover'
                  />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
