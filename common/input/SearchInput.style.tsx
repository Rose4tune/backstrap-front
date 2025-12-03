import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const SearchInputContainer = styled.div`
  label: search-input-container;
  position: relative;
  width: fit-content;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    width: 100%;
  }
`;

export const SearchInputText = styled.input`
  label: search-input-text;
  height: 48px;
  width: 480px;
  border: 1px solid ${emotionTheme.color.gray[300]};
  border-radius: 12px;
  padding-left: 48px;
  padding-right: 48px;
  color: ${emotionTheme.color.gray[900]};
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    width: 100%;
    height: 44px;
    padding-left: 40px;
    font-size: 14px;
    line-height: 20px;
  }

  &::placeholder {
    color: ${emotionTheme.color.gray[300]};
  }

  &:focus {
    border: 1px solid ${emotionTheme.color.turqoise[600]};
  }
`;

export const SearchInputSearchIconContainer = styled.span`
  label: search-input-search-icon-container;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 12px;
  width: 24px;
  height: 24px;
  cursor: pointer;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    left: 8px;
  }
`;

export const SearchInputCloseIconContainer = styled.button`
  label: search-input-close-icon-container;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 4px;
  width: 40px;
  height: 40px;
  border-radius: 8px;

  &:hover {
    background-color: ${emotionTheme.color.black2};
  }

  &:active {
    background-color: ${emotionTheme.color.black3};
  }
`;
