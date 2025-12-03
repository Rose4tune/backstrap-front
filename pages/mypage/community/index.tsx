import MyLayout from "@layouts/MyLayout";
import { MainList } from "src/components/community";
import SearchBar from "src/components/header/SearchBar";

const MyPageCommunityPage = () => {
    return (
        <MyLayout>
            <div className="flex flex-col gap-y-5">
                <div className="text-bold-36 leading-[44px] text-gray-90">커뮤니티 활동</div>
                <SearchBar href="/mypage/community"/>
                <MainList title="커뮤니티 글" pageSize={10}/>
            </div>
        </MyLayout>
    )
}
export default MyPageCommunityPage;