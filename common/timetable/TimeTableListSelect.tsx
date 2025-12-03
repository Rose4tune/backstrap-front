/** @jsxImportSource @emotion/react */

import Overlay, { OverlayPosition } from 'elements/Overlay';
import { useCallback, useRef, useState, useEffect } from 'react';

import useTimeTableContext from '@hooks/context/useTimeTableContext.hook';

import {
  TimeTableSelectContainer,
  SelectButton,
  SelectButtonText,
  SelectButtonIconContainer,
  StarIcon,
  PolygonIconContainer,
  StyledPolygonIcon
} from './TimeTableListSelect.style';

import Star from 'public/icons/star.svg';
import PolygonIcon from '@public/icons/[board]polygon.svg';
import MobileTimeTableList from './MobileTimeTableList';
import TimeTableSkeleton from './TimeTableSkeleton';
import { useStore } from '@stores/useStore.hook';

function TimeTableListSelect() {
  const { currentTimeTable, timeTableTemplates, loading } = useTimeTableContext();
  const { MeStore } = useStore();
  const isLogin = !MeStore.isEmpty();

  const inputRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [buttonWidth, setButtonWidth] = useState<number | null>(null);

  const updateButtonWidth = useCallback(() => {
    if (inputRef.current) {
      setButtonWidth(inputRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver(updateButtonWidth);
    if (inputRef.current) {
      observer.observe(inputRef.current);
    }

    updateButtonWidth();

    return () => {
      observer.disconnect();
    };
  }, [updateButtonWidth]);

  const onHideSelectList = useCallback(() => {
    setOpen(false);
  }, []);

  const handleShowSelectList = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  return (
    <TimeTableSelectContainer>
      <SelectButton
        open={open}
        ref={inputRef}
        onClick={handleShowSelectList}
        isLogin={isLogin}
      >
        <SelectButtonText isLogin={isLogin}>
          {isLogin === false ? (
            '로그인 후 이용해주세요'
          ) : loading ? (
            <TimeTableSkeleton />
          ) : currentTimeTable === undefined ? (
            '시간표를 선택해주세요'
          ) : (
            currentTimeTable?.name
          )}
        </SelectButtonText>
        <SelectButtonIconContainer>
          {currentTimeTable?.isFavorite && <StarIcon as={Star} />}
          <PolygonIconContainer>
            <StyledPolygonIcon as={PolygonIcon} />
          </PolygonIconContainer>
        </SelectButtonIconContainer>
      </SelectButton>
      {timeTableTemplates.length > 0 && (
        <Overlay
          show={open}
          target={inputRef.current}
          placement={OverlayPosition.BOTTOM}
          onHide={onHideSelectList}
          rootClose
          marginY={2}
        >
          <MobileTimeTableList
            open={open}
            buttonWidth={buttonWidth}
            inputRef={inputRef}
            onHideSelectList={onHideSelectList}
            handleShowSelectList={handleShowSelectList}
          />
        </Overlay>
      )}
    </TimeTableSelectContainer>
  );
}

export default TimeTableListSelect;
