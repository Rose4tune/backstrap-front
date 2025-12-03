import React, { useEffect, useState } from 'react';
import PageLayout from '@layouts/PageLayout';
import CommunityPageLayout from '@layouts/CommunityPageLayout';
import Recent from 'src/components/community/box/Recent';
import Best from 'src/components/community/box/Best';
import getBoardGroupAll from 'src/apis/community/getBoardGroupAll';
import { Category } from 'src/components/community/box/Category';
import Notice from 'src/components/community/box/Notice';
import CommentDelete from 'src/components/community/popup/CommentDelete';
import { useMediaQuery } from '@mui/material';
import CommunityNavigatorMobile from 'src/components/mobile/community/CommunityNavigator.mobile';
import { TopBanner } from 'src/components/mobile/community';
import { components } from 'src/types/api';
import Popular from 'src/components/community/box/Popular';
import TopReviewCount from 'src/components/community/box/TopReviewCount';
import BottomTab from 'src/components/mobile/BottomTab';
import PostEditPopup from 'src/components/community/PostEditPopup';
import PostPageLayout from '@layouts/PostPageLayout';
import SideSection from './post/SideSection';
import { MainList } from 'src/components/community';
import { useSearchParams } from 'next/navigation';
import GlobalHeader from 'src/components/header/GlobalHeader';
import Footer from 'elements/Footer';
type GetBoardGroupAllResponse = components['schemas']['FAGroupViewDto'][];

const Community = () => {
  const isMobile = useMediaQuery('(max-width:550px)');
  const [groups, setGroups] = useState<GetBoardGroupAllResponse>([]);
  const NO_RENDER_GROUPS = ['HOT', 'HONOR', 'ADMIN', 'FREE', 'ADMIN', 'SECRET', 'AD'];
  const initialPage = useSearchParams().get('page');
  useEffect(() => {
    async function get() {
      const response = await getBoardGroupAll();
      if (response.success && response.data) {
        setGroups(response.data.filter(group => {
          let render = true;
          if (group.code === undefined) {
          }
          if (group.code !== undefined) {
            render = !NO_RENDER_GROUPS.includes(group.code);
          }
          return render;
        }));
      }
    }
    try {
      get()
    } catch {
    }
  }, []);

  if (isMobile) return (
    <PageLayout postEditPopup={true}>
      <CommunityPageLayout>
        <TopBanner />
        <Best />
        <div className='w-full h-3 bg-gray-20'></div>
        <CommunityNavigatorMobile />
      </CommunityPageLayout>
      <PostEditPopup />
    </PageLayout>
  )
  else return (
    <div className="flex flex-col min-w-[1280px] max-w-[1920px] mx-auto">
      <GlobalHeader />
      <PostPageLayout>
        <PostEditPopup />
        <div className='w-full flex flex-row gap-x-6 lg:gap-x-10 xl:gap-x-12 2xl:gap-x-16 justify-center mx-auto px-4 min-w-[1020px]'>
          {/* Main content area - responsive width */}
          <div className='flex flex-col gap-y-8 w-full min-w-[574px]'>
            {/* Top section - Best and Notice */}
            <div className="flex flex-row gap-x-4 w-full min-w-[608px]">
              <div className='w-1/2 min-w-[287px]'>
                <Best />
              </div>
              <div className='w-1/2 min-w-[287px]'>
                <Notice title='끈지기 공지' uuid='qohnwionlr' />
              </div>
            </div>
            {/* Main list */}
            <MainList
              title={'따끈따끈 막 나온 끈'}
              pageSize={20}
              showWriteButton={true}
              initialPage={Number(initialPage) || 1}
            />
          </div>
          {/* Sidebar - responsive width */}
          <div className='max-w-[260px] w-full lg:max-w-[280px] 4xl:max-w-[356px]'>
            <SideSection />
          </div>
        </div>
      </PostPageLayout>
      <Footer />
    </div>
  );
};

export default Community;