import { useEffect, useMemo, useState } from 'react';
import { isNotNil } from '@utils/common/base.util';
import {
  BoardDetailFragment,
  BoardsDetailDocument,
  BoardsDetailQuery,
  BoardsDetailQueryVariables,
  BoardSortType
} from '@generated/graphql';
import { initializeApollo } from '@libs/apolloClient';
import Box from '@mui/material/Box';
import { ButtonBase, Stack, Typography, useMediaQuery } from '@mui/material';
import ArrowRightIconThin from '@public/icons/[board]arrow-right.svg';
import MenuIcon from '@public/icons/ic-menu.svg';
import MenuIconWhite from '@public/icons/ic-menu-white.svg';
import HeartIcon from '@public/icons/ic-small-heart.svg';
import CommentIcon from '@public/icons/ic-small-comment.svg';
import CommentIconWhite from '@public/icons/ic-small-comment-white.svg';
import { useRouter } from 'next/router';
import qs from 'qs';
import Loader from '@common/loader/loader';

export const BoardRecentAndHot = (props: {
  boards?: BoardDetailFragment[];
  width?: string;
  variant?: 'long' | 'short';
  useRouting?: boolean;
}) => {
  const up425 = useMediaQuery('(min-width:425px)');

  const INIT_PAGE = 1;
  const TOTAL_PAGE = 5;
  const PER_PAGE = props.variant == 'long' ? 4 : 3;
  const colorList = ['#8DE8E1', '#FFFFFF', '#EDEDED', '#162627'];
  const colorList2 = ['#EDEDED', '#FFFFFF', '#8DE8E1', '#162627'];
  const getColor = (index: number) => (index == 3 ? '#FFFFFF' : undefined);

  const router = useRouter();
  const [boardList, setBoardList] = useState<BoardDetailFragment[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const source = useMemo(() => {
    const _source = router.query.source;
    return Array.isArray(_source) ? _source[0] : _source;
  }, [router.query.source]);

  //todo - 탭에 따라 분기치기
  useEffect(() => {
    setLoading(true);

    const apolloClient = initializeApollo();

    apolloClient
      .query<BoardsDetailQuery, BoardsDetailQueryVariables>({
        query: BoardsDetailDocument,
        variables: {
          input: {
            paginationRequestDto: {
              count: TOTAL_PAGE * PER_PAGE
            },
            sortType: tabIndex == 1 ? BoardSortType.Popular : null
          }
        }
      })
      .catch(e => {
        console.log(e);

        return {
          data: {
            boardsByCursor: {
              data: []
            }
          }
        };
      })
      .then(boardsQueryResult => {
        if (boardsQueryResult && boardsQueryResult.data.boardsByCursor.data.length != 0) {
          setBoardList(
            boardsQueryResult.data.boardsByCursor.data as BoardDetailFragment[]
          );
        }
      })
      .catch(e => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
        setMounted(true);
      });
  }, [tabIndex, PER_PAGE]);

  const boards = useMemo(
    () => props.boards ?? boardList.filter(isNotNil),
    [props.boards, boardList]
  );

  return !mounted ? (
    <Loader />
  ) : (
    <Stack
      minWidth={props.width ? props.width : up425 ? '350px' : 0}
      height={props.variant == 'long' ? '485px' : '375px'}
    >
      <Box flex={1} display={'flex'} height={120} mb={-20}>
        <ButtonBase
          sx={{
            cursor: 'pointer',
            py: '12px',
            flex: 1,
            bgcolor: '#8DE8E1',
            borderRadius: '16px',
            alignItems: 'center'
          }}
          onClick={
            tabIndex == 0 && props.useRouting
              ? () => {
                  router.push('/board/all');
                }
              : () => {
                  setTabIndex(0);
                }
          }
        >
          <Stack height={'100%'} direction={'row'} spacing={'6px'}>
            <Typography color={'black'} fontSize={15} fontWeight={'bold'}>
              따끈따끈 막 나온 끈
            </Typography>
            {tabIndex == 0 && props.useRouting && (
              <Box sx={{ mt: '10px' }}>
                <ArrowRightIconThin />
              </Box>
            )}
          </Stack>
        </ButtonBase>

        <ButtonBase
          sx={{
            cursor: 'pointer',
            py: '12px',
            flex: 1,
            bgcolor: '#ededed',
            borderRadius: '16px',
            alignItems: 'center'
          }}
          onClick={
            tabIndex == 1 && props.useRouting
              ? () => router.push('/board/lhokirlnwq') //prod 버전 best uuid : 추후 수정 필요
              : () => {
                  setTabIndex(1);
                }
          }
        >
          <Stack height={'100%'} direction={'row'} spacing={'10px'}>
            <Typography color={'black'} fontSize={15} fontWeight={'bold'}>
              베스트끈
            </Typography>
            {tabIndex == 1 && props.useRouting && (
              <Box>
                <ArrowRightIconThin />
              </Box>
            )}
          </Stack>
        </ButtonBase>
      </Box>
      {boards.slice(0, PER_PAGE).map((board, index) => (
        <ButtonBase
          key={board.uuid}
          sx={{
            cursor: 'pointer',
            mb: index != PER_PAGE - 1 ? '-30px' : 0,
            p: '20px',
            zIndex: 1,
            bgcolor: tabIndex == 0 ? colorList.at(index) : colorList2.at(index),
            height: index != PER_PAGE - 1 ? 140 : 110,
            borderRadius: '16px'
          }}
          onClick={() => {
            router.push(`/board/post/${board.uuid}?${qs.stringify({ source })}`);
          }}
        >
          <Box width={'100%'} height={'100%'} textAlign={'start'}>
            <Box display={'flex'}>
              <Typography
                fontSize={11}
                color={getColor(index)}
                textOverflow={'ellipsis'}
                overflow={'hidden'}
                whiteSpace={'nowrap'}
              >
                {board.user?.name || '익명의 끈'}
              </Typography>
              <Typography
                fontSize={11}
                fontWeight={'bold'}
                mx={'4px'}
                color={getColor(index)}
              >
                |
              </Typography>
              <Typography
                fontSize={11}
                fontWeight={'bold'}
                mr={'4px'}
                color={getColor(index)}
                textOverflow={'ellipsis'}
                overflow={'hidden'}
                whiteSpace={'nowrap'}
              >
                {board.user?.school?.name || '익명의 학교'}
                {' 🎓'}
              </Typography>
              {/*<ArrowRightIcon/>*/}
            </Box>
            <Typography
              mt={'4px'}
              fontSize={16}
              fontWeight={'bold'}
              color={getColor(index)}
              textOverflow={'ellipsis'}
              overflow={'hidden'}
              whiteSpace={'nowrap'}
            >
              {board.title}
            </Typography>
            <Box display={'flex'} justifyContent={'space-between'} mt={'16px'}>
              <Box display={'flex'} alignItems={'center'}>
                {index == 3 ? <MenuIconWhite /> : <MenuIcon />}
                <Typography
                  fontSize={11}
                  fontWeight={'bold'}
                  ml={'4px'}
                  color={getColor(index)}
                >
                  {board.category?.name || ''}
                </Typography>
                <Typography fontSize={11} ml={'12px'} color={getColor(index)}>
                  {board.elapsedCreatedDate}
                </Typography>
              </Box>

              <Box display={'flex'} alignItems={'center'}>
                <HeartIcon />
                <Typography
                  fontSize={11}
                  fontWeight={'bold'}
                  ml={'4px'}
                  mr={'8px'}
                  color={getColor(index)}
                >
                  {board.likeCount}
                </Typography>
                {index == 3 ? <CommentIconWhite /> : <CommentIcon />}
                <Typography
                  fontSize={11}
                  fontWeight={'bold'}
                  ml={'4px'}
                  color={getColor(index)}
                >
                  {board.reviewCount}
                </Typography>
              </Box>
            </Box>
          </Box>
        </ButtonBase>
      ))}
    </Stack>
  );
};

export default BoardRecentAndHot;
