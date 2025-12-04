import {
  CareerSectionContainer,
  SectionHeader,
  SectionTitle,
  SectionBody
} from './CareerSection.style';
import ThumbnailCard from '@components/careers/ThumbnailCard';
import SmallThumbnailCard from '@components/careers/SmallThumbnailCard';
import ViewAllButton from '@components/careers/ViewAllButton';
import CareersMainType from '@mock/careers/types/careersMainType';

interface CareerSectionProps {
  title: string;
  type: 'large' | 'small';
  items: CareersMainType[];
  viewAllHref?: string
}
const CareerSection = ({
  title,
  type,
  items,
  viewAllHref = '/careers/all'
}: CareerSectionProps) => {
  return (
    <CareerSectionContainer>
      <SectionHeader>
        <SectionTitle>{title}</SectionTitle>
        <ViewAllButton text={'전체보기'} href={viewAllHref} />
      </SectionHeader>
      {type === 'large' && (
        <SectionBody type={type}>
          {items.map(item => {
            // 진학프로 데이터인지 판단 (uuid가 null인 경우)
            const isJinhakData = item.uuid == null || item.uuid === '';
            const itemId = isJinhakData
              ? item.recruitmentAnnouncementLink?.split('/').pop() || ''
              : item.uuid;

            return (
              <ThumbnailCard
                key={`${title}_thumbnail_card_${itemId}`}
                data={item}
                defaultColor="grey"
              />
            );
          })}
        </SectionBody>
      )}

      {type === 'small' && (
        <SectionBody type={type}>
          {items.map(item => (
            <SmallThumbnailCard
              key={`${title}_small_thumbnail_card_${item.uuid}`}
              data={item}
            />
          ))}
        </SectionBody>
      )}
    </CareerSectionContainer>
  );
};
export default CareerSection;
