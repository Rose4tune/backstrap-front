import React from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react";

interface Props {
  alarmCount?: number;
  messageCount?: number;
}

function MobileAlarmNavigator({ alarmCount = 0, messageCount = 0 }: Props) {
  const router = useRouter();
  const currentPath = router.pathname;

  // 현재 탭 구분
  const isMessageTab = currentPath.includes("/my/alarm/message");
  const isNotificationTab = currentPath.includes("/my/alarm/notification");

  const handleNavigate = (type: "message" | "notification") => {
    if (type === "message") router.push("/my/alarm/message");
    else router.push("/my/alarm/notification");
  };

  return (
    <div className="flex w-full border-b border-gray-200 bg-white">
      {/* 새소식 탭 */}
      <div
        onClick={() => handleNavigate("notification")}
        className={`flex-1 flex justify-center items-center py-3 relative cursor-pointer ${
          isNotificationTab ? "text-black text-semibold-16" : "text-gray-50"
        }`}
      >
        새소식
        {alarmCount > 0 && (
          <span
            className={`ml-1 text-semibold-16 ${
              isNotificationTab ? "text-normal" : "text-gray-50"
            }`}
          >
            {alarmCount}
          </span>
        )}
        {isNotificationTab && (
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>
        )}
      </div>

      {/* 쪽지 탭 */}
      <div
        onClick={() => handleNavigate("message")}
        className={`flex-1 flex justify-center items-center py-3 relative cursor-pointer ${
          isMessageTab ? "text-black text-semibold-16" : "text-gray-50"
        }`}
      >
        쪽지
        {messageCount > 0 && (
          <span
            className={`ml-1 text-semibold-16 ${
              isMessageTab ? "text-normal" : "text-gray-50"
            }`}
          >
            {messageCount}
          </span>
        )}
        {isMessageTab && (
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>
        )}
      </div>
    </div>
  );
}

export default observer(MobileAlarmNavigator);
