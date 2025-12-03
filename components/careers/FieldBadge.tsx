import { FieldBadgeContainer, FieldEach } from './FieldBadge.style';

interface FieldBadgeProps {
  field: Partial<{ [key: string]: { [key: string]: string }[] }>;
}

const FieldBadge = ({ field }: FieldBadgeProps) => {
  const values = Object.keys(field ?? {}).flatMap((key) =>
    (field?.[key] ?? [])
      .map((item) => item?.value ?? Object.values(item ?? {})[0]) // value 우선, 없으면 첫 값
      .filter((v): v is string => typeof v === 'string' && v.length > 0)
  );

  const uniqueValues = Array.from(new Set(values));

  return (
    <FieldBadgeContainer>
      <FieldEach>{uniqueValues.join(' | ')}</FieldEach>
    </FieldBadgeContainer>
  );
};
export default FieldBadge;
