import clsx from 'clsx';
import React from 'react';

import SwitchInput from '@common/input/SwitchInput';

export interface BoardPostWriteAnonymousSwitchButtonProps {
  isAnonymous?: boolean;

  onChange?: (isAnonymous: boolean) => void;
}

const BoardPostWriteAnonymousSwitchButton = (
  props: BoardPostWriteAnonymousSwitchButtonProps
): JSX.Element => {
  const { isAnonymous, onChange } = props;

  return (
    <div
      className={clsx(
        'flex-center gap-1 h-8 px-2 border rounded-[4px]',
        'font-bold text-xs cursor-pointer',
        isAnonymous ? 'text-primary border-primary' : 'text-grey4 border-grey4',
        'lg:h-10 lg:px-4 lg:rounded-[10px] lg:border-2 lg:typo-body5'
      )}
      onClick={() => {
        onChange?.call(null, !isAnonymous);
      }}
    >
      <span>익명의 끈으로 남기기</span>
      <SwitchInput
        checked={isAnonymous}
        onChange={checked => {
          onChange?.call(null, checked);
        }}
      />
    </div>
  );
};

export default BoardPostWriteAnonymousSwitchButton;
