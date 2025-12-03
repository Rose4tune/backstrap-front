import clsx from 'clsx';
import React from 'react';
import { useClickAway } from 'react-use';

import { EntityType, UserSummaryFragment } from '@generated/graphql';

import ProfileChangerIcon from '@public/icons/profile-changer.svg';
import ArrowBackIcon from '@public/icons/arrow-back.svg';
import MoreIcon from '@public/icons/[message]more.svg';

import BaseButton from '@common/button/BaseButton';
import EntityMenu from '@common/bagstrap/etc/EntityMenu';
import {
  PartnerName,
  PartnerNameArea,
  PartnerProfileImage,
  ProfileImageArea,
  UserMessageRoomHeaderArea,
  UserMessageRoomHeaderIconsArea,
  UserMessageRoomMenu
} from './UserMessageRoomHeader.style';

export interface UserMessageRoomHeaderProps {
  roomUuid: string;

  partner?: Pick<UserSummaryFragment, 'uuid' | 'name' | 'profileImage'> | null;

  isAnonymous?: boolean | null;

  onBack?: () => void;
}

const UserMessageRoomHeader = (props: UserMessageRoomHeaderProps): JSX.Element => {
  const { roomUuid, partner, isAnonymous, onBack } = props;

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuRef = React.useRef(null);

  useClickAway(menuRef, () => {
    setIsMenuOpen(false);
  });

  return (
    <UserMessageRoomHeaderArea>
      <UserMessageRoomHeaderIconsArea>
        <BaseButton
          onClick={() => {
            onBack?.call(null);
          }}
          className="w-10 flex !justify-start"
        >
          <ArrowBackIcon />
        </BaseButton>

        {partner && (
          <ProfileImageArea>
            {isAnonymous || !partner?.profileImage ? (
              <ProfileChangerIcon className="w-[44px] h-[44px]" />
            ) : (
              <PartnerProfileImage src={partner.profileImage} />
            )}
          </ProfileImageArea>
        )}
        <UserMessageRoomMenu ref={menuRef}>
          <BaseButton
            onClick={() => {
              setIsMenuOpen(prev => !prev);
            }}
            className="w-10 h-5 flex !justify-end"
          >
            <MoreIcon />
          </BaseButton>
          {partner && partner.uuid && (
            <EntityMenu
              className={clsx(
                'translate-y-full -bottom-1.5 -right-4',
                isMenuOpen ? 'block' : 'hidden'
              )}
              entityType={EntityType.Room}
              uuid={roomUuid}
              user={{ ...partner, isAnonymous: isAnonymous ?? false }}
            />
          )}
        </UserMessageRoomMenu>
      </UserMessageRoomHeaderIconsArea>

      <PartnerNameArea>
        <PartnerName>{isAnonymous ? '익명의 끈' : partner?.name}</PartnerName>
      </PartnerNameArea>
    </UserMessageRoomHeaderArea>
  );
};

export default UserMessageRoomHeader;
