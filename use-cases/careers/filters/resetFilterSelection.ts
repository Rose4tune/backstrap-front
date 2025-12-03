import { careerFilterTitles } from '@constants/bagstrap/careers/filters';

const careerFilterDataEnglish = {
  직군: 'job',
  직무: 'jobSubCategories',
  '산업 유형': 'industry',
  '회사 유형': 'company',
  '채용 유형': 'recruitment',
  '학력 조건': 'education',
  '경력 조건': 'years',
  지역: 'region',
  '마감 유형': 'deadline'
};

export function resetFilterSelection(
  prev: Record<string, string[] | number>
): Record<string, string[] | number> {
  return careerFilterTitles.reduce(
    (acc, item) => {
      if (item.title === '경력 조건') {
        acc['yearsMin'] = prev['yearsMin'];
        acc['yearsMax'] = prev['yearsMax'];
      } else {
        const key = careerFilterDataEnglish[item.title];
        acc[key] = ['전체'];
      }
      return acc;
    },
    {} as Record<string, string[] | number>
  );
}
