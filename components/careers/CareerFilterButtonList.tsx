import { useEffect, useRef, useState } from 'react';

import useCareerFilterModalDialog from '@hooks/bagstrap/careers/useCareerFilterModalDialog.hook';
import useScreenSize from '@hooks/useScreenSize.hook';

import CareerFilterButton from '@components/careers/CareerFilterButton';

import { CareerFilterButtonListContainer } from './CareerFilterButtonList.style';

type FilterSectionTypes =
  | '직군'
  | '직무'
  | '산업 유형'
  | '회사 유형'
  | '채용 유형'
  | '학력 조건'
  | '경력 조건'
  | '지역'
  | '마감 유형';

export const careerFilterTitleList: { id: number; title: FilterSectionTypes }[] = [
  {
    id: 1,
    title: '직군'
  },
  {
    id: 2,
    title: '직무'
  },
  {
    id: 3,
    title: '산업 유형'
  },
  {
    id: 4,
    title: '회사 유형'
  },
  {
    id: 5,
    title: '채용 유형'
  },
  {
    id: 6,
    title: '학력 조건'
  },
  {
    id: 7,
    title: '경력 조건'
  },
  {
    id: 8,
    title: '지역'
  },
  {
    id: 9,
    title: '마감 유형'
  }
];

const CareerFilterButtonList = ({
  onUpdate
}: {
  onUpdate: (value: Record<string, string[] | number>) => void;
}) => {
  const [filterSection, setFilterSection] = useState<FilterSectionTypes>('직군');

  const [modalDialogEl, openModalDialog] = useCareerFilterModalDialog({
    filterSection,
    onUpdate
  });

  const screenSize = useScreenSize();
  const isSmallScreen = screenSize === 'small';

  const handleOpenModal = (section: FilterSectionTypes) => {
    setFilterSection(section);
    openModalDialog();
  };

  // 스크롤 관련 상태 & ref
  const listRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [translateX, setTranslateX] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  // 리스트 크기 측정 (최대 이동 가능 거리 설정)
  useEffect(() => {
    if (listRef.current && isSmallScreen) {
      const clientWidth = listRef.current.clientWidth;
      setMaxScroll(clientWidth - 336);
    }
  }, [isSmallScreen]);

  // 드래그 시작
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isSmallScreen) return;
    isDragging.current = true;
    startX.current = 'touches' in e ? e.touches[0].pageX : e.pageX;
    scrollLeft.current = translateX;
  };

  // 드래그 이동
  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current || !isSmallScreen) return;

    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' && target.getAttribute('type') === 'range') return;

    e.preventDefault();
    const x = 'touches' in e ? e.touches[0].pageX : e.pageX;
    const move = x - startX.current;
    let newTranslateX = scrollLeft.current + move;

    // 최소 0, 최대 maxScroll을 넘지 않도록 제한
    newTranslateX = Math.max(-maxScroll, Math.min(0, newTranslateX));

    setTranslateX(newTranslateX);
  };

  // 드래그 종료
  const handleDragEnd = () => {
    if (!isSmallScreen) return;
    isDragging.current = false;
  };

  return (
    <CareerFilterButtonListContainer
      ref={listRef}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
      style={{
        transform: isSmallScreen ? `translateX(${translateX}px)` : 'none'
      }}
    >
      {careerFilterTitleList.map(item => (
        <CareerFilterButton
          key={`career_filter_button_${item.id}`}
          text={item.title}
          isArrow={true}
          onClick={() => handleOpenModal(item.title)}
        />
      ))}
      {modalDialogEl}
    </CareerFilterButtonListContainer>
  );
};

export default CareerFilterButtonList;
