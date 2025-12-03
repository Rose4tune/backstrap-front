import { careerFilterDataEnglish } from '@constants/bagstrap/careers/filters';

export function selectAllFilter(
  prevList: Record<string, string[] | number>,
  category: keyof typeof careerFilterDataEnglish
): Record<string, string[] | number> {
  const isAllSelected = (
    prevList[careerFilterDataEnglish[category]] as string[]
  )?.includes('전체');

  return {
    ...prevList,
    jobSubCategories: category === '직군' ? ['전체'] : prevList['jobSubCategories'],
    [careerFilterDataEnglish[category]]: isAllSelected
      ? prevList[careerFilterDataEnglish[category]]
      : ['전체']
  };
}
