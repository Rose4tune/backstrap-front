import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { BoardDetailFragment } from '@generated/graphql';

export const BoardRowUserInfo = (props: {
  board: BoardDetailFragment;
  index: number;
}) => {
  const getColor = (index: number) => (index == 3 ? '#FFFFFF' : undefined);

  return (
    <Box display={'flex'}>
      <Typography fontSize={11} color={getColor(props.index)}>
        {props.board.user?.name || '익명의 끈'}
      </Typography>
      <Typography
        fontSize={11}
        fontWeight={'bold'}
        mx={'4px'}
        color={getColor(props.index)}
      >
        |
      </Typography>
      <Typography
        fontSize={11}
        fontWeight={'bold'}
        mr={'4px'}
        color={getColor(props.index)}
      >
        {props.board.user?.school?.name || '익명의 학교'}
        {' 🎓'}
      </Typography>
    </Box>
  );
};
