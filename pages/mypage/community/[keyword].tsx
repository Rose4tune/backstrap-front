import MyLayout from "@layouts/MyLayout";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { act, useState } from "react";
import { MainList } from "src/components/community";
import SearchBar from "src/components/header/SearchBar";
import { FilterTab, SortButton } from "src/components/mypage/community";
import { RecruitmentGrid } from "src/components/recruitment";
import RecruitmentPagination from "src/components/recruitment/RecruitmentPagination";

const MyPageCommunityPageWithKeyWord = () => {
    const router = useRouter();
    let { keyword } = router.query;
    if(typeof keyword !=='string') return <></>
    if(keyword==='*') keyword = '';
    const [sortType, setSortType] = useState<'RECENT'|'POPULAR'|'COMMENT'|'LIKE'>('RECENT');
    const actionType = useSearchParams().get('actionType') || 'SCRAPED';
    function routeActionType(action:any) {
        router.replace(`/mypage/community/*?actionType=${action}`);
    }
    return (
        <MyLayout>
            <div key={keyword+actionType} className="flex flex-col gap-y-5">
                <div className="text-bold-36 leading-[44px] text-gray-90">커뮤니티 활동</div>
                <FilterTab selectedValue={actionType} onSelect={routeActionType}/>
                <div className="flex flex-row justify-between pb-3">
                    <div className="w-[360px] h-[52px]">
                        <SearchBar href="/mypage/community" placeholder={'키워드 검색'} existValue={keyword} showPopup={false} preserveQuery={true}/>
                    </div>
                    <SortButton selectedValue={sortType} onSelect={setSortType}/>
                </div>
                <span className="text-bold-20 text-gray-90">커뮤니티 글</span>
                <div className="flex flex-col -mt-4 gap-y-4">
                    <MainList showTitle={false} pageSize={10} keyword={keyword} sortType={sortType}/>
                </div>
                <span className="text-bold-20 text-gray-90">채용 공고</span>
                <div className="flex flex-col gap-y-4">
                    <RecruitmentPagination showTitle={false}/>
                </div>
            </div>
        </MyLayout>
    )
}
export default MyPageCommunityPageWithKeyWord;