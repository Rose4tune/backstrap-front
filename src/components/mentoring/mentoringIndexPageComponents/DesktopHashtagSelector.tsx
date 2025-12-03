import mixpanel from 'mixpanel-browser';
import { Dispatch, SetStateAction } from 'react';
import { HASHTAG, HASHTAGS_LIST } from 'src/types/mentorHashtag';

interface DesktopHashtagSelectorProps {
  hashtagSelected: HASHTAG;
  setHashtagSelected: Dispatch<SetStateAction<HASHTAG>>;
}

export default function DesktopHashtagSelector({
  hashtagSelected,
  setHashtagSelected
}: DesktopHashtagSelectorProps) {
  //믹스패널 액션 맵
  const actionMap: Record<HASHTAG, string> = {
    '#유학': 'click_filter_abr',
    '#인공지능': 'click_filter_ai',
    '#재료': 'click_filter_res',
    '#데이터사이언스': 'click_filter_data',
    '#영문교정/컨설팅': 'click_filter_com',
    '#삼성전자': 'click_filter_sam',
    '#연세대': 'click_filter_ys',
    전체: 'click_filter_whole'
  };
  return (
    <div className="flex justify-center gap-[20px] w-full text-center px-[20px] overflow-x-auto whitespace-nowrap scroll-smooth no-scrollbar mb-[28px]">
      {HASHTAGS_LIST.map((v, idx) => (
        <div
          key={v + idx}
          className={`pb-[4px] ${hashtagSelected === v ? 'border-b-[2px] border-gray-90 text-bold-20 text-gray-90' : 'text-med-20 text-gray-50'}`}
        >
          <button
            onClick={() => {
              if (hashtagSelected === v) return;
              setHashtagSelected(v);
              const action = actionMap[v as HASHTAG];
              if (action) {
                mixpanel.track(action, { view: 'mentoring' });
              }
            }}
          >
            {v}
          </button>
        </div>
      ))}
    </div>
  );
}
