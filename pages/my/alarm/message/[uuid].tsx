import React, { useEffect, useRef, useState, useCallback } from 'react';
import { observer } from 'mobx-react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMediaQuery } from '@mui/material';
import MobileMessageHeader from 'src/components/alarm/message/MobileMessageHeader';
import MobileMessageBody from 'src/components/alarm/message/MobileMessageBody';
import MobileMessageInput from 'src/components/alarm/message/MobileMessageInput';
import getUserMessagesByPagingNew from '@api/user-message/getUserMessagesByPagingNew';
import getMe from '@api/user/getMe';
import { useStore } from '@stores/useStore.hook';
import { components } from 'src/types/api';
import getRoomByUuid from '@api/user-message-room/getRoomByUuid';
import editUserMessage from '@api/user-message/editUserMessage';

type UserMessageViewDto = components['schemas']['UserMessageViewDto'];

type RoomViewDto = components['schemas']['RoomViewDto'];

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

const MyAlarmMessageIndexPage: NextPage = () => {
    const isMobile = useMediaQuery('(max-width:550px)');
    const router = useRouter();
    const { uuid } = router.query;
    const { UserStore } = useStore();
    const accessToken = UserStore.getAccessTokenFromCookies?.();

    const [meUuid, setMeUuid] = useState<string | undefined>();
    const [messageList, setMessageList] = useState<UserMessageViewDto[]>([]);

    // 서버가 내려주는 "다음 페이지 커서"
    const [cursor, setCursor] = useState<string | null>(null);

    // 요청 트리거 역할을 하는 상태: 이 값이 바뀌어야만 fetch 실행
    const [requestCursor, setRequestCursor] = useState<string | null>('INIT');

    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [firstFetchDone, setFirstFetchDone] = useState(false);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const [roomInfo, setRoomInfo] = useState<RoomViewDto>()

    const [reloadToken, setReloadToken] = useState(0); //reload 용도 상태

    //room 정보 불러오기
    const fetchRoomInfo = useCallback(async () => {
        if (!uuid || typeof uuid !== 'string') return;
        try {
            const res = await getRoomByUuid(uuid, accessToken)
            if (res.success && res.data) {
                setRoomInfo(res.data)
            }
        } catch (error) {
            console.error(error)
        }
    }, [uuid, accessToken])

    // 읽지 않은 메시지를 모두 읽음 처리
    const markAllMessagesAsRead = useCallback(async (messages: UserMessageViewDto[]) => {
        if (!accessToken) return;
        const unreadMessages = messages.filter(m => !m.isRead);

        if (unreadMessages.length === 0) return;

        try {
            await Promise.all(
                unreadMessages.map((msg) =>
                    editUserMessage(accessToken, {
                        uuid: msg.uuid as string,
                        isRead: true
                    })
                )
            );
        } catch (e) {
            console.error('읽음 처리 실패:', e);
        }
    }, [accessToken]);

    useEffect(() => {
        fetchRoomInfo()
    }, [fetchRoomInfo])

    // 메시지 읽음 상태 자동 업데이트
    useEffect(() => {
        if (messageList.length > 0 && accessToken) {
            markAllMessagesAsRead(messageList);
        }
    }, [messageList, accessToken, markAllMessagesAsRead]);

    const isAnynomous = roomInfo?.isAnonymous ?? false;
    const blockUnregister = roomInfo?.entityStatus !== 'ACTIVE';
    const partnerOut = !roomInfo?.receiverIdExist || !roomInfo?.senderIdExist;
    const isOut = blockUnregister || partnerOut;
    const isReportedByMe = roomInfo?.isReportedByMe

    // 내 정보
    const fetchMe = useCallback(async () => {
        try {
            const res = await getMe(accessToken);
            if (res?.success && res?.data?.uuid) setMeUuid(res.data.uuid);
        } catch (e) {
            console.error(e);
        }
    }, [accessToken]);

    // fetch는 오직 "requestCursor 변경"으로만 실행
    useEffect(() => {
        const run = async () => {
            if (!uuid || typeof uuid !== 'string') return;
            if (loading) return; // 중복 방지
            if (!hasMore && requestCursor !== 'INIT') return; // 더 없음

            // 첫 로딩이면 null 커서, 그 외엔 requestCursor 사용
            const usedCursor = requestCursor === 'INIT' ? null : requestCursor;
            // 커서 없는데 첫 로딩도 아니면 요청 안 함
            if (requestCursor !== 'INIT' && !usedCursor) return;

            try {
                setLoading(true);

                const payload: any = {
                    paginationRequestDto: {
                        count: PAGE_SIZE,
                        ...(usedCursor ? { cursor: usedCursor } : {}),
                    },
                    roomUuid: uuid,
                };

                const res = await getUserMessagesByPagingNew(accessToken, payload);
                if (res?.success && res?.data) {
                    const items: UserMessageViewDto[] = res.data.data ?? [];
                    const nextCursor: string | null = res.data.cursor ?? null;

                    setMessageList((prev) => (requestCursor === 'INIT' ? items : [...prev, ...items]));
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
    }, [requestCursor, uuid]); // ← 상태 기반 트리거

    useEffect(() => {
        // reloadToken이 바뀌면 첫 페이지부터 다시 가져오기
        setMessageList([]);
        setCursor(null);
        setHasMore(true);
        setFirstFetchDone(false);
        setRequestCursor('INIT');
    }, [uuid, reloadToken]);

    // uuid 바뀌면 초기화 + 첫 로딩 1회만 수행('INIT')
    useEffect(() => {
        if (!uuid || typeof uuid !== 'string') return;
        setMessageList([]);
        setCursor(null);
        setHasMore(true);
        setFirstFetchDone(false);
        setRequestCursor('INIT'); // 첫 로딩 트리거
    }, [uuid]);

    // 내 정보
    useEffect(() => {
        fetchMe();
    }, [fetchMe]);

    // 무한스크롤: 첫 로딩 이후, 커서가 "새걸"로 바뀌었을 때만 다음 요청 트리거
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

                // 현재 서버가 준 "다음 커서"가 존재하고,
                // 아직 requestCursor로 사용하지 않았으면 그걸 트리거로 설정
                if (cursor && cursor !== requestCursor) {
                    setRequestCursor(cursor);
                }
            },
            { root: null, rootMargin: '120px', threshold: 0.1 }
        );

        io.observe(el);
        return () => io.disconnect();
    }, [cursor, requestCursor, firstFetchDone, loading, hasMore]);

    // 헤더 상대방
    const firstMsg = messageList?.[0];
    const isFirstMine = firstMsg && meUuid && firstMsg.sender?.uuid === meUuid;
    const counterpart = isFirstMine ? firstMsg?.receiver : firstMsg?.sender;
    const headerName = counterpart?.name ?? '';
    const headerSchool = counterpart?.schoolName ?? '';

    const bodyData = mapMessagesForBody(messageList, meUuid);

    if (!isMobile) return <></>;

    return (
        <div className="bg-white min-h-screen pb-16">
            <MobileMessageHeader roomUuid={roomInfo?.uuid as string} partnerUuid = {counterpart?.uuid as string} name={headerName} school={headerSchool} isAnynomous={isAnynomous} isOut={isOut} isReportedByMe={isReportedByMe}/>

            <div className="px-5 py-3 bg-gray-20">
                {/* <MobileMessageOrigin {...originMock} /> */}
            </div>

            <MobileMessageBody userMe={bodyData.userMe} userOther={bodyData.userOther} />

            {/* sentinel */}
            <div ref={sentinelRef} />

            <MobileMessageInput roomUuid={roomInfo?.uuid} isOut={isOut} setReloadToken={setReloadToken} />
        </div>
    );
};

export default observer(MyAlarmMessageIndexPage);
