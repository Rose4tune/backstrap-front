export const formatJobYear = (min: number, max: number) => {
  if (min === -1 && max === -1) {
    return '경력무관';
  }
  if (min === 0 && max === 0) {
    return '신입';
  }
  if (min === max) {
    return `${min}년`;
  }
  if (min === 0) {
    return `신입~${max}년`;
  }
  return `${min}년~${max}년`;
};
