export const formatDeadlineDate = (date: string) => {
  const target = new Date(date);
  const today = new Date();

  const timeDiff = target.getTime() - today.getTime();
  const daysUntil = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return daysUntil > 999 ? '999+' : daysUntil > 0 ? daysUntil : 0;
};
