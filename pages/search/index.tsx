import CommunityPageLayout from "@layouts/CommunityPageLayout";
import PageLayout from "@layouts/PageLayout";
import SearchHeaderMobile from "./SearchHeader.mobile";

export default function SearchPage() {
    return (
        <PageLayout mobileTab={false} mobileSimple={false}>
            <CommunityPageLayout>
                <SearchHeaderMobile showSearchPopup={true}/>
            </CommunityPageLayout>
        </PageLayout>
    )
}