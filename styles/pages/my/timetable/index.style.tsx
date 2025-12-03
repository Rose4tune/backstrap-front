import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const Content = styled.div<{ up625: boolean }>`
  label: content;
  display: flex;
  min-width: 336px;
  flexdirection: ${up625 => {
    return up625 ? 'row' : 'column';
  }};
`;

export const SubPanelContainer = styled.div`
  label: sub-panel;
  padding: 12px 12px 20px 12px;
  border-right: 1px solid #dbdbdb;
  width: 320px;
  display: block;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    display: none;
  }
`;

export const SubPanelWrap = styled.div`
  label: sub-panel-wrap;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const TimeTableArea = styled.div`
  label: time-table-area;
  flex-grow: 1;
  flex-basis: 0%;
  padding: 12px;
`;

export const TimeTableViewOptionsArea = styled.div`
  label: time-table-view-options-area;
  display: flex;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem;
`;

export const ViewOptionSliderArea = styled.div`
  label: view-option-slider-area;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 1rem;
`;

export const ClassTime = styled.span`
  label: class-time;
  font-size: 14px;
  margin-right: 20px;
`;

export const SliderArea = styled.div`
  label: slider-area;
  width: 320px;
  margin-right: 20px;
`;

export const Saturday = styled.span`
  label: saturday;
  font-size: 14px;
  margin-left: 10px;
  margin-right: 20px;
`;

export const ImageDownLoadButton = styled.button`
  label: image-download-button;
  font-size: 14px;
  border-width: 2px;
  border-color: #cdcdcd;
  padding: 0.375rem 0.5rem;
  border-radius: 8px;
`;

////////////// 추가 작업 //////////////

export const SubPanelTitleAndButtonContainer = styled.div`
  label: sub-panel-title-and-button-container;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SubPanelTitleIcon = styled.span`
  label: sub-panel-title-icon;
  font-size: 16px;
  font-weight: 600;
  margin-right: 4px;
`;

export const SubPanelTitle = styled.p`
  label: sub-panel-title;
  color: #424242;
  font-size: 20px;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -0.4px;
`;

export const SubPanelCreateButton = styled.button`
  label: sub-panel-create-button;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: #7d7c7c;
`;

export const OptionPanel = styled.div`
  label: option-panel;
  margin-top: 12px;
`;

export const TitleAndButtonContainer = styled.div`
  label: title-and-button-container;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    margin-bottom: 8px;
  }
`;

export const TimeTableName = styled.p`
  label: time-table-name;
  color: #424242;
  font-size: 24px;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -2%;
  display: block;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    display: none;
  }
`;

export const PageTitle = styled.p`
  label: page-title;
  color: #424242;
  font-size: 20px;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -2%;
  display: none;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    display: block;
  }
`;

export const ButtonAndIconContainer = styled.div`
  label: button-and-icon-container;
  display: flex;
  gap: 4px;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    gap: 2px;
  }
`;

export const EditIconContainer = styled.button`
  label: edit-icon-container;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
`;

export const ImageSaveButton = styled.button`
  label: image-save-button;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    display: none;
  }
`;

export const AddIconContainer = styled.button`
  label: add-icon-container;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  display: none;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    display: flex;
  }
`;

export const TimeTableListSelectContainer = styled.div`
  label: time-table-list-select-container;
  display: none;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    display: block;
  }
`;

export const TimeTableAppQrNoticeContainer = styled.div`
  display: none;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    display: block;
  }
`;

// export const Content = styled.div<{ up625: boolean }>`
//   label: content;
//   display: flex;
//   flexdirection: ${up625 => {
//     return up625 ? 'row' : 'column';
//   }};
// `;

export const SubPanel = styled.div`
  label: sub-panel;
  margin-left: 20px;
  margin-right: 20px;
`;

// export const TimeTableArea = styled.div`
//   label: time-table-area;
//   flex-grow: 1;
//   flex-basis: 0%;
// `;

// export const TimeTableViewOptionsArea = styled.div`
//   label: time-table-view-options-area;
//   display: flex;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   gap: 0.5rem;
//   margin: 1rem;
// `;

// export const ViewOptionSliderArea = styled.div`
//   label: view-option-slider-area;
//   display: flex;
//   justify-content: flex-start;
//   align-items: center;
//   margin-top: 1rem;
// `;

// export const ClassTime = styled.span`
//   label: class-time;
//   font-size: 14px;
//   margin-right: 20px;
// `;

// export const SliderArea = styled.div`
//   label: slider-area;
//   width: 320px;
//   margin-right: 20px;
// `;

// export const Saturday = styled.span`
//   label: saturday;
//   font-size: 14px;
//   margin-left: 10px;
//   margin-right: 20px;
// `;

// export const ImageDownLoadButton = styled.button`
//   label: image-download-button;
//   font-size: 14px;
//   border-width: 2px;
//   border-color: #cdcdcd;
//   padding: 0.375rem 0.5rem;
//   border-radius: 8px;
// `;
