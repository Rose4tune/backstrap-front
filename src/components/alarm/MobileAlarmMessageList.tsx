import React, { useEffect, useRef, useCallback } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import getRoomsByPagingNew from '@api/user-message-room/getRoomsByPagingNew';
import { useStore } from '@stores/useStore.hook';
import { components } from 'src/types/api';

type RoomViewDto = components['schemas']['RoomViewDto'];

const MobileAlarmMessageList = () => {
    const router = useRouter();
    const { UserStore } = useStore();
    const accessToken = UserStore.getAccessTokenFromCookies();

    const [roomList, setRoomList] = React.useState<RoomViewDto[]>([]);
    const [cursor, setCursor] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [hasMore, setHasMore] = React.useState(true);
    const [firstFetch, setFirstFetch] = React.useState(false); // 첫 fetch 완료 여부

    const observerRef = useRef<HTMLDivElement | null>(null);

    /** message 클릭 */
    const handleClick = (uuid: string) => {
        router.push(`/my/alarm/message/${uuid}`);
    };

    /** 방 목록 가져오기 */
    const getRoomLists = useCallback(
        async (cursorParam?: string | null) => {
            if (loading || !hasMore) return;
            setLoading(true);

            try {
                const res = await getRoomsByPagingNew(accessToken, {
                    paginationRequestDto: { count: 20, cursor: cursorParam || undefined },
                });

                if (res.success && res.data) {
                    const newRooms = res.data.data || [];
                    const nextCursor = res.data.cursor || null;

                    // uuid 중복 방지
                    setRoomList((prev) => {
                        const existingUUIDs = new Set(prev.map((r) => r.uuid));
                        const filtered = newRooms.filter((r) => !existingUUIDs.has(r.uuid));
                        return [...prev, ...filtered];
                    });

                    setCursor(nextCursor);
                    setHasMore(!!nextCursor);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        },
        [accessToken, loading, hasMore]
    );

    /** 첫 페이지 (최초 1회만) */
    useEffect(() => {
        const init = async () => {
            await getRoomLists(null);
            setFirstFetch(true); // 첫 호출 끝난 후 true
        };
        init();
    }, []);

    /** Intersection Observer 등록 */
    useEffect(() => {
        if (!observerRef.current || !hasMore || !firstFetch) return; // 첫 fetch 완료 후만 실행

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading) {
                    getRoomLists(cursor);
                }
            },
            { threshold: 0.8 }
        );

        observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [cursor, loading, hasMore, firstFetch]); // firstFetch가 true 돼야 작동 시작

    return (
        <div className="flex flex-col w-full bg-white">
            {roomList.map((room) => {
                const blockUnregister = room.entityStatus !== 'ACTIVE';
                const partnerOut = !room.receiverIdExist || !room.senderIdExist;
                const deActive = blockUnregister || partnerOut;
                return (
                    <div
                        key={room.uuid}
                        onClick={() => handleClick(room.uuid as string)}
                        className={`flex flex-col gap-1 justify-center px-6 py-4 cursor-pointer hover:opacity-80 ${deActive
                            ? 'bg-gray-20'
                            : room.unreadCount !== 0
                                ? 'bg-bagstrap-10'
                                : 'bg-white'
                            }`}
                    >
                        <div className="flex justify-between gap-2">
                            <p
                                className={`text-semibold-12 truncate ${deActive ? 'text-gray-60' : 'text-normal'
                                    }`}
                            >
                                {deActive
                                    ? '(알 수 없음)'
                                    : room.isAnonymous
                                        ? '익명의 끈'
                                        : room.partner?.name}
                            </p>
                            <p className="text-reg-12 text-gray-50 flex-shrink-0">
                                {formatDate(room.createdDate)}
                            </p>
                        </div>

                        <div className="flex justify-between py-2 gap-2">
                            <p
                                className={`text-semibold-14 truncate ${deActive ? 'text-gray-60' : 'text-gray-90'
                                    }`}
                            >
                                {room.lastMessage?.message}
                            </p>

                            {(room.unreadCount || 0) > 0 && (
                                <div className="w-[20px] h-[20px] bg-normal text-white text-bold-12 rounded-full flex items-center justify-center flex-shrink-0">
                                    {room.unreadCount}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            {/* 무한 스크롤 트리거 */}
            <div ref={observerRef} className="h-10" />

            {loading && (
                <p className="text-center text-gray-50 text-[14px]">불러오는 중...</p>
            )}
            {/* {!hasMore && (
                <p className="text-center text-gray-40 text-[14px]">모든 메시지를 불러왔습니다.</p>
            )} */}
        </div>
    );
};

export default observer(MobileAlarmMessageList);

function formatDate(dateString: string | undefined) {
    const date = new Date(dateString || '');
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const datenumber = String(date.getDate()).padStart(2, '0');
    const time = date.toTimeString().split(' ')[0].split(':').slice(0, 2).join(':');
    return `${year}.${month}.${datenumber} ${time}`;
}
