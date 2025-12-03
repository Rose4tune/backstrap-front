import clsx from "clsx";

import { UserMessageSummaryFragment } from "@generated/graphql";

import { useStore } from '@stores/useStore.hook'

import UserMessageBox from "./UserMessageBox";

export interface UserMessageListProps {
  userMessages: UserMessageSummaryFragment[];
}

const UserMessageList = (props: UserMessageListProps): JSX.Element => {
  const { userMessages } = props;

  const { MeStore } = useStore()

  return (
    <ul className={clsx("mb-6 px-4 space-y-4", "md:px-7 md:space-y-6")}>
      {!MeStore.isEmpty() &&
        userMessages
          .map((userMessage, index) => (
            <li
              key={userMessage.uuid || index}
              className={clsx(
                "flex",
                userMessage.sender?.uuid === MeStore.getUUID()
                  ? "justify-end"
                  : "justify-start"
              )}
            >
              <UserMessageBox userMessage={userMessage} me={MeStore.getMe()} />
            </li>
          ))
          .reverse()}
    </ul>
  );
};

export default UserMessageList;
