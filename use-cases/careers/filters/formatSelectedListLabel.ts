import { getJobTypeLabel } from './jobTypeKoreanMap';

export function formatSelectedListLabel(
  category: string,
  values: string[] | number,
  selectedList: Record<string, string[] | number>
): string | string[] | undefined {
  if (category === 'yearsMax') return;

  if (typeof values === 'number' || category === 'yearsMin' || category === 'yearsMax') {
    const yearsMin = selectedList.yearsMin;
    const yearsMax = selectedList.yearsMax;

    if (yearsMin === 0) return `신입 ~ ${yearsMax}년`;
    if (yearsMax === 10) return `${yearsMin}년 이상`;
    if (yearsMin === yearsMax) return `${yearsMin}년`;

    return `${yearsMin}년 ~ ${yearsMax}년`;
  }

  if ((values as string[]).includes('전체')) return '전체';

  if (category === 'job') {
    return (values as string[]).map(value => getJobTypeLabel(value));
  }

  return (values as string[]).map(item => item.split('/')[1]).join(', ');
}
