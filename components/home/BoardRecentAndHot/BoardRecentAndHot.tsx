import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';
import { Stack, useMediaQuery } from '@mui/material';
import { BoardDetailFragment, useFaGroupsQuery } from '@generated/graphql';
import { TabButton } from './components/TabButton';
import { BoardRecentAndHotRow } from './components/BoardRecentAndHotRow';
import { useBoardRecentAndHot } from '@hooks/bagstrap/board/useBoardRecentAndHot.hook';

export const BoardRecentAndHot = (props: {
  boards?: BoardDetailFragment[] | null;
  width?: string;
  useRouting?: boolean;
}) => {
  const up1280 = useMediaQuery('(min-width:1280px)');
  const PER_PAGE = 3;
  const BOARD_ITEM_HEIGHT = 125;
  const colorList = ['#8DE8E1', '#FFFFFF', '#EDEDED', '#162627'];
  const colorList2 = ['#EDEDED', '#FFFFFF', '#8DE8E1', '#162627'];

  const router = useRouter();

  const [tabIndex, setTabIndex] = useState(0);
  const { boardList, loading } = useBoardRecentAndHot(tabIndex);
  const boards = useMemo(
    () => props.boards ?? boardList.filter(Boolean),
    [props.boards, boardList]
  );

  const source = useMemo(() => {
    const _source = router.query.source;
    return Array.isArray(_source) ? _source[0] : _source;
  }, [router.query.source]);

  const faGroupsQueryResult = useFaGroupsQuery();

  const redirectToHotBoard = () => {
    const hotUUID = faGroupsQueryResult.data?.FAGroups.find((e: any) => e?.code === 'HOT')?.uuid;

    if (!hotUUID) {
      console.warn('HOT 게시판 UUID를 찾을 수 없습니다.');
      return;
    }

    router.push(`/board/${hotUUID}`);
  };

  return (
    <Stack
      width={props.width ? props.width : up1280 ? '350px' : '100%'}
      height={`${BOARD_ITEM_HEIGHT * PER_PAGE}px`}
    >
      <Box flex={1} display={'flex'} height={'20px'} mb={-10}>
        <TabButton
          tabIndex={tabIndex}
          useRouting={props?.useRouting}
          setTabIndex={setTabIndex}
          tabTitle="따끈따끈 막 나온 끈"
          onClickEvent={() => {
            if (tabIndex === 0 && props.useRouting) {
              router.push('/board/all');
            } else {
              setTabIndex(0);
            }
          }}
        />
        <TabButton
          tabIndex={tabIndex}
          useRouting={props?.useRouting}
          setTabIndex={setTabIndex}
          tabTitle="베스트끈"
          onClickEvent={() => {
            if (tabIndex === 1 && props.useRouting) {
              router.push('/board/lhokirlnwq'); //prod 버전 best uuid : 추후 수정 필요
            } else {
              setTabIndex(1);
            }
          }}
        />
      </Box>

      {loading
        ? Array.from({ length: PER_PAGE }).map((_, index) => (
            <BoardRecentAndHotRow
              key={`skeleton-${index}`}
              board={null} // 데이터 없이 Skeleton UI로 렌더링
              index={index}
              PER_PAGE={PER_PAGE}
              colorList={colorList}
              colorList2={colorList2}
              tabIndex={tabIndex}
              source={source}
            />
          ))
        : // 로딩 완료 후 데이터 렌더링
          boards
            .slice(0, PER_PAGE)
            .map((board, index) => (
              <BoardRecentAndHotRow
                key={board.uuid}
                board={board}
                index={index}
                PER_PAGE={PER_PAGE}
                colorList={colorList}
                colorList2={colorList2}
                tabIndex={tabIndex}
                source={source}
              />
            ))}
    </Stack>
  );
};
