/** @jsxImportSource @emotion/react */

import React from 'react';

import Image from 'next/image';

import useModalDialog from '@hooks/useModalDialog.hook';

import {
  ModalContainer,
  CloseIconContainer,
  TopText,
  QrContainer,
  QrText,
  BottomText
} from './useTimeTableQrModalDialog.style';

import CloseGray from '@public/icons/close-gray.svg';
import QrImage from '@public/images/chloe_littly_qr.png';

export default function useTimeTableQrModalDialog(
  type: 'add' | 'edit' | 'easy'
): [React.ReactNode, () => void, () => void] {
  const messages = {
    add: '시간표는 가방끈 앱에서 추가할 수 있어요!',
    edit: '시간표는 가방끈 앱에서 수정할 수 있어요!',
    easy: '시간표는 앱에서 더 편하게 쓸 수 있어요!'
  };

  const [el, openDialog, closeDialog] = useModalDialog({
    body: (
      <ModalContainer>
        <CloseIconContainer onClick={() => closeDialog()}>
          <CloseGray />
        </CloseIconContainer>
        <TopText>{messages[type]}</TopText>
        <QrContainer>
          <QrText>가방끈</QrText>
          <Image src={QrImage} alt="app store qr" />
        </QrContainer>
        <BottomText>
          QR 코드를 스캔하고
          <br />
          대학원생 최대 커뮤니티 가방끈 앱을
          <br />
          다운로드하세요 :)
        </BottomText>
      </ModalContainer>
    ),
    unstyled: true,
    backgroundColor: '[rgba(0,_0,_0,_60%)]'
  });

  return [el, openDialog, closeDialog];
}
