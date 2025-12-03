import { useCallback, useEffect, useRef } from 'react';

import {
  SliderBarContainer,
  SliderBarContent,
  SliderBarTrack,
  SliderBarRange,
  SliderBarLeftMark,
  SliderBarRightMark,
  SliderBarThumb
} from './SliderBar.style';

interface SliderBarProps {
  min: number;
  max: number;
  minValue: number;
  maxValue: number;
  onChange: (value: { min: number; max: number }) => void;
}

const SliderBar = ({ min, max, minValue, maxValue, onChange }: SliderBarProps) => {
  const range = useRef<HTMLDivElement | null>(null);

  const getPercent = useCallback(
    (val: number) => Math.round(((val - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    const minPercent = getPercent(minValue);
    const maxPercent = getPercent(maxValue);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minValue, maxValue, getPercent]);

  return (
    <SliderBarContainer>
      <SliderBarThumb
        type="range"
        min={min}
        max={max}
        value={minValue}
        onChange={event => {
          const newMin = Math.min(Number(event.target.value), maxValue);
          onChange({ min: newMin, max: maxValue });
        }}
      />
      <SliderBarThumb
        type="range"
        min={min}
        max={max}
        value={maxValue}
        onChange={event => {
          const newMax = Math.max(Number(event.target.value), minValue);
          onChange({ min: minValue, max: newMax });
        }}
      />

      <SliderBarContent>
        <SliderBarTrack />
        <SliderBarRange ref={range} />
        <SliderBarLeftMark>
          {minValue === 0 ? '신입' : minValue === 10 ? '10년+' : `${minValue}년`}
        </SliderBarLeftMark>
        <SliderBarRightMark>
          {maxValue === 0 ? '신입' : maxValue === 10 ? '10년+' : `${maxValue}년`}
        </SliderBarRightMark>
      </SliderBarContent>
    </SliderBarContainer>
  );
};

export default SliderBar;
