import clsx from "clsx";

import { NoticeDataFragment } from "@generated/graphql";

import NoticeInfo from './NoticeInfo'

export interface NoticeListItemProps {
  notice: NoticeDataFragment;
}

const NoticeListItem = ({ notice }: NoticeListItemProps): JSX.Element => {

  return (
    <li
      className={clsx(
        "flex flex-col justify-between",
        "border-b border-[#E5E5EB]",
        "py-3 overflow-hidden",
        "md:py-4",
        "lg:px-0"
      )}
    >
      <div
        className={clsx(
          "flex justify-between gap-3 h-14",
          "md:gap-5 md:px-3 md:h-[88px]"
        )}
      >
        {/* title & content */}
        <div className={clsx("flex-1", "space-y-2", "md:space-y-4")}>
          <p
            className={clsx(
              "font-bold text-[13px] leading-none break-all",
              "md:typo-body3"
            )}
          >
            <div className="line-clamp-1 text-ellipsis overflow-hidden break-all">
              {notice.title}
            </div>
          </p>
          <p
            className={clsx(
              "text-[13px] leading-tight break-all",
              "md:typo-body5 md:font-medium"
            )}
          >
            <div className="break-words line-clamp-2 text-ellipsis overflow-hidden">
              {notice.content && JSON.parse(notice.content)[0]["insert"].toString()}
            </div>
          </p>
        </div>
      </div>

      {/* Info */}
      <NoticeInfo />
    </li>
  );
};

export default NoticeListItem;
