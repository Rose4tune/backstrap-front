import { useMediaQuery } from '@mui/material';
import Image from 'next/image';

interface BottomBannerProps {
  imageUrl: string;
  clickLink: string;
}
export default function BottomBanner(props: BottomBannerProps) {
  const { imageUrl, clickLink } = props
  const isMobile = useMediaQuery('(max-width:550px)');
  const screenWidth = window.innerWidth;
  return (
    <a href={clickLink} target="_blank" rel="noopener noreferrer">
      <div
        className={`mx-auto ${!isMobile ? 'rounded-[16px]' : ''} overflow-hidden`}
        style={{ marginTop: '28px' }}
      >
        {isMobile ? (
          <Image
            src={imageUrl as string}
            alt="바텀배너"
            width={screenWidth}
            height={116}
            className="object-cover max-w-[550px] mx-auto"
            priority />
        ) : (
          <Image
            src={imageUrl as string}
            alt="바텀배너"
            width={1920}
            height={116}
            className='min-w-[1440px]'
          />
        )}
      </div>
    </a>
  );
}
