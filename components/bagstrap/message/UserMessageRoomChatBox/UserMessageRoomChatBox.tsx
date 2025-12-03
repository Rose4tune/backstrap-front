import clsx from 'clsx';

import { renderLineBreak } from '@utils/common/render.util';

import { RoomSummaryFragment } from '@generated/graphql';

import { useStore } from '@stores/useStore.hook';
import {
  UserMessageRoomChatBoxContainer,
  LastMessageArea,
  LastMessage
} from './UserMessageRoomChatBox.style';

export interface UserMessageRoomChatBoxProps extends BaseProps {
  room: RoomSummaryFragment;
}

const UserMessageRoomChatBox = (props: UserMessageRoomChatBoxProps): JSX.Element => {
  const { room, className } = props;

  const { MeStore } = useStore();

  return (
    <>
      {!MeStore.isEmpty() && room.lastMessage && (
        <UserMessageRoomChatBoxContainer
          isRead={room.lastMessage.isRead}
          isLastSenderMe={room.lastMessage.sender?.uuid === MeStore.getUUID()}
        >
          {!MeStore.isEmpty() && room.lastMessage && (
            <LastMessageArea
              isRead={room.lastMessage.isRead}
              isLastSenderMe={room.lastMessage.sender?.uuid === MeStore.getUUID()}
            >
              <LastMessage>
                {room.lastMessage.sender?.uuid === MeStore.getUUID() && (
                  <span>회원님 : </span>
                )}
                {room.lastMessage.message && renderLineBreak(room.lastMessage.message, 2)}{' '}
              </LastMessage>
            </LastMessageArea>
          )}
        </UserMessageRoomChatBoxContainer>
      )}
    </>
  );
};

export default UserMessageRoomChatBox;
