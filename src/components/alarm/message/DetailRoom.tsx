import { useCallback, useEffect, useRef, useState } from "react";
import MobileMessageInput from "./MobileMessageInput";
import getUserMessagesByPagingNew from "@api/user-message/getUserMessagesByPagingNew";
import getMe from "@api/user/getMe";
import editUserMessage from "@api/user-message/editUserMessage";
import getRoomByUuid from "@api/user-message-room/getRoomByUuid";
import { useStore } from "@stores/useStore.hook";
import { components } from "src/types/api";
import AlarmMessageHeader from "./AlarmMessageHeader";
import MessageBody from "./MessageBody";

type UserMessageViewDto = components['schemas']['UserMessageViewDto'];
type RoomViewDto = components['schemas']['RoomViewDto'];

interface DetailRoomProps {
  roomUuid: string;
  setSelectedUuid: React.Dispatch<React.SetStateAction<string | null>>;
  onReloadRooms: () => void;   // 🔥 여기 추가
}

export default function DetailRoom({
  roomUuid,
  setSelectedUuid,
  onReloadRooms,              // 🔥 여기 추가
}: DetailRoomProps) {

  const PAGE_SIZE = 20;

  // 메시지 매핑
  function mapMessagesForBody(messages: UserMessageViewDto[], meUuid?: string) {
      const userMe: { time: string; content: string }[] = [];
      const userOther: { time: string; content: string }[] = [];
      messages.forEach((m) => {
          const time = m.createdDate as string;
          const content = m.message ?? '';
          const isMine = m.sender?.uuid && meUuid && m.sender.uuid === meUuid;
          (isMine ? userMe : userOther).push({ time, content });
      });
      return { userMe, userOther };
  }

  const { UserStore } = useStore();
  const accessToken = UserStore.getAccessTokenFromCookies?.();

  const [meUuid, setMeUuid] = useState<string | undefined>();
  const [messageList, setMessageList] = useState<UserMessageViewDto[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [requestCursor, setRequestCursor] = useState<string | null>("INIT");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [firstFetchDone, setFirstFetchDone] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [roomInfo, setRoomInfo] = useState<RoomViewDto>();
  const [reloadToken, setReloadToken] = useState(0);

  // room 정보 불러오기
  const fetchRoomInfo = useCallback(async () => {
    if (!roomUuid || typeof roomUuid !== "string") return;
    try {
      const res = await getRoomByUuid(roomUuid, accessToken);
      if (res.success && res.data) {
        setRoomInfo(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [roomUuid, accessToken]);

  // 읽지 않은 메시지 읽음 처리
  const markAllMessagesAsRead = useCallback(
    async (messages: UserMessageViewDto[]) => {
      if (!accessToken) return;
      const unreadMessages = messages.filter((m) => !m.isRead);
      if (unreadMessages.length === 0) return;

      try {
        await Promise.all(
          unreadMessages.map((msg) =>
            editUserMessage(accessToken, {
              uuid: msg.uuid as string,
              isRead: true,
            })
          )
        );
      } catch (e) {
        console.error("읽음 처리 실패:", e);
      }
    },
    [accessToken]
  );

  useEffect(() => {
    fetchRoomInfo();
  }, [fetchRoomInfo]);

  useEffect(() => {
    if (messageList.length > 0 && accessToken) {
      markAllMessagesAsRead(messageList);
    }
  }, [messageList, accessToken, markAllMessagesAsRead]);

  const isAnynomous = roomInfo?.isAnonymous ?? false;
  const blockUnregister = roomInfo?.entityStatus !== "ACTIVE";
  const partnerOut = !roomInfo?.receiverIdExist || !roomInfo?.senderIdExist;
  const isOut = blockUnregister || partnerOut;
  const isReportedByMe = roomInfo?.isReportedByMe;

  // 내 정보
  const fetchMe = useCallback(async () => {
    try {
      const res = await getMe(accessToken);
      if (res?.success && res?.data?.uuid) setMeUuid(res.data.uuid);
    } catch (e) {
      console.error(e);
    }
  }, [accessToken]);

  // 메시지 페이징 fetch
  useEffect(() => {
    const run = async () => {
      if (!roomUuid || typeof roomUuid !== "string") return;
      if (loading) return;
      if (!hasMore && requestCursor !== "INIT") return;

      const usedCursor = requestCursor === "INIT" ? null : requestCursor;
      if (requestCursor !== "INIT" && !usedCursor) return;

      try {
        setLoading(true);

        const payload: any = {
          paginationRequestDto: {
            count: PAGE_SIZE,
            ...(usedCursor ? { cursor: usedCursor } : {}),
          },
          roomUuid: roomUuid,
        };

        const res = await getUserMessagesByPagingNew(accessToken, payload);
        if (res?.success && res?.data) {
          const items: UserMessageViewDto[] = res.data.data ?? [];
          const nextCursor: string | null = res.data.cursor ?? null;

          setMessageList((prev) =>
            requestCursor === "INIT" ? items : [...prev, ...items]
          );
          setCursor(nextCursor);
          setHasMore(Boolean(nextCursor) || items.length === PAGE_SIZE);
          setFirstFetchDone(true);
        } else {
          setHasMore(false);
          setFirstFetchDone(true);
        }
      } catch (e) {
        console.error(e);
        setHasMore(false);
        setFirstFetchDone(true);
      } finally {
        setLoading(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestCursor, roomUuid]);

  useEffect(() => {
    setMessageList([]);
    setCursor(null);
    setHasMore(true);
    setFirstFetchDone(false);
    setRequestCursor("INIT");
  }, [roomUuid, reloadToken]);

  useEffect(() => {
    if (!roomUuid || typeof roomUuid !== "string") return;
    setMessageList([]);
    setCursor(null);
    setHasMore(true);
    setFirstFetchDone(false);
    setRequestCursor("INIT");
  }, [roomUuid]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  // 무한스크롤
  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first.isIntersecting) return;
        if (!firstFetchDone) return;
        if (loading) return;
        if (!hasMore) return;

        if (cursor && cursor !== requestCursor) {
          setRequestCursor(cursor);
        }
      },
      { root: null, rootMargin: "120px", threshold: 0.1 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [cursor, requestCursor, firstFetchDone, loading, hasMore]);

  const firstMsg = messageList?.[0];
  const isFirstMine = firstMsg && meUuid && firstMsg.sender?.uuid === meUuid;
  const counterpart = isFirstMine ? firstMsg?.receiver : firstMsg?.sender;
  const headerName = counterpart?.name ?? "";
  const headerSchool = counterpart?.schoolName ?? "";

  const bodyData = mapMessagesForBody(messageList, meUuid);

  return (
    <div className="bg-white pb-16">
      <AlarmMessageHeader
        setSelectedUuid={setSelectedUuid}
        roomUuid={roomUuid}
        partnerUuid={counterpart?.uuid as string}
        name={headerName}
        school={headerSchool}
        isAnynomous={isAnynomous}
        isOut={isOut}
        isReportedByMe={isReportedByMe}
        onReloadRooms={onReloadRooms} 
      />

      <MessageBody userMe={bodyData.userMe} userOther={bodyData.userOther} />

      <div ref={sentinelRef} />

      <MobileMessageInput
        roomUuid={roomInfo?.uuid}
        isOut={isOut}
        setReloadToken={setReloadToken}
      />
    </div>
  );
}
