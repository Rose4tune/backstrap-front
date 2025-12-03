import clsx from 'clsx';
import React from 'react';
import { useInView } from 'react-intersection-observer';

import {
  useEditUserMessageMutation,
  UserMessageSummaryFragment,
  RoomsDocument,
  MeQuery,
  NewAlarmCountDocument
} from '@generated/graphql';

import { formatDateDisplay } from '@utils/common/date.util';
import { renderLineBreak } from '@utils/common/render.util';
import { DEFAULT_REQUEST_COUNT } from '@constants/request.constant';
import {
  MessageText,
  MessageTime,
  MessageTimeArea,
  UserMessageBoxArea,
  UserMessageContainer
} from './UserMessageBox.style';

export interface UserMessageBoxProps {
  userMessage: UserMessageSummaryFragment;

  me: MeQuery['me'];
}

const UserMessageBox = (props: UserMessageBoxProps): JSX.Element => {
  const { userMessage, me } = props;

  const { ref, inView } = useInView();

  const [editUserMessage] = useEditUserMessageMutation();

  React.useEffect(() => {
    if (
      inView &&
      userMessage.uuid &&
      me.uuid !== userMessage.sender?.uuid &&
      !userMessage.isRead
    ) {
      editUserMessage({
        variables: {
          input: {
            uuid: userMessage.uuid,
            isRead: true
          }
        },
        refetchQueries: [
          {
            query: NewAlarmCountDocument
          },
          {
            query: RoomsDocument,
            variables: {
              input: {
                userUuid: me.uuid,
                paginationRequestDto: {
                  count: DEFAULT_REQUEST_COUNT
                }
              }
            }
          }
        ]
      });
    }
  }, [inView, me, userMessage]);

  return (
    <UserMessageBoxArea ref={ref}>
      <UserMessageContainer isSender={me.uuid === userMessage.sender?.uuid}>
        <MessageText>
          {userMessage.message && renderLineBreak(userMessage.message)}
        </MessageText>
      </UserMessageContainer>
      <MessageTimeArea isSender={me.uuid === userMessage.sender?.uuid}>
        <MessageTime>{formatDateDisplay(userMessage.createdDate)}</MessageTime>
      </MessageTimeArea>
    </UserMessageBoxArea>
  );
};

export default UserMessageBox;
