import { useEffect } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import { SectionHeader } from '../SectionHeader/SectionHeader';
import { ScrollBox } from '../ScrollBox/ScrollBox';
import useAuthPayload from '@hooks/useAuthPayload.hook';
import { RecruitSectionCard } from './components/RecruitSectionCard';
import careerStore from '@stores/career.store';
import ThumbnailCard from '@components/careers/ThumbnailCard';

export const RecruitSection = observer(() => {
  const authPayload = useAuthPayload();

  const recruitments = toJS(careerStore.recruitmentListData?.data || []).slice(0, 8);

  const fetchData = async (token = authPayload?.access_token) => {
    try {
      careerStore.postRecruitmentList(
        {
          paginationRequestDto: {
            cursor: null,
            count: 8
          },
          sort: 'UPLOAD'
        },
        token
      );
    } catch (error) {
      console.error('데이터 가져오기 실패:', error);
    }
  };

  useEffect(() => {
    fetchData(authPayload?.access_token);
  }, [authPayload]);

  return (
    <Box mt={'28px'}>
      <SectionHeader
        title={'석박사 채용끈'}
        content={'요즘 핫한 채용공고를 확인하세요!'}
        hrefTitle={'더 많은 공고 보기'}
        href={'/careers'}
      />
      <ScrollBox>
        <Box display={'flex'} mt={'16px'} pl={'4px'} pb={'16px'} gap={'12px'}>
          {recruitments?.map(recruitment => (
            <Box key={recruitment.uuid} width={'260px'} flexShrink={'0'}>
              <ThumbnailCard data={recruitment} defaultColor="grey" />
            </Box>
          ))}
        </Box>
      </ScrollBox>
    </Box>
  );
});
