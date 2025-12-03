import clsx from "clsx";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/router";

import { setErrorUnauthorizedAction } from "@vars/error.var";

import MenuBoxDouble from "@public/images/[board]menu-box-double.svg";

import useAuthenticated from "@hooks/useAuthenticated.hook";
import useBoardDeleteModalDialog from "@hooks/bagstrap/board/useBoardDeleteModalDialog.hook";

import { BoardType } from '@enums/board/board.enum'

export interface NoticeEntityMenuProps extends BaseProps {
  uuid: string;

  title?: string | null;
}

const NoticeEntityMenu = (props: NoticeEntityMenuProps): JSX.Element => {
  const {
    className,
    uuid,
    title,
  } = props;

  const router = useRouter();

  const isAuthenticated = useAuthenticated();

  const [boardDeleteModalDialogEl, openBoardDeleteModalDialog] =
    useBoardDeleteModalDialog(uuid, BoardType.NOTICE, title)

  const menus = useMemo(() => [
    {
      label: "수정하기",
      action: () => {
        router.push(`/board/notice/write?uuid=${uuid}`)
      },
    },
    {
      label: "삭제하기",
      action: () => {
        openBoardDeleteModalDialog()
      },
    },
  ], [uuid, router, openBoardDeleteModalDialog]);

  const onClickMenuItem = useCallback((action: () => void) => () => {
    if (isAuthenticated) {
      action();
    } else {
      setErrorUnauthorizedAction();
    }
  }, [isAuthenticated])

  return (
    <div className={clsx("absolute z-50", className)}>
      <MenuBoxDouble className="absolute inset-0" />
      <ul
        className={clsx(
          "flex flex-col justify-between items-center px-1 pt-2 z-50",
          "typo-body8 font-medium text-grey5"
        )}
      >
        {menus.map(({ label, action }, index) => (
          <li
            key={index}
            onClick={onClickMenuItem(action)}
            className={clsx(
              "w-[85px] h-[31px] z-50",
              "flex-center cursor-pointer",
              "hover:font-bold hover:underline",
              index + 1 < menus.length &&
                "border-b border-[#E5E5EB] border-opacity-75"
            )}
          >
            {label}
          </li>
        ))}
      </ul>
      {boardDeleteModalDialogEl}
    </div>
  );
};

export default NoticeEntityMenu;
