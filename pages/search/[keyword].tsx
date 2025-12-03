import getBoardsByPaging from "@api/community/getBoardsByPaging";
import CommunityPageLayout from "@layouts/CommunityPageLayout";
import PageLayout from "@layouts/PageLayout";
import { useMediaQuery } from "@mui/material";
import { useRouter } from "next/router"
import { act, useEffect, useState } from "react";
import { ArticleGrid } from "src/components/article";
import { MainList } from "src/components/community";
import { RecruitmentGrid, RecruitmentMobile } from "src/components/recruitment";
import SearchHeaderMobile from "./SearchHeader.mobile";
import { CategoryMobile } from "src/components/mobile/community";

// Tab Navigation Component (not used, just implemented)
interface TabNavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  sortOrder?: string;
  onSortChange?: (sort: string) => void;
}

function TabNavigation({ activeTab = '커뮤니티', onTabChange, sortOrder = '최신순', onSortChange }: TabNavigationProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const tabs = ['커뮤니티', '채용'];
  const sortOptions = ['최신순', '인기순', '추천순'];

  return (
    <div className="flex flex-col w-full">
      {/* Tab Headers */}
      <div className="flex px-6 pt-6 flex-row items-center justify-between w-full">
        <div className="flex flex-row gap-x-5">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange?.(tab)}
              className={`border-b-2 transition-colors pb-1 ${
                activeTab === tab
                  ? 'text-gray-90 text-bold-14 border-gray-90'
                  : 'text-gray-60 text-semibold-14 border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          {/* <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex flex-row items-center gap-2 px-3 py-2 text-med-14 text-gray-70 hover:text-gray-90 transition-colors"
          >
            <span>{sortOrder}</span>
            <svg
              className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button> */}

          {/* Dropdown Menu */}
          {/* {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-30 rounded-lg shadow-lg z-10 min-w-[100px]">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onSortChange?.(option);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-med-14 hover:bg-gray-20 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    sortOrder === option ? 'text-normal bg-bagstrap-10' : 'text-gray-70'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default function SearchWithKeywordPage() {
    const router = useRouter();
    const isMobile = useMediaQuery('(max-width:550px)');
    const { keyword } = router.query;
    const [postCount, setPostCount] = useState<number>(0);
    const [activeTab, setActiveTab] = useState<string>('커뮤니티');
    useEffect(()=>{
    },[])
    if(typeof keyword === 'string' && router.isReady) {
        if(isMobile) return (
            <PageLayout mobileTab={false} mobileSimple={false} key={keyword}>
                <CommunityPageLayout>
                    <SearchHeaderMobile existValue={keyword}/>
                    <TabNavigation activeTab={activeTab} onTabChange={setActiveTab}/>
                    { activeTab === '커뮤니티' &&
                        <CategoryMobile
                            searchKeyword={keyword}
                        />
                    }
                    { activeTab === '채용' &&
                        <RecruitmentMobile searchKeyword={keyword}/>
                    }
                </CommunityPageLayout>
            </PageLayout>
        )
        return (
            <PageLayout key={keyword}>
                <CommunityPageLayout>
                    <div className="flex flex-col gap-y-[60px] py-[60px]">
                        <div className="">
                            <div className="flex flex-row gap-x-2 items-baseline">
                                <div className="text-bold-24 text-black">커뮤니티</div>
                                <div className="text-med-20 text-gray-70">{postCount}건</div>
                            </div>
                            <MainList
                                pageSize={10}
                                keyword={keyword}
                                onFetch={setPostCount}
                                showTitle={false}
                            />
                        </div>
                        {/* <div className="">
                            <div className="flex flex-row gap-x-2 items-baseline">
                                <div className="text-bold-24 text-black">커뮤니티</div>
                                <div className="text-med-20 text-gray-70">{postCount}건</div>
                            </div>
                            <ArticleGrid pageSize={12} />
                        </div> */}
                         <RecruitmentGrid
                            pageSize={1000}
                            showTitle={true}
                            title="채용"
                            maxRows={1}
                            keyword={keyword}
                        />
                    </div>
                </CommunityPageLayout>
            </PageLayout>
        )
    }
    else return (
        <></>
    )
}