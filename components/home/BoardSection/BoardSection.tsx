import Box from '@mui/material/Box';
import AuthContext from '@contexts/auth.context';
import { Grid, Link, List, Typography, useMediaQuery } from '@mui/material';
import WriteIcon from '@public/icons/[board]write.svg';
import React from 'react';
import { BoardSummaryFragment, FaGroupSummaryFragment } from '@generated/graphql';
import ArrowRightIcon from '@public/icons/arrow-right.svg';
import BaseLink from '@common/BaseLink';
import { BOARD_VERSION_NEW } from '@constants/bagstrap/board.constant';
import { BoardSectionRow } from './components/BoardSectionRow';

export const BoardSection = ({
  boards
}: {
  boards: { group: FaGroupSummaryFragment, boards: BoardSummaryFragment[] }[];
}) => {
  const up425 = useMediaQuery('(min-width:425px)');

  const LEN = 5;

  const BoardGroup = ({
    group,
    boards
  }: {
    group: FaGroupSummaryFragment;
    boards: BoardSummaryFragment[];
  }) => (
    <Grid item lg={4} md={6} xs={12}>
      <Box display={'flex'} mt={'14px'} gap={'24px'} alignItems={'center'}>
        <Typography fontSize={'22px'} fontWeight={'bold'}>
          {group.name}
        </Typography>
        <Link href={`/board/${group.uuid}`} underline={'none'} color={'inherit'}>
          <Box display={'flex'} alignItems={'center'}>
            <Typography fontSize={'15px'} mr={'6px'}>
              더보기
            </Typography>
            <ArrowRightIcon />
          </Box>
        </Link>
      </Box>

      {boards.length === 0 ? (
        <div className="h-[184px] md:h-[218px] flex-center flex-col">
          <BaseLink
            className="flex-center flex-col gap-4"
            href={`/board/post/write?category=${group.uuid}`}
          >
            <WriteIcon />
            <p className="typo-body6 font-light text-grey3">첫 글을 작성해보세요</p>
          </BaseLink>
        </div>
      ) : (
        <Box
          width={'100%'}
          mt={up425 ? '20px' : '16px'}
          borderRadius={'16px'}
          border={1}
          borderColor={'#E2E2E2'}
        >
          <List disablePadding>
            {boards.slice(0, LEN).map((board, index) => {
              let content: string | null | undefined = board.content;

              let imageUrl: string | null | undefined;
              if (board.version == BOARD_VERSION_NEW) {
                const dataList: Array<{ insert: { image?: string } }> = JSON.parse(
                  board.content
                );
                content = dataList.find(obj => !obj.insert.image)?.insert.toString();
                for (let data of dataList) {
                  if (data.insert.image && data.insert.image != null) {
                    imageUrl = data.insert.image;
                  }
                }
              } else {
                imageUrl = board.files?.[0]?.file?.url;
              }

              return (
                <BoardSectionRow
                  key={'boardSectionRow_' + index}
                  index={index}
                  group={group}
                  board={board}
                  imageUrl={imageUrl}
                  content={content}
                />
              );
            })}
          </List>
        </Box>
      )}
    </Grid>
  );

  return (
    <Grid container mt={up425 ? '24px' : '0px'} spacing={up425 ? '12px' : '4px'}>
      {boards?.map((boardData, idx) => (
        <React.Fragment key={idx}>
          <BoardGroup group={boardData.group} boards={boardData.boards} />
          {!up425 && <Box height={'8px'} width={'100%'} />}
        </React.Fragment>
      ))}
    </Grid>
  );
};
