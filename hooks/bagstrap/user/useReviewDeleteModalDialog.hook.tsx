import concat from 'lodash/concat';
import React from 'react';

import { EntityType, ReviewsDocument, useDeleteReviewMutation } from '@generated/graphql';

import InfoIcon from '@public/icons/info.svg';

import BaseButton from '@common/button/BaseButton';

import useModalDialog from '@hooks/useModalDialog.hook';

export default function useReviewDeleteModalDialog(
  uuid: string,
  title?: string | null,
  parent?: {
    entityType: EntityType;
    uuid: string;
  }
): [React.ReactNode, () => void, () => void] {
  const [deleteReview, deleteReviewMutationResult] = useDeleteReviewMutation();

  const [el, openDialog, closeDialog] = useModalDialog({
    loading: deleteReviewMutationResult.loading,
    size: 'md',
    header: (
      <div className="pt-2">
        <InfoIcon className="text-black" />
      </div>
    ),
    body: (
      <div className="leading-none">
        <p className="typo-body1 font-bold py-4">댓글을 삭제할까요?</p>
        <p className="text-grey5 typo-body5 py-2 flex">
          [&nbsp;
          <div className="line-clamp-1 text-ellipsis overflow-hidden break-all">
            {title}
          </div>
          &nbsp;]
        </p>
        <p className="typo-body6 font-light text-grey5 py-2">
          삭제한 댓글은 복구할 수 없습니다.
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
          deleteReview({
            variables: {
              uuid
            },
            onCompleted: ({ deleteReview }) => {
              closeDialog();
            },
            refetchQueries: concat(
              parent
                ? [
                    {
                      query: ReviewsDocument,
                      variables: {
                        input: {
                          parentEntityType: parent?.entityType,
                          parentEntityUuid: parent?.uuid,
                          entityStatus: null,
                          paginationRequestDto: {
                            count: 100
                          }
                        }
                      }
                    }
                  ]
                : []
            )
          });
        }}
        className="flex-1 bg-black rounded-lg h-[42px] font-medium text-white typo-body6"
      >
        삭제하기
      </BaseButton>
    ]
  });

  return [el, openDialog, closeDialog];
}
