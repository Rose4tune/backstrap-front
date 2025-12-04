import styled from '@emotion/styled';

export const CareersDetailPagePositionContainer = styled.div`
  label: careers-detail-page-position-container;
  display: flex;
  justify-content: space-between;
  padding-top: 12px;

  @media (max-width: 550px) {
    flex-direction: column-reverse;
  }
`;

export const CareersDetailPageFloatingApplyPanelContainer = styled.div`
  label: careers-detail-page-floating-apply-panel-container;
  position: sticky;
  width: 340px;
  flex-shrink: 0;
  top: calc(86px + 32px);
  height: fit-content;

  @media (max-width: 550px) {
    position: static;
  }
`;

export const CareersDetailPageFloatingApplyButtonContainer = styled.div`
  label: careers-detail-page-floating-apply-button-container;
  display: block;

  @media (max-width: 550px) {
    display: none;
  }
`;

export const CareersDetailPageFooterApplyButtonContainer = styled.div`
  label: careers-detail-page-footer-apply-button-container;
  display: none;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 30px 20px;
  background-color: #fff;
  z-index: 1;

  @media (max-width: 550px) {
    display: block;
  }
`;
