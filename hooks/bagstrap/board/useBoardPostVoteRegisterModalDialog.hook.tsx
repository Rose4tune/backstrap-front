import React from 'react';

import { renderLineBreak } from '@utils/common/render.util';
import { formatDateDisplay } from '@utils/common/date.util';

import { DATE_FORMAT_DISPLAY_YYYY_MM_DD_D_A_HH_MI } from '@constants/common/date.constant';

import { VoteRegisterDtoInput } from '@generated/graphql';

import VoteIcon from '@public/icons/[board]vote.svg';

import BaseButton from '@common/button/BaseButton';
import BoardPostVoteRegisterForm from '@common/bagstrap/board/BoardPostVoteRegisterForm';

import useModalDialog from '@hooks/useModalDialog.hook';

export default function useBoardPostVoteRegisterModalDialog(
  _dtoInput?: VoteRegisterDtoInput,
  onRegister?: (dtoInput: VoteRegisterDtoInput) => void
): [React.ReactNode, (dtoInput?: VoteRegisterDtoInput) => void, () => void] {
  const formButtonRef = React.useRef<HTMLFormElement>(null);

  const [dtoInput, setDtoInput] = React.useState<VoteRegisterDtoInput | undefined>();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [el, openDialog, closeDialog] = useModalDialog({
    size: 'md',
    header: isSubmitting ? (
      <VoteIcon className="text-black w-10 h-10" />
    ) : (
      <div className="flex items-center gap-2.5 text-grey5">
        <VoteIcon className="w-4 h-[17px]" />
        <p className="font-bold typo-body7">투표 등록하기</p>
      </div>
    ),
    headerHeight: isSubmitting ? undefined : 32,
    body:
      isSubmitting && dtoInput ? (
        <div className="space-y-4 pb-2">
          <p className="typo-body1 font-bold">이대로 투표를 등록할까요?</p>
          <p className="typo-body4 font-semibold text-point-red">
            게시글 최초 등록 후에는
            <br />
            투표 세부 내용 수정이 불가능합니다.
          </p>
          <ul className="px-6 typo-body5">
            <li className="list-disc break-all">
              투표제목 : {renderLineBreak(dtoInput.title)}
            </li>
            <li className="list-disc">투표항목 : 총 {dtoInput.contents.length}개</li>
            <li className="list-disc">
              복수선택 : {dtoInput.numChoice === 1 ? '불가능' : '가능'}
            </li>
            <li className="list-disc break-all">
              마감시간 :{' '}
              {dtoInput.deadline
                ? formatDateDisplay(
                    dtoInput.deadline,
                    DATE_FORMAT_DISPLAY_YYYY_MM_DD_D_A_HH_MI
                  )
                : '없음 (작성자가 종료시까지 계속 진행)'}
            </li>
          </ul>
        </div>
      ) : (
        <div className="py-4">
          <BoardPostVoteRegisterForm
            formButtonRef={formButtonRef}
            initialValues={dtoInput}
            onSubmit={values => {
              setDtoInput(values);
              setIsSubmitting(true);
            }}
          />
        </div>
      ),
    actions: [
      <BaseButton
        onClick={() => {
          if (isSubmitting) {
            setIsSubmitting(false);
          } else {
            if (dtoInput) {
              setDtoInput(undefined);
            }

            closeDialog();
          }
        }}
        className="flex-1 border border-[#566789] border-opacity-[26%] rounded-lg h-[42px]"
      >
        <span className="text-[#151920] opacity-50 typo-body6 font-semibold">취소</span>
      </BaseButton>,
      <BaseButton
        onClick={() => {
          if (isSubmitting && dtoInput) {
            onRegister?.call(null, dtoInput);
            closeDialog();
          } else {
            formButtonRef.current?.submit();
          }
        }}
        className="flex-1 bg-black rounded-lg h-[42px] text-white typo-body6 font-semibold"
      >
        {isSubmitting ? '등록하기' : '투표 첨부하기'}
      </BaseButton>
    ]
  });

  return [
    el,
    dtoInput => {
      setDtoInput(dtoInput);

      openDialog();
    },
    closeDialog
  ];
}
