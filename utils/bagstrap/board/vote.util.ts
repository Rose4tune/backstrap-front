import { formatDateDisplay } from '@utils/common/date.util';

import { BoardPostVoteRegisterFormDeadlineValues } from '@common/bagstrap/board/BoardPostVoteRegisterForm';

export const encodeDeadlineValues = ({
  date,
  ampm,
  hour,
  minute
}: BoardPostVoteRegisterFormDeadlineValues): number => {
  const dateObj = new Date(date);

  return new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate(),
    ampm === 'pm' ? hour + 12 : hour,
    minute
  ).getTime();
};

export const decodeDeadline = (
  deadline: number | Date
): BoardPostVoteRegisterFormDeadlineValues => {
  const dateObj = new Date(deadline);

  const hour = dateObj.getHours();
  const minute = dateObj.getMinutes();

  const ampm = formatDateDisplay(deadline, 'A', undefined, 'en').toLowerCase();

  return {
    date: new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()),
    ampm,
    hour: ampm === 'pm' ? hour - 12 : hour,
    minute
  };
};
