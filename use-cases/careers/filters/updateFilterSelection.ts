import { careerFilterDataEnglish } from '@constants/bagstrap/careers/filters';

export function updateFilterSelection(
  prevList: any,
  category: keyof typeof careerFilterDataEnglish,
  key: string,
  value: string
): any {
  const categoryKey = careerFilterDataEnglish[category];
  const categoryList = prevList[categoryKey] || [];
  const isAllSelected = categoryList.includes('전체');

  if (category === '직군') {
    return {
      ...prevList,
      [categoryKey]: [key],
      jobSubCategories: ['전체']
    };
  }

  let updatedCategoryList = categoryList.includes(`${key}/${value}`)
    ? categoryList.filter((item: any) => item !== `${key}/${value}`)
    : [...categoryList, `${key}/${value}`];

  if (isAllSelected) {
    updatedCategoryList = [`${key}/${value}`];
  }

  if (updatedCategoryList.length === 0) {
    updatedCategoryList = ['전체'];
  }

  return {
    ...prevList,
    [categoryKey]: updatedCategoryList
  };
}
