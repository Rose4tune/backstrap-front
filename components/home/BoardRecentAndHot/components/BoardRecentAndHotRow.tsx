import qs from 'qs';
import Box from '@mui/material/Box';
import { Skeleton } from '@mui/material';
import { useRouter } from 'next/router';
import { ButtonBase, Typography } from '@mui/material';
import { BoardDetailFragment } from '@generated/graphql';
import MenuIcon from '@public/icons/ic-menu.svg';
import MenuIconWhite from '@public/icons/ic-menu-white.svg';
import HeartIcon from '@public/icons/ic-small-heart.svg';
import CommentIcon from '@public/icons/ic-small-comment.svg';
import CommentIconWhite from '@public/icons/ic-small-comment-white.svg';
import { BoardRowUserInfo } from './BoardRowUserInfo';

export const BoardRecentAndHotRow = (props: {
  board: BoardDetailFragment | null;
  index: number;
  colorList: string[];
  colorList2: string[];
  PER_PAGE: 4 | 3;
  tabIndex: number;
  source: string | undefined;
}) => {
  const router = useRouter();
  const getColor = (index: number) => (index == 3 ? '#FFFFFF' : undefined);
  if (!props.board) {
    return (
      <ButtonBase
        sx={{
          cursor: 'pointer',
          mb: props.index !== props.PER_PAGE - 1 ? '-30px' : 0,
          p: '20px',
          zIndex: 1,
          bgcolor:
            props.tabIndex === 0
              ? props.colorList[props.index]
              : props.colorList2[props.index],
          height: props.index !== props.PER_PAGE - 1 ? 140 : 110,
          borderRadius: '16px'
        }}
      >
        <Skeleton variant="rectangular" height="10" width="100%" />
      </ButtonBase>
    );
  } else {
    return (
      <ButtonBase
        key={props.board.uuid}
        sx={{
          cursor: 'pointer',
          mb: props.index !== props.PER_PAGE - 1 ? '-30px' : 0,
          p: '20px',
          zIndex: 1,
          bgcolor:
            props.tabIndex === 0
              ? props.colorList[props.index]
              : props.colorList2[props.index],
          height: props.index !== props.PER_PAGE - 1 ? 140 : 110,
          borderRadius: '16px'
        }}
        onClick={() => {
          props.board !== null &&
            router.push(`/board/post/${props?.board.uuid}?${qs.stringify(props.source)}`);
        }}
      >
        <Box width="100%" height="100%" textAlign="start">
          <BoardRowUserInfo board={props.board} index={props.index} />
          <Typography
            sx={{
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 1
            }}
            mt="4px"
            fontSize={16}
            fontWeight="bold"
            color={getColor(props.index)}
          >
            {props.board.title}
          </Typography>
          <Box display="flex" justifyContent="space-between" mt="16px">
            <Box display="flex" alignItems="center">
              {props.index === 3 ? <MenuIconWhite /> : <MenuIcon />}
              <Typography
                fontSize={11}
                fontWeight="bold"
                ml="4px"
                color={getColor(props.index)}
              >
                {props.board.category?.name || ''}
              </Typography>
              <Typography fontSize={11} ml="12px" color={getColor(props.index)}>
                new
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <HeartIcon />
              <Typography
                fontSize={11}
                fontWeight="bold"
                ml="4px"
                mr="8px"
                color={getColor(props.index)}
              >
                {props.board.likeCount}
              </Typography>
              {props.index === 3 ? <CommentIconWhite /> : <CommentIcon />}
              <Typography
                fontSize={11}
                fontWeight="bold"
                ml="4px"
                color={getColor(props.index)}
              >
                {props.board.reviewCount}
              </Typography>
            </Box>
          </Box>
        </Box>
      </ButtonBase>
    );
  }
};
