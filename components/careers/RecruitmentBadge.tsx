import { useEffect, useRef, useState } from 'react';

import {
  RecruitmentBadgeHiddenContainer,
  RecruitmentBadgeList,
  RecruitmentBadgeContainer,
  EducationsBadgeContainer,
  RecruitmentEach,
  EducationsEach,
  HiddenCount
} from './RecruitmentBadge.style';

interface RecruitmentBadgeProps {
  recruitmentTypes: { key: string; value: string }[];
  educations: { key: string; value: string }[];
}

const GAP = 4;

const RecruitmentBadge = ({
  recruitmentTypes = [],
  educations = []
}: RecruitmentBadgeProps) => {
  const wrapperRef = useRef<HTMLUListElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const plusBadgeRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState<number>(0);

  const allowedRecruitmentTypeValues = ['임용', '전문연구요원', '인턴', '산업기능요원'];
  let filteredRecruitmentTypes = recruitmentTypes.filter(t =>
    allowedRecruitmentTypeValues.some(value => t.value.includes(value))
  );

  const hasIndependentIntern = recruitmentTypes.some(t => t.value === '인턴');

  if (hasIndependentIntern) {
    const internExtras = ['전환형 인턴', '체험형 인턴'];
    const existingValues = new Set(filteredRecruitmentTypes.map(t => t.value));

    internExtras.forEach(value => {
      if (!existingValues.has(value)) {
        filteredRecruitmentTypes.push({
          key: `generated-${value}`,
          value
        });
      }
    });
  }

  const totalBadges = [
    ...filteredRecruitmentTypes.map(t => ({ ...t, type: 'type' })),
    ...educations.map(e => ({ ...e, type: 'edu' }))
  ];

  const updateVisibleCount = () => {
    const wrapper = wrapperRef.current;
    const measure = measureRef.current;
    const plusBadge = plusBadgeRef.current;
    if (!wrapper || !measure || !plusBadge) return;

    const wrapperWidth = wrapper.clientWidth;
    const children = Array.from(measure.children);
    const plusNWidth = plusBadge.offsetWidth;

    let usedWidth = 0;
    let count = 0;

    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      const width = child.offsetWidth;
      const gap = count > 0 ? GAP : 0;

      const nextUsed = usedWidth + width + gap;
      const hasHidden = i < children.length - 1;

      const totalWithPlusN = nextUsed + (hasHidden ? plusNWidth + GAP : 0);

      if (totalWithPlusN > wrapperWidth) break;

      usedWidth = nextUsed;
      count += 1;
    }

    setVisibleCount(count);
  };

  useEffect(() => {
    updateVisibleCount();

    const resizeHandler = () => updateVisibleCount();
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [recruitmentTypes, educations]);

  const visibleBadges = totalBadges.slice(0, visibleCount);
  const hiddenCount = totalBadges.length - visibleCount;

  if (totalBadges.length === 0) return null;

  return (
    <>
      <RecruitmentBadgeHiddenContainer>
        <div ref={measureRef}>
          {totalBadges.map(item =>
            item.type === 'type' ? (
              <RecruitmentBadgeContainer key={`measure-type-${item.key}`}>
                <RecruitmentEach>{item.value}</RecruitmentEach>
              </RecruitmentBadgeContainer>
            ) : (
              <EducationsBadgeContainer key={`measure-edu-${item.key}`}>
                <EducationsEach>{item.value}</EducationsEach>
              </EducationsBadgeContainer>
            )
          )}
        </div>
        <HiddenCount ref={plusBadgeRef}>+99</HiddenCount>
      </RecruitmentBadgeHiddenContainer>

      <RecruitmentBadgeList ref={wrapperRef}>
        {visibleBadges.map(item =>
          item.type === 'type' ? (
            <RecruitmentBadgeContainer key={`type-${item.key}`}>
              <RecruitmentEach>{item.value}</RecruitmentEach>
            </RecruitmentBadgeContainer>
          ) : (
            <EducationsBadgeContainer key={`edu-${item.key}`}>
              <EducationsEach>{item.value}</EducationsEach>
            </EducationsBadgeContainer>
          )
        )}
        {hiddenCount > 0 && <HiddenCount>+{hiddenCount}</HiddenCount>}
      </RecruitmentBadgeList>
    </>
  );
};

export default RecruitmentBadge;
