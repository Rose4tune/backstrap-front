import { observer } from "mobx-react";
import LogoIcon from "src/assets/icons/header/logo.svg"
import SearchIcon from "src/assets/icons/common/SearchIcon.svg"
import BellIcon from "src/assets/icons/mentoring/[renewal]bellIcon.svg"
import PersonIcon from "src/assets/icons/header/person.svg"
import { useRouter } from "next/router";
import useAuthGuardModalDialog from "@hooks/bagstrap/user/useAuthGuardModalDialog.hook";
import { useStore } from "@stores/useStore.hook";

function MobileHomeHeader() {
    const router = useRouter()
    const [AuthModalComponent, openAuthModal] = useAuthGuardModalDialog();
    const { UserStore } = useStore()
    const accessToken = UserStore.getAccessTokenFromCookies()
    console.log('accesstoken:', accessToken)

    /**search icon 클릭 */
    function handleSearch() {
        accessToken ? router.push('/search') : openAuthModal()
    }

    /**Alarm icon 클릭 */
    function handleAlarm() {
        accessToken ? router.push('/my/alarm/notification') : openAuthModal()
    }

    /**MyInfo icon 클릭 */
    function handleMy() {
        accessToken ? router.push('/my/profile') : openAuthModal()
    }

    return (
        <div className="max-w-[550px] px-[20px] pb-[20px] pt-[53px] max-w-[550px] w-full flex justify-between">
            <div className="flex gap-2 cursor-pointer" onClick={() => router.push('/')}>
                <LogoIcon width={34} height={26} />
                <span className="text-bold-18 text-gray-90">가방끈</span>
            </div>
            <div className="flex gap-5">
                <SearchIcon width={24} height={24} className="text-gray-50 cursor-pointer" onClick={handleSearch} />
                <BellIcon width={24} height={24} className="text-gray-50 cursor-pointer" onClick={handleAlarm} />
                <PersonIcon width={24} height={24} className="text-gray-50 cursor-pointer" onClick={handleMy} />
            </div>
            {AuthModalComponent}
        </div>
    )
}

export default observer(MobileHomeHeader)