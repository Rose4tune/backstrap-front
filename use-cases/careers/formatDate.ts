export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();

  if (year === 9999) return '';

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');

  return `${year}.${month}.${day} ${hours}:00 까지`;
};
