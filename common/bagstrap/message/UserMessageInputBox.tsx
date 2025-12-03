import clsx from 'clsx';
import React, {
  ChangeEvent,
  ChangeEventHandler,
  KeyboardEventHandler,
  useCallback
} from 'react';
import { observer } from 'mobx-react';

import {
  useRegisterUserMessageMutation,
  RoomsDocument,
  EntityType
} from '@generated/graphql';

import SendIcon from '@public/icons/[message]send.svg';

import BaseButton from '@common/button/BaseButton';
import BaseMultilineTextInput from '@common/input/BaseMultilineTextInput';

import { useStore } from '@stores/useStore.hook';

export interface UserMessageInputBoxProps {
  roomUuid?: string;

  partnerUuid: string;

  onMessageRegister?: (roomUuid: string) => void;
}

const MAX_LEN = 500;

const UserMessageInputBox = (props: UserMessageInputBoxProps): JSX.Element => {
  const { roomUuid, partnerUuid, onMessageRegister } = props;

  const { MeStore } = useStore();

  const [message, setMessage] = React.useState('');

  const [registerUserMessage] = useRegisterUserMessageMutation();

  const handleChangeInput: ChangeEventHandler<HTMLTextAreaElement> = useCallback(e => {
    setMessage(e.target.value);
  }, []);

  const handleClickSubmitButton = useCallback(() => {
    if (message.trim()) {
      registerUserMessage({
        variables: {
          input: {
            message: message.slice(0, MAX_LEN),
            parentEntityType: roomUuid ? EntityType.Room : EntityType.User,
            parentEntityUuid: roomUuid ? roomUuid : partnerUuid
          }
        },
        onCompleted: ({ registerUserMessage }) => {
          registerUserMessage.roomUuid &&
            onMessageRegister?.call(null, registerUserMessage.roomUuid);
        },
        refetchQueries: [
          {
            query: RoomsDocument,
            variables: {
              input: {
                userUuid: MeStore.getUUID(),
                paginationRequestDto: {
                  count: 10
                }
              }
            }
          }
        ]
      });

      setMessage('');
    }
  }, [MeStore, message, onMessageRegister, partnerUuid, registerUserMessage, roomUuid]);

  const handleKeyUp: KeyboardEventHandler<HTMLTextAreaElement> = useCallback(
    e => {
      if (e.shiftKey && e.key === 'Enter') {
        handleClickSubmitButton();
      }
    },
    [handleClickSubmitButton]
  );

  return (
    <BaseMultilineTextInput
      className="hidden lg:flex"
      inputProps={{
        className: clsx(
          'py-5 pr-14',
          'typo-body5',
          'placeholder:text-[#A6A6A6]',
          'lg:pl-5'
        )
      }}
      minRows={1}
      maxRows={7}
      maxLength={MAX_LEN}
      placeholder="Shift + Enter로 바로 전송"
      value={message}
      onChange={handleChangeInput}
      onKeyUp={handleKeyUp}
      suffix={
        <BaseButton
          onClick={handleClickSubmitButton}
          className={clsx('mr-5', message ? 'text-primary' : 'text-grey2')}
        >
          <SendIcon />
        </BaseButton>
      }
    />
  );
};

export default observer(UserMessageInputBox);
