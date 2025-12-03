import { StaticImageData } from 'next/image';
import YoutubeIcon from "src/assets/icons/common/YoutubeIcon.svg"
import Youtube_5 from 'public/assets/[youtube]thumbnail_ep05.jpg';
import Youtube_7 from 'public/assets/[youtube]thumbnail_ep07.png';
import Youtube_8 from 'public/assets/[youtube]thumbnail_ep08.png';
import Youtube_10 from 'public/assets/[youtube]thumbnail_ep10.jpg';
import Image from "next/image"
import SectionHeaderMobile from './SectionHeaderMobile';
import { getYoutubeThumbnail } from 'src/utils/getYoutubeThumbnail';
import { SectionHeader } from '@components/careers/CareerSection.style';

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


export const YoutubeSectionMobile = ({ youtubeList }: { youtubeList: GetYoutubeUrlsResponse | undefined }) => {
  return (
    <div className='flex flex-col justify-center items-center pl-[20px] space-y-4 max-w-[550px] mx-auto'>
      <div className='flex w-full mr-[20px]'>
        <SectionHeaderMobile icon={YoutubeIcon} content={'가방끈 유튜브 채널'} navigateText='전체보기' onClick={() => window.open("https://www.youtube.com/channel/UCs6Gm2QwhwLAg_IZnKqsKvg/featured", "_blank")} />
      </div>
      <div className='flex overflow-x-auto w-full no-scrollbar max-w-[550px] mx-auto justify-center items-center'>
        <div className='flex gap-4 w-full mx-auto max-w-[550px]'>
          {youtubeList?.map((link, idx) => (
            <a
              key={idx}
              href={link}
              target='_blank'
              rel='noreferrer noopener'
              className="flex-none w-[280px]"
            >
              <div className='w-full h-[152px] rounded-[16px] overflow-hidden relative'>
                <Image
                  src={getYoutubeThumbnail(link)}
                  alt={`youtube thumbnail ${idx}`}
                  fill
                  className="object-cover" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>

  );
};
