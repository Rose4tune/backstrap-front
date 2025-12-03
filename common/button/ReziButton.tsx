import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

import useAuthPayload from '@hooks/useAuthPayload.hook';
import getReziUserToken from '@pages/api/rezi/token';
import { useStore } from '@stores/useStore.hook';
import { useAICVRedirect } from 'src/hooks/useAICVRedirect';
import useAccessToken from 'src/hooks/useAcessToken';

interface ReziButtonProps { }

function ReziButton({ }: ReziButtonProps) {
  const accessToken = useAccessToken()
  const handleClickButton = useAICVRedirect(accessToken)

  return <Button onClick={handleClickButton}>AI기반 CV메이커 체험하기</Button>;
}

export default ReziButton;

const highlight = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%
  }
  100% {
    background-position: 0% 50%
  }
`;

const Button = styled.div`
  background: linear-gradient(91.95deg, #00cbbc, #d5e8e7, #00cbbc, #d5e8e7);
  animation: ${highlight} 8s linear infinite;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  background-size: 400% 400%;
  padding: 13px 35px;
  color: white;
  font-weight: 600;
  margin-left: 110px !important;
  cursor: pointer;
  user-select: none;

  @media screen and (max-width: 1280px) {
    font-size: 14px;
    font-weight: 500;
    padding: 10px 25px;
    margin-left: 110px !important;
  }

  @media screen and (max-width: 1024px) {
    font-size: 13px;
    font-weight: 500;
    padding: 10px 20px;
    margin-left: 50px !important;
  }

  @media screen and (max-width: 768px) {
    font-size: 10px;
    font-weight: 500;
    padding: 5px 10px;
    margin-left: 5px !important;
    display: none;
  }
`;
