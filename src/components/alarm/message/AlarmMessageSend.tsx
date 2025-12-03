import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMediaQuery } from '@mui/material';
import { useStore } from '@stores/useStore.hook';
import { components } from 'src/types/api';
import MobileMessageHeaderSend from 'src/components/alarm/message/MobileMessageHeaderSend';
import MobileMessageInputSend from 'src/components/alarm/message/MobileMessageInputSend';
import MobileMessageBody from 'src/components/alarm/message/MobileMessageBody';

type UserMessageViewDto = components['schemas']['UserMessageViewDto'];


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

const AlarmMessageSend: NextPage = () => {
    const isMobile = useMediaQuery('(max-width:550px)');
    const router = useRouter();
    const { uuid, partnerUuid, type } = router.query;
    const { UserStore } = useStore();
    const accessToken = UserStore.getAccessTokenFromCookies?.();

    const [meUuid, setMeUuid] = useState<string | undefined>();
    const [messageList, setMessageList] = useState<UserMessageViewDto[]>([]);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const bodyData = mapMessagesForBody(messageList, meUuid);


    return (
        <div className="bg-white min-h-screen pb-16">
            <MobileMessageHeaderSend />

            <div className="px-5 py-3 bg-gray-20">
                {/* <MobileMessageOrigin {...originMock} /> */}
            </div>

            <MobileMessageBody userMe={bodyData.userMe} userOther={bodyData.userOther} />

            {/* sentinel */}
            <div ref={sentinelRef} />

            <MobileMessageInputSend uuid={uuid as string} type={type as any} isDesktop={true} />
        </div>
    );
};

export default observer(AlarmMessageSend);
