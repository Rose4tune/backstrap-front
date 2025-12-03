/** @jsxImportSource @emotion/react */

import Image from 'next/image';

import {
  NoTimeTableQrNoticeArea,
  WhiteOpacityBackground,
  NoTimeTableQrNoticeBox,
  NoticeTextArea,
  MainNotice,
  NoticeDescription,
  QrContainer
} from './NoTimeTableQrNotice.style';
import QrImage from '@public/images/chloe_littly_qr.png';

interface NoTimeTableQrNoticeProps {}

const NoTimeTableQrNotice = ({}: NoTimeTableQrNoticeProps) => {
  return (
    <NoTimeTableQrNoticeArea>
      <WhiteOpacityBackground />

      <NoTimeTableQrNoticeBox>
        <NoticeTextArea>
          <MainNotice>시간표가 없습니다.</MainNotice>
          <NoticeDescription>
            가방끈 앱을 다운로드하고
            <br />
            시간표를 만들어보세요!
          </NoticeDescription>
        </NoticeTextArea>

        <QrContainer>
          <Image src={QrImage} alt="app store qr" />
        </QrContainer>
      </NoTimeTableQrNoticeBox>
    </NoTimeTableQrNoticeArea>
  );
};

export default NoTimeTableQrNotice;
