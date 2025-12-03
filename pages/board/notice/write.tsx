import clsx from 'clsx';
import { useState, useMemo, useCallback } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import {
  useRegisterNoticeMutation,
  useEditNoticeMutation,
  NoticeQuery,
  NoticeQueryVariables,
  NoticeDocument,
  NoticeQueryResult
} from '@generated/graphql';
import { addInitialApolloState, initializeApollo } from '@libs/apolloClient';

import PageLayout from '@layouts/PageLayout';

import BaseButton from '@common/button/BaseButton';
import BaseTextInput from '@common/input/BaseTextInput';
import HelperMessage from '@common/bagstrap/etc/HelperMessage';

const BoardPostWriteEditor = dynamic(
  import('@common/bagstrap/board/BoardPostWriteEditor'),
  {
    ssr: false
  }
);

export interface NoticeWritePageProps {
  NoticeQueryResult: NoticeQueryResult;
}

const NoticeWritePage: NextPage<NoticeWritePageProps> = props => {
  const router = useRouter();

  const [NoticeQueryResult, setNoticeQueryResult] = useState(props.NoticeQueryResult);
  const [title, setTitle] = useState(props.NoticeQueryResult.data?.notice?.title || '');
  /*
   * stringifiedDeltaContent - 게시글 content를 stringify해서 서버에 string 형태로 저장할 때 사용하는 값
   * HTMLContent - 게시글 content의 HTML 형태의 string 값
   */
  const [stringifiedDeltaContent, setStringifiedDeltaContent] = useState(
    props.NoticeQueryResult.data?.notice?.content || ''
  );
  const [HTMLContent, setHTMLContent] = useState(
    JSON.parse(props.NoticeQueryResult.data?.notice?.content || '{}')
  );
  const [errorMessage, setErrorMessage] = useState('');

  const [registerNotice] = useRegisterNoticeMutation();
  const [editNotice] = useEditNoticeMutation();

  const uuid = useMemo(() => {
    const { uuid: _uuid } = router.query;

    return Array.isArray(_uuid) ? _uuid[0] : _uuid || '';
  }, [router.query.uuid]);

  const onUploadNotice = useCallback(() => {
    if (uuid && NoticeQueryResult.data?.notice) {
      editNotice({
        variables: {
          input: {
            uuid,
            title,
            content: stringifiedDeltaContent
          }
        },
        onCompleted: ({ editNotice }) => {
          router.replace(`/board/notice/${editNotice.uuid}`);
        },
        onError: err => {
          setErrorMessage(err.message);
        }
      });
    } else {
      setErrorMessage('');

      registerNotice({
        variables: {
          input: {
            title,
            content: stringifiedDeltaContent
          }
        },
        onCompleted: ({ registerNotice }) => {
          router.replace(`/board/notice/${registerNotice.uuid}`);
        },
        onError: err => {
          setErrorMessage(err.message);
        }
      });
    }
  }, [
    uuid,
    NoticeQueryResult.data?.notice,
    title,
    stringifiedDeltaContent,
    router,
    editNotice,
    registerNotice,
    setErrorMessage
  ]);

  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://www.bagstrap.team/board/notice/write"
          key="canonical"
        />
      </Head>

      <PageLayout authRequired>
        {router.isReady && (
          <>
            <div
              className={clsx(
                'relative h-full',
                'max-w-screen-lg mx-auto',
                'px-3 py-2 space-y-2',
                'lg:h-12 lg:px-0 lg:py-4 lg:space-y-0 lg:flex lg:items-center lg:gap-3'
              )}
            >
              <div
                className={clsx(
                  'flex flex-col gap-2',
                  'sm:flex-row sm:items-center',
                  'lg:gap-3'
                )}
              >
                {errorMessage && (
                  <HelperMessage
                    type="error"
                    text={errorMessage}
                    responsive
                    className="underline"
                  />
                )}

                <BaseButton
                  onClick={onUploadNotice}
                  className={clsx(
                    'absolute top-2 right-3',
                    'border border-black rounded-[4px] h-8 px-[18px]',
                    'typo-body7 font-bold',
                    'lg:top-0 lg:right-0 lg:border-[#E5E5EB] lg:border-t-0 lg:rounded-none lg:h-12 lg:px-[46px] lg:typo-body5 lg:tracking-widest'
                  )}
                >
                  업로드
                </BaseButton>
              </div>
            </div>

            <div
              className={clsx(
                'max-w-screen-lg mx-auto',
                'px-3 space-y-2',
                'lg:px-0 lg:space-y-3'
              )}
            >
              <BaseTextInput
                value={title}
                onChange={evt => {
                  setTitle(evt.target.value);
                }}
                placeholder="제목을 입력하세요"
                maxLength={255}
                inputProps={{
                  className: clsx(
                    'border border-grey2 h-12',
                    '!typo-body3 !font-bold',
                    'placeholder:text-grey2',
                    'lg:h-[70px] lg:!typo-header2'
                  )
                }}
              />
              <BoardPostWriteEditor
                HTMLContent={HTMLContent}
                stringifiedDeltaContent={stringifiedDeltaContent}
                onChangeHTMLContent={HTMLContent => {
                  setHTMLContent(HTMLContent);
                }}
                onChangeStringifiedDeltaContent={content => {
                  setStringifiedDeltaContent(content);
                }}
              />
            </div>
          </>
        )}
      </PageLayout>
    </>
  );
};

export async function getServerSideProps(ctx: { query: { uuid?: string } }) {
  const { uuid } = ctx.query;

  const apolloClient = initializeApollo();

  const NoticeQueryResult = await apolloClient
    .query<NoticeQuery, NoticeQueryVariables>({
      query: NoticeDocument,
      variables: {
        uuid
      }
    })
    .catch(error => {
      console.log(error);

      return {
        data: {
          notice: null
        }
      };
    });

  return {
    props: addInitialApolloState(apolloClient, {
      NoticeQueryResult
    })
  };
}

export default NoticeWritePage;
