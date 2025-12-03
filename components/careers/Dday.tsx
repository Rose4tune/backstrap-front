import { DdayContainer } from './Dday.style';

const Dday = ({ daysLeft }: { daysLeft: number | string }) => {
  const numericDaysLeft = parseInt(daysLeft as string, 10);
  const isRed = numericDaysLeft <= 7;

  return <DdayContainer isRed={isRed}>D-{daysLeft}</DdayContainer>;
};
export default Dday;
