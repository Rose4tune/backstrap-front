import { ReactNode, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Box, ButtonBase, Stack, Typography, useMediaQuery } from '@mui/material';
import ArrowRightIconThin from '@public/icons/[board]arrow-right.svg';
import { useRouter } from 'next/router';

export const TabButton = (props: {
  tabIndex: number;
  useRouting: boolean | undefined;
  setTabIndex: (value: SetStateAction<number>) => void;
  tabTitle: string;
  onClickEvent: () => void;
}) => {
  const router = useRouter();

  return (
    <ButtonBase
      sx={{
        cursor: 'pointer',
        py: '12px',
        flex: 1,
        bgcolor: props.tabTitle === '따끈따끈 막 나온 끈' ? '#8DE8E1' : '#ededed',
        borderRadius: '16px',
        alignItems: 'center'
      }}
      onClick={props.onClickEvent}
    >
      <Stack
        height={'100%'}
        direction={'row'}
        spacing={props.tabIndex === 0 ? '6px' : '10px'}
      >
        <Typography color={'black'} fontSize={15} fontWeight={'bold'}>
          {props.tabTitle}
        </Typography>
        {(props.tabTitle === '따끈따끈 막 나온 끈' && props.tabIndex === 0) ||
        (props.tabTitle === '베스트끈' && props.tabIndex === 1) ? (
          <Box sx={{ mt: '10px' }}>
            <ArrowRightIconThin />
          </Box>
        ) : null}
      </Stack>
    </ButtonBase>
  );
};
