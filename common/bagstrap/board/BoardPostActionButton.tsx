import clsx from 'clsx';

import BaseButton from '@common/button/BaseButton';

export interface BoardPostActionButtonProps {
  label: string;

  icon?: React.ReactNode;

  count?: number;

  isActive?: boolean;

  onClick?: () => void;
}

const BoardPostActionButton = (props: BoardPostActionButtonProps): JSX.Element => {
  const { icon, label, count, isActive, onClick } = props;

  return (
    <BaseButton
      onClick={() => {
        onClick?.call(null);
      }}
      className={clsx(
        'flex-1',
        'gap-x-2 border rounded-lg h-[38px] typo-body6 font-semibold',
        'md:typo-body5 md:font-bold md:h-12',
        isActive ? 'border-primary text-primary' : 'border-[#E5E5EB] text-grey5'
      )}
    >
      {icon}
      <div>
        <span>{label}</span>&nbsp;<span>{count}</span>
      </div>
    </BaseButton>
  );
};

export default BoardPostActionButton;
