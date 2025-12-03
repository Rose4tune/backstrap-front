import { careerFilterDataKorean } from '@constants/bagstrap/careers/filters';

export function getCategoryListByTitle(
  itemTitle: string,
  job: Record<string, any>,
  filteredData: Record<string, any>,
  selectedJob: string
): { key: string; value: string }[] {
  if (itemTitle === '직군') {
    return Object.keys(job || {}).map(jobGroup => ({
      key: jobGroup,
      value: jobGroup
    }));
  }

  if (itemTitle === '직무') {
    if (!selectedJob || selectedJob === '전체') return [];
    return job[selectedJob] || [];
  }

  for (const category in filteredData) {
    if (careerFilterDataKorean[category] === itemTitle) {
      return filteredData[category] || [];
    }
  }

  return [];
}
