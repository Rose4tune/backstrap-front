import readAllUserNotification from "@api/user-notification/readAllUserNotification";
import ErrorPopup from "@common/ErrorPopup";
import useAuthGuardModalDialog from "@hooks/bagstrap/user/useAuthGuardModalDialog.hook";
import { useStore } from "@stores/useStore.hook";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import { useState } from "react";
import LeftArrowIcon from 'src/assets/icons/common/[renewal]LeftArrowIcon.svg'


function MobileAlarmHeader({ isNotiPage }: { isNotiPage: boolean }) {
    const router = useRouter()
    const { UserStore } = useStore();
    const accessToken = UserStore.getAccessTokenFromCookies()
    const [modalDialogEl, openModalDialog] = useAuthGuardModalDialog();

    // ErrorPopup 상태
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function readAll() {
        if (!accessToken) {
            openModalDialog();
            return;
        }
        try {
            const res = await readAllUserNotification(accessToken)
            if (res.success) {
                router.reload();
            } else {
                setErrorMessage('모든 소식 확인 처리에 실패했습니다. 잠시 후 다시 시도해주세요.');
            }
        } catch (error) {
            setErrorMessage(`${error}, 잠시 후 다시 시도해주세요.`);
        }

    }

    return (
        <>
            <div className="relative flex px-[20px] pt-[53px] pb-[20px] justify-between">
                <button
                    onClick={() => router.push('/')}
                    className="flex w-[26px] h-[26px] justify-center items-center"
                >
                    <LeftArrowIcon width={20} height={20} className="text-gray-50" />
                </button>
                <span className="text-gray-90 text-semibold-16">알림</span>
                <div className="w-[26px] h-[26px]" />
                {isNotiPage && <div
                    onClick={() => readAll()}
                    className="flex py-1 items-center absolute right-5 text-gray-90 text-semibold-14">모든 소식 확인</div>}
            </div>
            {modalDialogEl}
            {isErrorPopupOpen && (
                <ErrorPopup
                    isOpen={isErrorPopupOpen}
                    setIsOpen={setIsErrorPopupOpen}
                    errorMessage={errorMessage}
                />
            )}
        </>

    )
}

export default observer(MobileAlarmHeader)