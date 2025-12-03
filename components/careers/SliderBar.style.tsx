import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const SliderBarContainer = styled.div`
  label: slider-bar-container;
  position: relative;
  width: 300px;
  padding: 12px 0 32px;
`;

export const SliderBarContent = styled.div`
  label: slider-bar-content;
  position: relative;
  width: 100%;
`;

export const SliderBarTrack = styled.div`
  label: slider-bar-track;
  position: absolute;
  border-radius: 3px;
  height: 5px;
  background-color: ${emotionTheme.color.gray[200]};
  width: 100%;
  z-index: 1;
`;

export const SliderBarRange = styled.div`
  label: slider-bar-range;
  position: absolute;
  border-radius: 3px;
  height: 5px;
  background-color: ${emotionTheme.color.turqoise[300]};
  z-index: 2;
`;

export const SliderBarLeftMark = styled.div`
  label: slider-bar-left-mark;
  position: absolute;
  color: ${emotionTheme.color.gray[900]};
  font-size: 14px;
  margin-top: 16px;
`;

export const SliderBarRightMark = styled.div`
  label: slider-bar-right-mark;
  position: absolute;
  color: ${emotionTheme.color.gray[900]};
  font-size: 14px;
  margin-top: 16px;
  right: -6px;
`;

export const SliderBarThumb = styled.input`
  label: slider-bar-thumb;
  &,
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    -webkit-tap-highlight-color: transparent;
  }

  display: flex;
  align-items: center;
  pointer-events: none;
  position: absolute;
  height: 0;
  width: 100%;
  outline: none;
  z-index: 3;

  &::-webkit-slider-thumb {
    background-color: ${emotionTheme.color.white};
    border: none;
    border-radius: 50%;
    box-shadow:
      rgba(0, 0, 0, 0.2) 0px 3px 1px -2px,
      rgba(0, 0, 0, 0.14) 0px 2px 2px 0px,
      rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
    cursor: pointer;
    height: 20px;
    width: 20px;
    margin-top: 4px;
    pointer-events: all;
    position: relative;
  }

  &::-moz-range-thumb {
    background-color: ${emotionTheme.color.white};
    border: none;
    border-radius: 50%;
    box-shadow:
      rgba(0, 0, 0, 0.2) 0px 3px 1px -2px,
      rgba(0, 0, 0, 0.14) 0px 2px 2px 0px,
      rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
    cursor: pointer;
    height: 18px;
    width: 18px;
    margin-top: 4px;
    pointer-events: all;
    position: relative;
  }
`;
