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
}
const CareerSection = ({ title, type, items }: CareerSectionProps) => {
  return (
    <CareerSectionContainer>
      <SectionHeader>
        <SectionTitle>{title}</SectionTitle>
        <ViewAllButton text={'전체보기'} href={`/careers/all`} />
      </SectionHeader>
      {type === 'large' && (
        <SectionBody type={type}>
          {items.map(item => (
            <ThumbnailCard
              key={`${title}_thumbnail_card_${item.uuid}`}
              data={item}
              defaultColor="grey"
            />
          ))}
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
