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
type GetBoardGroupAllResponse = components['schemas']['FAGroupViewDto'][];

const Community = () => {
  const isMobile = useMediaQuery('(max-width:550px)');
  const [groups, setGroups] = useState<GetBoardGroupAllResponse>([]);
  const NO_RENDER_GROUPS = ['HOT', 'HONOR', 'ADMIN', 'FREE', 'ADMIN', 'SECRET', 'AD'];
  useEffect(() => {
    async function get() {
      const response = await getBoardGroupAll();
      if(response.success && response.data) {
        setGroups(response.data.filter(group=>{
          let render=true;
          if(group.code === undefined) {
          }
          if(group.code!==undefined) {
            render = !NO_RENDER_GROUPS.includes(group.code);
          }
          return render;
      }));
      }
    }
    try{
      get()
    } catch {
    }
  }, []);

  if(isMobile) return (
    <PageLayout postEditPopup={true}>
      <CommunityPageLayout>
        <TopBanner/>
        <Best/>
        <div className='w-full h-3 bg-gray-20'></div>
        <CommunityNavigatorMobile/>
      </CommunityPageLayout>
    </PageLayout>
  )
  else return (
    <PageLayout>
    <PostPageLayout>
        <PostEditPopup/>
        <div className='w-full flex flex-row gap-x-6 lg:gap-x-10 xl:gap-x-12 2xl:gap-x-16 justify-center mx-auto min-w-[1014px] px-4'>
            {/* Main content area - responsive width */}
          <div className='flex flex-col max-w-[940px] gap-y-8 w-full min-w-[574px]'>
            <div className='flex flex-wrap flex-row gap-y-5 min-w-[721px]'>
              {/* {(faGroupsData?.FAGroups?.map((group)=><div>{group?.name}:{group?.code}<br></br></div>))} */}
              <div className='w-1/2 min-w-[360px]'>
                <Best/>
              </div>
              <div className='w-1/2 min-w-[360px]'>
                <Notice title='끈지기 공지' uuid='qohnwionlr'/>
              </div>
              <div className='w-1/2 min-w-[360px]'>
                <Popular title='가장 핫한 인기글'/>
              </div>
              <div className='w-1/2 min-w-[360px]'>
                <TopReviewCount title='최근 댓글이 많이 달린 글'/>
              </div>
              <Recent/>
              {groups.map((group, i)=> {
                if(group) return (
                  <div className='w-1/2 min-w-[360px]' key={i}>
                    <Category commentCount={group.code==='LAB'?false:true} uuid={group.uuid||''} title={group.name||''} iconUrl={group.iconUrl}/>
                  </div>
              )})}
            </div>
          </div>
            {/* Sidebar - responsive width */}
          <div className='max-w-[260px] w-full lg:max-w-[280px] 4xl:max-w-[356px]'>
              <SideSection isHome={true}/>
          </div>
        </div>
    </PostPageLayout>
    </PageLayout>
  );
};

export default Community;
