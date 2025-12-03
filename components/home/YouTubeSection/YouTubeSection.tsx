import Box from '@mui/material/Box';
import { SectionHeader } from '../SectionHeader/SectionHeader';
import { ScrollBox } from '../ScrollBox/ScrollBox';
import YoutubeChannelOverviewSection from '@common/bagstrap/etc/YoutubeChannelOverviewSection';

export const YoutubeSection = () => {
  return (
    <Box mt={'28px'}>
      <SectionHeader
        title={'가방끈 유튜브 채널'}
        content={'유익하고 새로운 가방끈의 새소식 놓치지 마세요!'}
        hrefTitle={'가방끈 채널 바로가기'}
        href={'https://www.youtube.com/channel/UCs6Gm2QwhwLAg_IZnKqsKvg/featured'}
      />

      <ScrollBox>
        <Box mt={'16px'} width={1800} pb={'16px'}>
          <YoutubeChannelOverviewSection />
        </Box>
      </ScrollBox>
    </Box>
  );
};
