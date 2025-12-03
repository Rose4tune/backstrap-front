import { useEffect, useState } from 'react';
import { BoardEntityView, BoardsDocument, BoardSortType, BoardsQuery, BoardsQueryVariables } from '@generated/graphql';
import { useApolloClient } from '@hooks/useApolloClient';
import { useStore } from '@stores/useStore.hook';

export const useBoardRecentAndHot = (tabIndex: number) => {
  const [boardList, setBoardList] = useState<BoardEntityView[]>([]);
  const [loading, setLoading] = useState(true);

  const apolloClient = useApolloClient();
  const { BoardStore } = useStore();

  useEffect(() => {
    setLoading(true);

    apolloClient
      .query<BoardsQuery, BoardsQueryVariables>({
        query: BoardsDocument,
        variables: {
          input: {
            paginationRequestDto: {
              count: BoardStore.count
            },
            sortType: tabIndex === 1 ? BoardSortType.Popular : null
          }
        }
      })
      .then(boardsQueryResult => {
        if (!boardsQueryResult?.data.boardsByCursor.data.length) return;

        const filteredData = boardsQueryResult.data.boardsByCursor.data.filter(
          board => board !== null
        );
        BoardStore.setList(filteredData as BoardEntityView[]);
        setBoardList(filteredData as BoardEntityView[]);

      })
      .catch(e => {
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [BoardStore, apolloClient, tabIndex]);

  return { boardList, loading };
};
