import { useState, useEffect, useCallback } from 'react';

import { toJS } from 'mobx';

import careerStore from '@stores/career.store';

import useModalDialog from '@hooks/useModalDialog.hook';
import useLocalStorage from '@hooks/useLocalStorage.hook';

import { updateFilterSelection } from '@use-cases/careers/filters/updateFilterSelection';
import { selectAllFilter } from '@use-cases/careers/filters/selectAllFilter';
import { transformSelectedList } from '@use-cases/careers/filters/transformSelectedList';
import { formatSelectedListLabel } from '@use-cases/careers/filters/formatSelectedListLabel';
import { getCategoryListByTitle } from '@use-cases/careers/filters/getCategoryListByTitle';
import { resetFilterSelection } from '@use-cases/careers/filters/resetFilterSelection';
import { getJobTypeLabel } from '@use-cases/careers/filters/jobTypeKoreanMap';

import CommonButton from '@common/button/CommonButton';
import SliderBar from '@components/careers/SliderBar';
import CareerFilterButton from '@components/careers/CareerFilterButton';

import {
  careerFilterDataEnglish,
  careerFilterDataKorean,
  careerFilterTitles,
  CareerFilterTitleType
} from '@constants/bagstrap/careers/filters';

import {
  UseCareerFilterModalDialogHeaderText,
  UseCareerFilterModalDialogBodySectionList,
  UseCareerFilterModalDialogBodySection,
  UseCareerFilterModalDialogBodySectionTitle,
  UseCareerFilterModalDialogBodySectionCategoryList,
  UseCareerFilterModalDialogBodySectionCategoryEmptyText,
  UseCareerFilterModalDialogSelectedList,
  UseCareerFilterModalDialogSelectedListItem,
  UseCareerFilterModalDialogButtonContainer
} from './useCareerFilterModalDialog.style';

interface UseCareerFilterModalDialogProps {
  filterSection: CareerFilterTitleType;
  onUpdate: (value: Record<string, string[] | number>) => void;
}

const useCareerFilterModalDialog = ({
  filterSection,
  onUpdate
}: UseCareerFilterModalDialogProps): [React.ReactNode, () => void, () => void] => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        careerStore.getRecruitmentFilterType();
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      }
    };

    fetchData();
  }, []);

  const getInitialSelectedList = () => {
    const initialState: Record<string, string[] | number> = {};
    careerFilterTitles.forEach(item => {
      if (item.title === '경력 조건') {
        initialState['yearsMin'] = 0;
        initialState['yearsMax'] = 10;
      } else {
        initialState[careerFilterDataEnglish[item.title]] = ['전체'];
      }
    });
    return initialState;
  };

  const [selectedList, setSelectedList] = useState(getInitialSelectedList);
  const [sectionTitleElement, setSectionTitleElement] = useState<HTMLElement | null>(
    null
  );

  const { saveValue } = useLocalStorage('careerFilter', setSelectedList);

  // 클릭된 필터 타이틀로 스크롤
  useEffect(() => {
    if (sectionTitleElement) {
      sectionTitleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [sectionTitleElement]);

  const sectionTitleRefCallback = useCallback(
    (el: HTMLElement | null) => {
      if (el?.textContent === filterSection) {
        setSectionTitleElement(el);
      }
    },
    [filterSection]
  );

  // 버튼 클릭 시 필터 값 처리하는 함수
  const handleButtonClick = (
    category: keyof typeof careerFilterDataEnglish,
    key: string,
    value: string
  ) => {
    setSelectedList(prevList => updateFilterSelection(prevList, category, key, value));
  };

  // '전체' 버튼 클릭 시 선택된 값 처리
  const handleSelectAll = (category: keyof typeof careerFilterDataEnglish) => {
    setSelectedList(prevList => selectAllFilter(prevList, category));
  };

  const handleSliderBarChangeValue = (min: number, max: number) => {
    setSelectedList(prevList => ({
      ...prevList,
      yearsMin: min,
      yearsMax: max
    }));
  };

  const isSelected = (
    category: keyof typeof careerFilterDataEnglish,
    key: string,
    value: string
  ) => {
    if (category === '직군') {
      return (selectedList[careerFilterDataEnglish[category]] as string[])?.includes(
        value
      );
    }

    return (selectedList[careerFilterDataEnglish[category]] as string[])?.includes(
      `${key}/${value}`
    );
  };

  const handleSelectListSubmit = () => {
    const transformedData = transformSelectedList(selectedList);

    saveValue(selectedList);

    onUpdate(transformedData);
    closeDialog();
  };

  const [el, openDialog, closeDialog] = useModalDialog({
    header: (
      <UseCareerFilterModalDialogHeaderText>필터</UseCareerFilterModalDialogHeaderText>
    ),
    body: (
      <UseCareerFilterModalDialogBodySectionList>
        {careerFilterTitles.map(item => {
          const { job, ...filteredData } = toJS(careerStore.filterTypeData);

          const selectedJob = (selectedList.job as string[])[0];

          const categoryList = getCategoryListByTitle(
            item.title,
            job,
            filteredData,
            selectedJob
          );

          return (
            <UseCareerFilterModalDialogBodySection key={item.id}>
              <UseCareerFilterModalDialogBodySectionTitle ref={sectionTitleRefCallback}>
                {item.title}
              </UseCareerFilterModalDialogBodySectionTitle>
              {item.title !== '경력 조건' ? (
                <UseCareerFilterModalDialogBodySectionCategoryList>
                  {item.title !== '직무' ||
                  (selectedList.job as string[])[0] !== '전체' ? (
                    <CareerFilterButton
                      text="전체"
                      value="all"
                      selected={(
                        selectedList[careerFilterDataEnglish[item.title]] as string[]
                      )?.includes('전체')}
                      onClick={() => handleSelectAll(item.title)}
                    />
                  ) : (
                    <UseCareerFilterModalDialogBodySectionCategoryEmptyText>
                      직군을 먼저 선택하면
                      <br />
                      구체적인 직무도 선택할 수 있어요.
                    </UseCareerFilterModalDialogBodySectionCategoryEmptyText>
                  )}
                  {categoryList.map((content: { key: string; value: string }) => (
                    <CareerFilterButton
                      key={content.key}
                      text={
                        item.title === '직군'
                          ? getJobTypeLabel(content.value)
                          : content.value
                      }
                      value={content.key}
                      selected={isSelected(item.title, content.key, content.value)}
                      onClick={() =>
                        handleButtonClick(item.title, content.key, content.value)
                      }
                    />
                  ))}
                </UseCareerFilterModalDialogBodySectionCategoryList>
              ) : (
                <SliderBar
                  min={0}
                  max={10}
                  minValue={Number(selectedList.yearsMin)}
                  maxValue={Number(selectedList.yearsMax)}
                  onChange={({ min, max }) => handleSliderBarChangeValue(min, max)}
                />
              )}
            </UseCareerFilterModalDialogBodySection>
          );
        })}
      </UseCareerFilterModalDialogBodySectionList>
    ),
    button: (
      <>
        {/* 선택된 필터 상태 출력 */}
        <UseCareerFilterModalDialogSelectedList>
          {Object.entries(selectedList).map(([category, values]) => {
            return category === 'yearsMax' ? null : (
              <UseCareerFilterModalDialogSelectedListItem key={category}>
                {category === 'yearsMin' ? (
                  <strong>경력</strong>
                ) : (
                  <strong>{careerFilterDataKorean[category]}</strong>
                )}{' '}
                : {formatSelectedListLabel(category, values, selectedList)}
              </UseCareerFilterModalDialogSelectedListItem>
            );
          })}
        </UseCareerFilterModalDialogSelectedList>
        <UseCareerFilterModalDialogButtonContainer>
          <CommonButton
            text="초기화"
            size="lg"
            emphasis="quaternary"
            // 초기화 버튼 클릭 시 필터 값 초기화
            onClick={() => {
              setSelectedList(prev => resetFilterSelection(prev));
            }}
          />
          <CommonButton
            text="적용"
            size="full"
            emphasis="primary"
            onClick={handleSelectListSubmit}
          />
        </UseCareerFilterModalDialogButtonContainer>
      </>
    ),
    newStyle: true
  });

  return [el, openDialog, closeDialog];
};

export default useCareerFilterModalDialog;
