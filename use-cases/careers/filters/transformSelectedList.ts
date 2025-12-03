const careerKeyChange: Record<string, string> = {
  jobSubCategories: 'jobTypes',
  industry: 'industryTypes',
  company: 'companyTypes',
  recruitment: 'recruitmentTypes',
  education: 'educations',
  years: 'years',
  region: 'regions',
  deadline: 'deadlineTypes'
};

export function transformSelectedList(
  selectedList: Record<string, string[] | number>
): Record<string, string[] | number> {
  const seletedData = Object.fromEntries(
    Object.entries(selectedList).filter(
      ([_, value]) => !((value as string[])[0] === '전체')
    )
  );

  const transformedData: Record<string, string[] | number> = {};
  const { job, ...restData } = seletedData;

  Object.keys(restData).forEach(key => {
    const newKey = careerKeyChange[key] || key;
    const value = seletedData[key];

    if (Array.isArray(value)) {
      transformedData[newKey] = (value as string[]).map(item =>
        item.includes('/') ? item.split('/')[0] : item
      );
    } else {
      transformedData[newKey] = value;
    }
  });

  return transformedData;
}
