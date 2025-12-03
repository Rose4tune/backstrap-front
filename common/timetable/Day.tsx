import clsx from 'clsx';
import { useCallback, useState } from 'react';

import { DayOfWeek } from '@generated/graphql';
import { DaysOfWeekTranslator } from '@constants/timetable.constant';
import useTimeTableContext from '@hooks/context/useTimeTableContext.hook';

interface DayProps {
  day: DayOfWeek;
  onClick: (day: DayOfWeek) => void;
}

function Day({ day, onClick }: DayProps) {
  const { daysOfWeek } = useTimeTableContext();

  const [selected, setSelected] = useState(daysOfWeek.includes(day));

  const handleClick = useCallback(() => {
    setSelected(prev => !prev);
    onClick(day);
  }, [day, onClick]);

  return (
    <div
      className={clsx(
        'flex justify-center items-center flex-[1_1_13%]',
        'w-[35px] h-[35px] rounded-full',
        'box-border border-[2px] font-semibold',
        'transition-all duration-200 ease-in-out',
        'cursor-pointer select-none',
        selected && 'border-[#5AC7BB] text-[#5AC7BB]',
        !selected && 'border-[#CDCDCD] text-[#CDCDCD]'
      )}
      onClick={handleClick}
    >
      {DaysOfWeekTranslator[day]}
    </div>
  );
}

export default Day;
