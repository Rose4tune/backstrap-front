import React, { useState } from "react";
import ForbiddenIcon from "src/assets/icons/common/ForbiddenIcon.svg";
import WarningIcon from "src/assets/icons/common/WarningIcon.svg";
import DeleteIcon from "src/assets/icons/common/DeleteIcon.svg";
import MobileMessageActionPopup from "./MobileMessageActionPopup";
import registerUserReport from "@api/community/registerUserReport";
import { useStore } from "@stores/useStore.hook";
import registerBlockInteraction from "@api/user-interaction/registerBlockInteraction";
import deleteRoom from "@api/user-message-room/deleteRoom";

interface Props {
    onClose: () => void;
    isReportedByMe?: boolean;
    isOut?: boolean;
    partnerUuid: string;
    roomUuid: string;
}

const MobileMessageModal: React.FC<Props> = ({ onClose, isReportedByMe, isOut, partnerUuid, roomUuid }) => {
    const [popupType, setPopupType] = useState<'report' | 'block' | 'exit' | null>(null);
    const { UserStore } = useStore();
    const accessToken = UserStore.getAccessTokenFromCookies();

    /**popup type에 따른 action 호출 */
    async function confirmAction() {

        if (popupType === 'exit') {
            try {
                const res = deleteRoom(roomUuid, accessToken)
            } catch (e) {
                console.error('대화방 나가기 실패:', e);
            }
        } else if (popupType === 'report') {
            try {
                const res = await registerUserReport({
                    "parentEntityType": "ROOM",
                    "parentEntityUuid": roomUuid,
                    "reportedUuid": partnerUuid,
                    "userReportType": "ABUSE"
                }, accessToken)
            } catch (e) {
                console.error('사용자 신고 실패:', e);
            }
        } else if (popupType === 'block') {
            try {
                const res = await registerBlockInteraction({
                    "parentEntityType": "ROOM",
                    "parentEntityUuid": roomUuid,
                    "targetEntityType": "ROOM",
                    "targetEntityUuid": roomUuid,
                }, accessToken)
            } catch (e) {
                console.error('사용자 차단 실패:', e);
            }
        }
        setPopupType(null);
        onClose();
    }

    return (
        <>
            {/* 배경 dim */}
            <div
                className="fixed inset-0 bg-dim z-40"
                onClick={onClose}
            ></div>

            {/* 모달 본체 */}
            <div className="fixed bottom-0 left-0 w-full bg-white rounded-t-2xl px-2 pt-6 pb-7 z-50">
                <div className="flex flex-col gap-3">
                    {!isOut && <button
                        className="flex items-center gap-3 hover:bg-gray-20 py-2 px-3 rounded-[8px]"
                        onClick={() => setPopupType('block')}
                    >
                        <ForbiddenIcon width={24} height={24} />
                        <span className="text-med-14 text-gray-90">사용자 차단</span>
                    </button>}
                    {!isOut && <button
                        className="flex gap-3 hover:bg-gray-20 py-2 px-3 rounded-[8px]"
                        onClick={() => setPopupType('report')}
                        disabled={isReportedByMe}
                    >
                        <WarningIcon width={24} height={24} />
                        <div className="flex flex-col">
                            <div className="text-med-14 text-gray-90 text-left">신고하기</div>
                            {isReportedByMe && <span className="text-gray-60 text-med-12">이미 신고한 사용자입니다</span>}
                        </div>

                    </button>
                    }
                    <button
                        className="flex items-center gap-3 hover:bg-gray-20 py-2 px-3 rounded-[8px]"
                        onClick={() => setPopupType('exit')}>
                        <DeleteIcon width={24} height={24} className="text-red" />
                        <span className="text-med-14 text-gray-90">대화방 나가기</span>
                    </button>
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center hover:bg-gray-20 py-2 px-3 rounded-[8px]">
                        <span className="text-med-14 text-gray-60">취소</span>
                    </button>
                </div>
                {popupType && (
                    <MobileMessageActionPopup
                        isOpen={true}
                        type={popupType}
                        onClose={() => setPopupType(null)}
                        onConfirm={confirmAction}
                    />
                )}
            </div>
        </>
    );
};

export default MobileMessageModal;
