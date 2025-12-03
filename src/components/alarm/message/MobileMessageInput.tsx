import registerUserMessageNew from "@api/user-message/registerUserMessageNew";
import { useStore } from "@stores/useStore.hook";
import { observer } from "mobx-react";
import React, { useState } from "react";
import SendIcon from "src/assets/icons/common/SendIcon.svg";

interface Props {
  roomUuid?: string;
  isOut?: boolean;
  setReloadToken: React.Dispatch<React.SetStateAction<number>>
}

const MobileMessageInput: React.FC<Props> = ({ roomUuid, isOut, setReloadToken }) => {
  const [message, setMessage] = useState("");
  const { UserStore } = useStore();
  const accessToken = UserStore.getAccessTokenFromCookies();

  // 클릭/엔터 모두 이 함수 하나로 처리
const handleSend = async (
    e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>
  ) => {
    // 키보드 이벤트인 경우: Enter만 처리, IME 조합 중이면 무시
    if ("key" in e) {
      if (e.nativeEvent?.isComposing) return;
      if (e.key !== "Enter") return;
    }
    e.preventDefault();
    e.stopPropagation();

    if (!message) return;

    try {
      const res = await registerUserMessageNew({ message: message, parentEntityType: "ROOM", parentEntityUuid: roomUuid! }, accessToken)
      if (res && res.success) {
        //전송 성공 시 reloadToken 변경
        setReloadToken(prev => prev + 1);
        setMessage("");

      }
    } catch (error) {
      console.error(error); 
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white px-5 pb-8 pt-3 flex items-center">
      {isOut ?
        <div className="w-full bg-gray-40 flex justify-center items-center rounded-[12px] py-3">
          <span className="text-med-14 text-gray-70">상대방에게 메시지를 보낼 수 없습니다</span>
        </div> :
        <div className="w-full bg-gray-20 flex justify-between items-center rounded-[12px]">
          <input
            type="text"
            className="flex-1 text-med-14 pl-5 pr-2 py-3 bg-gray-20 rounded-[12px]"
            placeholder="메시지를 입력해주세요"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleSend}
          />
          <button
            type="button"
            onClick={handleSend}
            className="h-[46px] w-[46px] flex justify-center items-center disabled:opacity-40"
            disabled={!message.trim()}
            aria-label="메시지 전송"
          >
            <SendIcon width={20} height={20} className="text-gray-50" />
          </button>
        </div>
      }
    </div>
  );
};

export default observer(MobileMessageInput);