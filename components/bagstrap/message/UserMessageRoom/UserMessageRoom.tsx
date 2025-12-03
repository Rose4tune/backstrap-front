import clsx from 'clsx';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { useRouter } from 'next/router';

import { isNotNil } from '@utils/common/base.util';

import { useRoomQuery, useUserMessagesQuery, useUserQuery } from '@generated/graphql';

import { DEFAULT_REQUEST_COUNT } from '@constants/request.constant';
import {
  Notice1,
  Notice2,
  Notice3,
  NoticeArea,
  NoticeWords1,
  NoticeWords2,
  NoticeWords3,
  UserMessageArea,
  UserMessageInputArea,
  UserMessageRoomArea
} from './UserMessageRoom.style';
import UserMessageRoomHeader from '@common/bagstrap/message/UserMessageRoomHeader';
import UserMessageList from '@common/bagstrap/message/UserMessageList';
import UserMessageInputBox from '@common/bagstrap/message/UserMessageInputBox';

export interface UserMessageRoomProps {
  userUuid: string;

  roomUuid: string;

  isAnonymous?: boolean;
}

function UserMessageRoom({ userUuid, roomUuid, isAnonymous }: UserMessageRoomProps) {
  const router = useRouter();

  const userQueryResult = useUserQuery({
    variables: {
      uuid: userUuid!
    },
    skip: !userUuid
  });

  const roomQueryResult = useRoomQuery({
    variables: {
      uuid: roomUuid!
    },
    skip: !roomUuid,
    fetchPolicy: 'cache-and-network'
  });

  const userMessagesQueryResult = useUserMessagesQuery({
    variables: {
      input: {
        roomUuid,
        paginationRequestDto: {
          count: DEFAULT_REQUEST_COUNT
        }
      }
    },
    skip: !roomUuid,
    fetchPolicy: 'cache-and-network'
  });

  const { ref, inView } = useInView();

  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (
      inView &&
      !userMessagesQueryResult.loading &&
      userMessagesQueryResult.data?.userMessagesByCursor.cursor &&
      roomUuid
    ) {
      userMessagesQueryResult.fetchMore({
        variables: {
          input: {
            roomUuid,
            paginationRequestDto: {
              count: DEFAULT_REQUEST_COUNT,
              cursor: {
                uuid: userMessagesQueryResult.data?.userMessagesByCursor.cursor
              }
            }
          }
        }
      });
    }
  }, [inView, roomUuid, userMessagesQueryResult]);

  const partner = userQueryResult.data?.user || roomQueryResult.data?.room.partner;

  const _isAnonymous = isAnonymous || roomQueryResult.data?.room.isAnonymous;

  return (
    <UserMessageRoomArea ref={listRef} isHidden={!roomUuid && !userUuid}>
      {roomUuid || userUuid ? (
        <>
          {/* header */}
          <UserMessageRoomHeader
            roomUuid={roomUuid}
            partner={partner}
            isAnonymous={_isAnonymous}
            onBack={() => {
              router.replace(router.pathname);
            }}
          />
          <UserMessageArea>
            <NoticeArea>
              <Notice1>
                <NoticeWords1>모바일 웹에서는 대화 내용 조회만 가능합니다.</NoticeWords1>
              </Notice1>

              {/* list */}
              {userMessagesQueryResult.data &&
                (userMessagesQueryResult.data.userMessagesByCursor.data.length > 0 ? (
                  <>
                    <UserMessageList
                      userMessages={userMessagesQueryResult.data.userMessagesByCursor.data.filter(
                        isNotNil
                      )}
                    />
                    <div ref={ref} className="h-1" />
                  </>
                ) : (
                  <Notice2>
                    <NoticeWords2>
                      최초 메세지 전송시부터
                      <br />
                      대화창이 개설됩니다.
                    </NoticeWords2>
                  </Notice2>
                ))}
            </NoticeArea>
          </UserMessageArea>
        </>
      ) : (
        <Notice3>
          <NoticeWords3>
            좌측 목록에서
            <br />
            대화를 선택해 주세요.
          </NoticeWords3>
        </Notice3>
      )}
      {/* bottom */}
      <UserMessageInputArea>
        {/* input */}
        {partner && partner.uuid && (
          <UserMessageInputBox
            roomUuid={roomUuid}
            partnerUuid={partner.uuid}
            onMessageRegister={messageRoomUuid => {
              if (!roomUuid) {
                router.replace(`${router.pathname}?room=${messageRoomUuid}`);
              }

              userMessagesQueryResult.refetch().then(({ data }) => {
                if (data) {
                  listRef.current?.scrollTo({
                    top: 0
                  });
                }
              });
            }}
          />
        )}
      </UserMessageInputArea>
    </UserMessageRoomArea>
  );
}

export default UserMessageRoom;
