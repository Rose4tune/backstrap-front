import clsx from 'clsx';

import { formatDateDisplay } from '@utils/common/date.util';

import { RoomSummaryFragment } from '@generated/graphql';

import ProfileChangerIcon from '@public/icons/profile-changer.svg';

import UserMessageRoomChatBox from '../UserMessageRoomChatBox/UserMessageRoomChatBox';
import {
  MessageRoomCard,
  MessagePartnerInfoArea,
  ProfileImage,
  ProfileImageArea,
  PartnerNameArea,
  PartnerName,
  ChatroomArea,
  LastMessageBox,
  LastMessageWord
} from './UserMessageRoomCard.style';

export interface UserMessageRoomCardProps {
  room: RoomSummaryFragment;
}

const UserMessageRoomCard = (props: UserMessageRoomCardProps): JSX.Element => {
  const { room } = props;

  return (
    <MessageRoomCard>
      <MessagePartnerInfoArea>
        <ProfileImageArea isAnonymous={room.lastMessage?.anonymous}>
          {!room.lastMessage?.anonymous &&
            (room.partner?.profileImageUrl ? (
              <ProfileImage
                src={room.partner?.profileImageUrl}
                isAnonymous={room.lastMessage?.anonymous}
              />
            ) : (
              <ProfileChangerIcon className="w-full h-full" />
            ))}
        </ProfileImageArea>
        <PartnerNameArea>
          <PartnerName isAnonymous={room.lastMessage?.anonymous}>
            {room.lastMessage?.anonymous ? '익명의 끈' : room.partner?.name}
          </PartnerName>
          <PartnerName isAnonymous={room.lastMessage?.anonymous}>
            {room.lastMessage?.anonymous ? '' : room.partner?.school?.name}
          </PartnerName>
        </PartnerNameArea>
      </MessagePartnerInfoArea>
      <ChatroomArea>
        <UserMessageRoomChatBox room={room} />
        <LastMessageBox>
          <LastMessageWord>
            {formatDateDisplay(room.lastMessage?.createdDate)}
          </LastMessageWord>
        </LastMessageBox>
      </ChatroomArea>
    </MessageRoomCard>
  );
};

export default UserMessageRoomCard;
