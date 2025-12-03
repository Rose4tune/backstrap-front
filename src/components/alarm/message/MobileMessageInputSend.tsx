import registerUserMessageNew from "@api/user-message/registerUserMessageNew";
import { useStore } from "@stores/useStore.hook";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import SendIcon from "src/assets/icons/common/SendIcon.svg";

interface Props {
    uuid?: string;
    type?: any;
    isDesktop?: boolean;
}

const MobileMessageInputSend: React.FC<Props> = ({ uuid, type, isDesktop }) => {
    const { UserStore, HeaderStore } = useStore();   // ✅ 한 번에 불러오기
    const accessToken = UserStore.getAccessTokenFromCookies();
    const [message, setMessage] = useState<string>("");
    const [isSending, setIsSending] = useState(false);
    const router = useRouter();

    async function handleSend() {
        if (!message.trim() || isSending) return;

        try {
            setIsSending(true);

            const res = await registerUserMessageNew(
                {
                    entityStatus: "ACTIVE",
                    message: message,
                    parentEntityType: type || HeaderStore.type,
                    parentEntityUuid: uuid as string || HeaderStore.uuid,
                },
                accessToken
            );

            if (res.success && res.data) {
                setMessage("");

                // ✅ 방 리스트 리로드 트리거
                HeaderStore.bumpMessageRoomsReloadKey();

                if (!isDesktop) {
                    router.push(`/my/alarm/message/${res.data.roomUuid}`);
                } else {
                    HeaderStore.setIsMessageOpen(true);
                    HeaderStore.setIsSendMessageOpen(false);
                }
            }
        } catch (error) {
            console.error(error);
            alert("메시지 전송 중 오류가 발생했습니다.");
        } finally {
            setIsSending(false);
        }
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white px-5 pb-8 pt-3 flex items-center">
            <div className="w-full bg-gray-20 flex justify-between items-center rounded-[12px]">
                <input
                    type="text"
                    className="flex-1 text-med-14 pl-5 pr-2 py-3 bg-gray-20 rounded-[12px]"
                    placeholder="메시지를 입력해주세요"
                    value={message}
                    disabled={isSending}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        const nativeEvent = e.nativeEvent as KeyboardEvent;
                        if (
                            e.key === "Enter" &&
                            !nativeEvent.isComposing &&
                            !isSending &&
                            message.trim()
                        ) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />
                <button
                    type="button"
                    onClick={handleSend}
                    className="h-[46px] w-[46px] flex justify-center items-center disabled:opacity-40"
                    disabled={!message.trim() || isSending}
                    aria-label="메시지 전송"
                >
                    {isSending ? (
                        <div className="w-5 h-5 border border-gray-50 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <SendIcon width={20} height={20} className="text-gray-50" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default observer(MobileMessageInputSend);
