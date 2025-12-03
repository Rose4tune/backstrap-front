import React, { useMemo, useRef, useEffect } from "react";

interface Message {
  type?: "me" | "other";
  time: string; // ex: "2025-10-21T16:50:52"
  content: string;
}

interface Props {
  userMe: Message[];
  userOther: Message[];
}

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
};

const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

const MobileMessageBody: React.FC<Props> = ({ userMe, userOther }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const mergedMessages = useMemo(
    () =>
      [
        ...userOther.map((m) => ({ ...m, type: "other" as const })),
        ...userMe.map((m) => ({ ...m, type: "me" as const })),
      ].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()),
    [userMe, userOther]
  );

  const groupedByDate = useMemo(() => {
    return mergedMessages.reduce((acc, msg: Message) => {
      const dateKey = formatDate(msg.time);
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(msg);
      return acc;
    }, {} as Record<string, Message[]>);
  }, [mergedMessages]);

  const dateKeys = useMemo(() => Object.keys(groupedByDate).sort(), [groupedByDate]);

  // 강제로 맨 아래로 내리는 함수 (두 방식 모두 시도)
  const forceScrollBottom = () => {
    const el = containerRef.current;
    if (!el) return;

    // 1) 직접 스크롤
    el.scrollTop = el.scrollHeight;
  };

  // 마운트 & 메시지 개수 변화 때 하단으로
  useEffect(() => {
    forceScrollBottom();
  }, [mergedMessages.length]);

  // 콘텐츠 높이 변할 때도 한번 더(이미지/폰트 등 늦게 로딩될 때 대비)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(() => {
      forceScrollBottom();
    });
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      // NOTE: 고정 높이 + overflow 반드시 이 엘리먼트에!
      className="flex flex-col px-5 pb-12 bg-gray-20 h-[calc(100vh-189px)] space-y-2 overflow-y-auto overflow-x-hidden overscroll-contain"
      // iOS에서 바운스 줄이려면 overscroll-contain 유용
    >
      {dateKeys.map((date) => (
        <div key={date}>
          {/* 날짜 헤더 */}
          <div className="flex justify-center mb-1">
            <div className="text-center text-semibold-10 text-white bg-gray-50 py-[2px] px-[36px] rounded-full w-fit">
              {date}
            </div>
          </div>

          {/* 날짜별 메시지 */}
          <div className="space-y-3">
            {groupedByDate[date].map((msg, idx) => (
              <div
                key={`${date}-${idx}-${msg.time}`}
                className={`flex ${msg.type === "me" ? "justify-end" : "justify-start"}`}
              >
                {msg.type === "me" && (
                  <span className="text-[10px] text-gray-70 self-end mr-2">
                    {formatTime(msg.time)}
                  </span>
                )}
                <div
                  className={`max-w-[70%] px-3 py-2 rounded-[12px] text-reg-14 whitespace-pre-line ${
                    msg.type === "me" ? "bg-click text-white" : "bg-gray-40 text-gray-90"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.type === "other" && (
                  <span className="text-[10px] text-gray-70 self-end ml-2">
                    {formatTime(msg.time)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

    </div>
  );
};

export default MobileMessageBody;
