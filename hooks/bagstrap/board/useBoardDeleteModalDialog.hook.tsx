/* eslint-disable react/jsx-key */
import React from 'react';
import { useRouter } from 'next/router';
import { useMeasure } from 'react-use';

import {
  FaGroupSummaryFragment,
  useDeleteBoardMutation,
  useDeleteNoticeMutation
} from '@generated/graphql';

import InfoIcon from '@public/icons/info.svg';

import BaseButton from '@common/button/BaseButton';

import useModalDialog from '@hooks/useModalDialog.hook';

import { BoardType } from '@enums/board/board.enum';

export default function useBoardDeleteModalDialog(
  uuid: string,
  boardType: BoardType,
  title?: string | null,
  category?: NilableProps<Pick<FaGroupSummaryFragment, 'uuid' | 'name' | 'code'>> | null,
  sourceUrl?: string
): [React.ReactNode, () => void, () => void] {
  const router = useRouter();

  const [ref, { width }] = useMeasure<HTMLSpanElement>();

  const [deleteBoard, deleteBoardMutationResult] = useDeleteBoardMutation();
  const [deleteNotice, deleteNoticeMutationResult] = useDeleteNoticeMutation();

  const [el, openDialog, closeDialog] = useModalDialog(
    {
      loading:
        boardType === BoardType.NOTICE
          ? !!deleteNoticeMutationResult.loading
          : !!deleteBoardMutationResult.loading,
      size: 'md',
      header: (
        <div className="pt-2">
          <InfoIcon className="text-black" />
        </div>
      ),
      body: (
        <div className="leading-none">
          <p className="typo-body1 font-bold py-4">게시글을 삭제할까요?</p>
          <p className="text-grey5 typo-body5 py-2 flex">
            <span className="inline-block" ref={ref}>
              {boardType !== BoardType.NOTICE &&
                category?.name &&
                `[ ${category?.name} ] >`}
              {boardType === BoardType.NOTICE && `[ 소식끈 ] >`}
            </span>{' '}
            [&nbsp;
            <span
              className="line-clamp-1 text-ellipsis overflow-hidden break-all"
              style={{ width: 260 - width }}
            >
              {title}
            </span>
            ]
          </p>
          <p className="typo-body6 font-light text-grey5 py-2">
            삭제한 게시글은 복구할 수 없습니다.
          </p>
        </div>
      ),
      actions: [
        <BaseButton
          className="flex-1 border border-[#566789] border-opacity-[26%] rounded-lg h-[42px]"
          onClick={() => {
            closeDialog();
          }}
        >
          <span className="font-medium text-[#151920] typo-body6 opacity-50">취소</span>
        </BaseButton>,
        <BaseButton
          onClick={() => {
            if (boardType === BoardType.NOTICE) {
              deleteNotice({
                variables: {
                  uuid
                },
                onCompleted: () => {
                  closeDialog();

                  router.replace('/board/notice');
                }
              });
            } else {
              deleteBoard({
                variables: {
                  uuid
                },
                onCompleted: ({ deleteBoard }) => {
                  closeDialog();

                  router.replace(
                    sourceUrl || (category?.uuid ? `/board/${category.uuid}` : '/')
                  );
                }
              });
            }
          }}
          className="flex-1 bg-black rounded-lg h-[42px] font-medium text-white typo-body6"
        >
          삭제하기
        </BaseButton>
      ]
    },
    () => {}
  );

  return [el, openDialog, closeDialog];
}
