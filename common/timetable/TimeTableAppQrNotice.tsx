import Image from 'next/image';

import {
  Container,
  TextContainer,
  TopText,
  BottomText
} from './TimeTableAppQrNotice.style';

import QrImage from '@public/images/chloe_littly_qr.png';

function TimeTableAppQrNotice() {
  return (
    <Container>
      <TextContainer>
        <TopText>가방끈 앱에서 시간표를 만들어보세요!</TopText>
        <BottomText>시간표 생성 및 수정은 앱에서만 가능합니다.</BottomText>
      </TextContainer>
      <Image src={QrImage} alt="app store qr" width={46} height={46} />
    </Container>
  );
}

export default TimeTableAppQrNotice;
