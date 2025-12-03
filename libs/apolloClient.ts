import { useMemo } from 'react';
import { GetServerSidePropsResult } from 'next';

import { parse } from 'cookie';
import deepMerge from 'deepmerge';
import isEqual from 'lodash/isEqual';

import {
  BoardsQuery,
  QueryBoardsByCursorArgs,
  ReviewsQuery,
  QueryReviewsByCursorArgs,
  RoomsQuery,
  QueryRoomsByCursorArgs,
  UserNotificationsQuery,
  QueryUserNotificationsByCursorArgs,
  UserMessagesQuery,
  QueryUserMessagesByCursorArgs,
  NoticesListQuery,
  QueryNoticesByCursorArgs
} from '@generated/graphql';

import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

import { isNotNil } from '@utils/common/base.util';
import { generateHttpAuthorizationHeader } from '@utils/common/http.util';

import { CookieSchema, COOKIE_NS } from '@constants/common/cookie.constant';

import { errorVar, setErrorUnauthorizedAction } from '@vars/error.var';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

const GQL_API_ENDPOINT = process.env.NEXT_PUBLIC_GQL_API_ENDPOINT;

// console.log(GQL_API_ENDPOINT);

let apolloClient: ApolloClient<any>;

const mergeField = <E = any, I = any>(existing: E, incoming: I) =>
  existing && incoming
    ? deepMerge(existing, incoming, {
        arrayMerge: (target, source) =>
          target.map(t => source.find(s => s.uuid === t.uuid) ?? t)
      })
    : incoming ?? existing;

const authLink = setContext((ctx, { headers }) => {
  if (process.env.NODE_ENV !== 'production') {
    // console.log('[CSR]', ctx.operationName, ctx.variables);
  }

  const cookie = parse(document.cookie);

  if (cookie == null || !cookie[COOKIE_NS]) {
    return {
      headers: {
        ...headers,
        platform: 'IOS'
      }
    };
  }

  const cookieClientVal: CookieSchema[typeof COOKIE_NS] = JSON.parse(cookie[COOKIE_NS]);

  return {
    headers: {
      ...headers,
      Authorization: generateHttpAuthorizationHeader(cookieClientVal?.authPayload),
      platform: 'IOS'
    }
  };
});

const authLinkSSR = setContext((ctx, { headers }) => {
  // console.log('[SSR]', ctx.operationName, ctx.variables);

  return {
    headers: {
      ...headers,
      Authorization: 'SSR',
      platform: 'IOS'
    }
  };
});

const httpLink = new HttpLink({
  uri: GQL_API_ENDPOINT, // Server URL (must be absolute)
  credentials: 'same-origin' // Additional fetch() options like `credentials` or `headers`
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  console.log('[ON ERROR]');

  // 1. graphql error(s)
  if (graphQLErrors) {
    console.log(graphQLErrors);

    for (const err of graphQLErrors) {
      if (err.extensions?.code === 401) {
        if (!['verifyCode'].includes(operation.operationName)) {
          setErrorUnauthorizedAction();
        }
      }
    }
  }

  // 2. network error
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }

  return forward(operation);
});

const inMemoryCache = new InMemoryCache({
  typePolicies: {
    NoticeEntityView: {
      keyFields: ['uuid']
    },
    BoardEntityView: {
      keyFields: ['uuid'],
      fields: {
        vote: {
          merge: mergeField
        },
        files: {
          merge: mergeField
        }
      }
    },
    FAGroupEntityView: {
      keyFields: ['uuid']
    },
    Query: {
      fields: {
        noticesByCursor: {
          keyArgs: false,
          merge(
            existing: NoticesListQuery['noticesByCursor'] | undefined,
            incoming: NoticesListQuery['noticesByCursor'] | undefined,
            { args }: { args: QueryNoticesByCursorArgs | null }
          ) {
            const existingData = existing?.data ?? [];
            const incomingData = incoming?.data ?? [];

            const merged = {
              ...existing,
              ...incoming,
              data: existingData
            };

            const cursor = args?.fetchDto?.paginationRequestDto?.cursor;

            if (cursor) {
              merged.data = [...merged.data, ...incomingData];
            } else {
              merged.data = [...incomingData];
            }

            return merged;
          },
          read(
            existing: NoticesListQuery['noticesByCursor'] | undefined,
            { args }: { args: QueryNoticesByCursorArgs | null }
          ) {
            const existingData = existing?.data ?? [];
            const cursor = args?.fetchDto?.paginationRequestDto?.cursor;

            if (cursor) {
              const cursorIdx = existingData
                .filter(isNotNil)
                .findIndex(notice => notice.uuid === cursor);

              if (cursorIdx + 1 == existingData.length) {
                return existing;
              }
            }
          }
        },
        boardsByCursor: {
          keyArgs: (args: QueryBoardsByCursorArgs | null) => {
            const { paginationRequestDto, ...fetchDto } = args?.fetchDto ?? {};
            return JSON.stringify(fetchDto);
          },
          merge(
            existing: BoardsQuery['boardsByCursor'] | undefined,
            incoming: BoardsQuery['boardsByCursor'] | undefined,
            { args }: { args?: QueryBoardsByCursorArgs | null }
          ) {
            const existingData = existing?.data ?? [];
            const incomingData = incoming?.data ?? [];

            const merged = {
              ...existing,
              ...incoming,
              data: existingData
            };

            const cursor = args?.fetchDto?.paginationRequestDto?.cursor;

            if (cursor) {
              const cursorIdx = merged.data
                .filter(isNotNil)
                .findIndex(board => board.uuid === cursor);

              merged.data = [
                ...merged.data.slice(0, cursorIdx < 0 ? undefined : cursorIdx + 1),
                ...incomingData
              ];
            } else {
              merged.data = [...incomingData];
            }

            return merged;
          },
          read(existing) {
            return existing;
          }
        },
        reviewsByCursor: {
          keyArgs: (args?: QueryReviewsByCursorArgs | null) => {
            const { paginationRequestDto, ...fetchDto } = args?.fetchDto ?? {};

            return JSON.stringify(fetchDto);
          },
          merge(
            existing: ReviewsQuery['reviewsByCursor'] | undefined,
            incoming: ReviewsQuery['reviewsByCursor'] | undefined,
            { args }: { args?: QueryReviewsByCursorArgs | null }
          ) {
            const existingData = existing?.data ?? [];
            const incomingData = incoming?.data ?? [];

            const merged = {
              ...existing,
              ...incoming,
              data: existingData
            };

            const cursor = args?.fetchDto?.paginationRequestDto?.cursor?.uuid;

            if (cursor) {
              const cursorIdx = merged.data
                .filter(isNotNil)
                .findIndex(review => review.uuid === cursor);

              merged.data = [
                ...merged.data.slice(0, cursorIdx < 0 ? undefined : cursorIdx + 1),
                ...incomingData
              ];
            } else {
              merged.data = [...incomingData];
            }

            return merged;
          },
          read(existing) {
            return existing;
          }
        },
        roomsByCursor: {
          keyArgs: (args?: QueryRoomsByCursorArgs | null) => {
            const { paginationRequestDto, ...fetchDto } = args?.fetchDto ?? {};

            return JSON.stringify(fetchDto);
          },
          merge(
            existing: RoomsQuery['roomsByCursor'] | undefined,
            incoming: RoomsQuery['roomsByCursor'] | undefined,
            { args }: { args?: QueryRoomsByCursorArgs | null }
          ) {
            const existingData = existing?.data ?? [];
            const incomingData = incoming?.data ?? [];

            const merged = {
              ...existing,
              ...incoming,
              data: existingData
            };

            const cursor = args?.fetchDto?.paginationRequestDto?.cursor;

            if (cursor) {
              const cursorIdx = merged.data
                .filter(isNotNil)
                .findIndex(room => room.uuid === cursor);

              merged.data = [
                ...merged.data.slice(0, cursorIdx < 0 ? undefined : cursorIdx + 1),
                ...incomingData
              ];
            } else {
              merged.data = [...incomingData];
            }

            return merged;
          },
          read(existing) {
            return existing;
          }
        },
        userNotificationsByCursor: {
          keyArgs: (args?: QueryUserNotificationsByCursorArgs | null) => {
            const { paginationRequestDto, ...fetchDto } = args?.fetchDto ?? {};

            return JSON.stringify(fetchDto);
          },
          merge(
            existing: UserNotificationsQuery['userNotificationsByCursor'] | undefined,
            incoming: UserNotificationsQuery['userNotificationsByCursor'] | undefined,
            { args }: { args?: QueryUserNotificationsByCursorArgs | null }
          ) {
            const existingData = existing?.data ?? [];
            const incomingData = incoming?.data ?? [];

            const merged = {
              ...existing,
              ...incoming,
              data: existingData
            };

            const cursor = args?.fetchDto?.paginationRequestDto?.cursor;

            if (cursor) {
              const cursorIdx = merged.data
                .filter(isNotNil)
                .findIndex(userNotification => userNotification.uuid === cursor);

              merged.data = [
                ...merged.data.slice(0, cursorIdx < 0 ? undefined : cursorIdx + 1),
                ...incomingData
              ];
            } else {
              merged.data = [...incomingData];
            }

            return merged;
          },
          read(existing) {
            return existing;
          }
        },
        userMessagesByCursor: {
          keyArgs: (args?: QueryUserMessagesByCursorArgs | null) => {
            const { paginationRequestDto, ...fetchDto } = args?.fetchDto ?? {};

            return JSON.stringify(fetchDto);
          },
          merge(
            existing: UserMessagesQuery['userMessagesByCursor'] | undefined,
            incoming: UserMessagesQuery['userMessagesByCursor'] | undefined,
            { args }: { args?: QueryUserMessagesByCursorArgs | null }
          ) {
            const existingData = existing?.data ?? [];
            const incomingData = incoming?.data ?? [];

            const merged = {
              ...existing,
              ...incoming,
              data: existingData
            };

            const cursor = args?.fetchDto?.paginationRequestDto?.cursor;

            if (cursor) {
              const cursorIdx = merged.data
                .filter(isNotNil)
                .findIndex(room => room.uuid === cursor);

              merged.data = [
                ...merged.data.slice(0, cursorIdx < 0 ? undefined : cursorIdx + 1),
                ...incomingData
              ];
            } else {
              merged.data = [...incomingData];
            }

            return merged;
          },
          read(existing) {
            return existing;
          }
        },
        errors: {
          read() {
            return errorVar();
          }
        }
      }
    }
  }
});

function createApolloClient() {
  const ssrMode = typeof window === 'undefined';

  return new ApolloClient({
    ssrMode,
    link: from([
      errorLink,
      ssrMode ? authLinkSSR : authLink,
      // retryLink,
      httpLink
    ]),
    ssrForceFetchDelay: ssrMode ? undefined : 1,
    cache: inMemoryCache,
    defaultOptions: ssrMode
      ? {
          query: {
            fetchPolicy: 'no-cache'
          }
        }
      : undefined
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();
  // console.log(initialState)
  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = deepMerge(initialState, existingCache, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter(d => sourceArray.every(s => !isEqual(d, s)))
      ]
    });

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function addInitialApolloState<P>(
  client: ApolloClient<any>,
  props?: P & { [APOLLO_STATE_PROP_NAME]?: any }
): P {
  if (props) {
    props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return Object.assign({}, props);
}

export function addServerSideApolloState<P>(
  client: ApolloClient<any>,
  pageProps?: {
    props?: P & { [APOLLO_STATE_PROP_NAME]?: any };
    revalidate?: number;
  }
): GetServerSidePropsResult<P & { [APOLLO_STATE_PROP_NAME]?: any }> {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return Object.assign(
    { props: {} },
    {
      props: pageProps?.props
    }
  );
}

export function useApollo(pageProps: any) {
  const state = pageProps[APOLLO_STATE_PROP_NAME];

  const store = useMemo(() => initializeApollo(state), [state]);

  return store;
}
