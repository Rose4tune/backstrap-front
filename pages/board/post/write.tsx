import clsx from 'clsx';
import { useState, useEffect, useRef } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import { isNotNil } from '@utils/common/base.util';

import { BOARD_VERSION_NEW, BOARD_VERSION_OLD } from '@constants/bagstrap/board.constant';

import {
  useBoardQuery,
  useEditBoardMutation,
  useRegisterBoardMutation,
  VoteRegisterDtoInput
} from '@generated/graphql';

import PageLayout from '@layouts/PageLayout';

import BaseButton from '@common/button/BaseButton';
import BaseTextInput from '@common/input/BaseTextInput';
import BoardCategorySelectionButton from '@common/bagstrap/board/BoardCategorySelectionButton';
import BoardPostVoteRegisterButton from '@common/bagstrap/board/BoardPostVoteRegisterButton';
import BoardPostWriteAnonymousSwitchButton from '@common/bagstrap/board/BoardPostWriteAnonymousSwitchButton';
import HelperMessage from '@common/bagstrap/etc/HelperMessage';
import ReactQuill from 'react-quill';

const BoardPostWriteEditor = dynamic(
  import('@common/bagstrap/board/BoardPostWriteEditor'),
  {
    ssr: false
  }
);

const BoardPostWritePage: NextPage = () => {
  const router = useRouter();
  const ref = useRef<ReactQuill>(null);

  const { category: _category, uuid: _uuid } = router.query;

  const category = Array.isArray(_category) ? _category[0] : _category;
  const uuid = Array.isArray(_uuid) ? _uuid[0] : _uuid || '';

  const [isAnonymous, setIsAnonymous] = useState(false);
  const [categoryUuid, setCategoryUuid] = useState(category);
  const [title, setTitle] = useState('');
  /*
   * stringifiedDeltaContent - 게시글 content를 stringify해서 서버에 string 형태로 저장할 때 사용하는 값
   * HTMLContent - 게시글 content의 HTML 형태의 string 값
   */
  const [stringifiedDeltaContent, setStringifiedDeltaContent] = useState('');
  const [HTMLContent, setHTMLContent] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{ uuid: string; url: string }[]>([]);
  const [voteRegisterDto, setVoteRegisterDto] = useState<
    VoteRegisterDtoInput | undefined
  >(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const boardQueryResult = useBoardQuery({
    variables: {
      uuid
    },
    skip: !uuid
  });

  const [registerBoard] = useRegisterBoardMutation();
  const [editBoard] = useEditBoardMutation();

  useEffect(() => {
    if (boardQueryResult.data) {
      if (boardQueryResult.data.board.version === BOARD_VERSION_OLD) {
        router.replace(`/board/post/${boardQueryResult.data.board.uuid}`);
      } else {
        !title && setTitle(boardQueryResult.data.board.title);
        !stringifiedDeltaContent &&
          setStringifiedDeltaContent(boardQueryResult.data.board.content);
        !HTMLContent &&
          setHTMLContent(JSON.parse(boardQueryResult.data.board.content || '{}'));
        boardQueryResult.data.board.category?.uuid &&
          setCategoryUuid(boardQueryResult.data.board.category.uuid);
        setIsAnonymous(boardQueryResult.data.board.isAnonymous);
        boardQueryResult.data.board.vote &&
          setVoteRegisterDto({
            title: boardQueryResult.data.board.vote.title,
            numChoice: boardQueryResult.data.board.vote.numChoice,
            deadline: boardQueryResult.data.board.vote.deadline,
            contents: boardQueryResult.data.board.vote.contents
              .filter(isNotNil)
              .map(content => content.content || '')
          });
      }
    }
  }, [boardQueryResult.data]);

  useEffect(() => {
    if (category) {
      setCategoryUuid(category);
    }
  }, [category]);

  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://www.bagstrap.team/board/post/write"
          key="canonical"
        />
      </Head>

      <PageLayout authRequired>
        {router.isReady && (
          <>
            <div
              className={clsx(
                'relative',
                'max-w-screen-lg mx-auto',
                'px-3 py-2 space-y-2',
                'lg:px-0 lg:py-4 lg:space-y-0 lg:flex lg:items-center lg:gap-3'
              )}
            >
              <div
                className={clsx(
                  'flex flex-col gap-2',
                  'sm:flex-row sm:items-center',
                  'lg:gap-3'
                )}
              >
                <div>
                  <BoardCategorySelectionButton
                    groupUuid={categoryUuid}
                    onSelect={groupUuid => {
                      setCategoryUuid(groupUuid);
                      setErrorMessage(undefined);
                    }}
                  />
                </div>
                <div className={clsx('flex items-center gap-1', 'sm:gap-2', 'lg:gap-3')}>
                  {(!uuid || voteRegisterDto) && (
                    <BoardPostVoteRegisterButton
                      disabled={!!uuid}
                      dtoInput={voteRegisterDto}
                      onRegister={dtoInput => {
                        setVoteRegisterDto(dtoInput);
                      }}
                      onDelete={() => {
                        setVoteRegisterDto(undefined);
                      }}
                    />
                  )}
                  <BoardPostWriteAnonymousSwitchButton
                    isAnonymous={isAnonymous}
                    onChange={isAnonymous => {
                      setIsAnonymous(isAnonymous);
                    }}
                  />
                </div>

                {errorMessage && (
                  <HelperMessage
                    type="error"
                    text={errorMessage}
                    responsive
                    className="underline"
                  />
                )}

                <BaseButton
                  onClick={() => {
                    const files = uploadedFiles
                      // FIXME editor content
                      .filter(file => file)
                      .map((file, index) => ({
                        fileUuid: file.uuid,
                        displayOrder: index
                      }));

                    if (
                      uuid &&
                      boardQueryResult.data &&
                      boardQueryResult.data.board.version === BOARD_VERSION_NEW
                    ) {
                      editBoard({
                        variables: {
                          input: {
                            uuid,
                            title,
                            content: stringifiedDeltaContent,
                            isAnonymous,
                            files,
                            categoryUuid
                          }
                        },
                        onCompleted: ({ editBoard }) => {
                          boardQueryResult.refetch().then(() => {
                            router.replace(`/board/post/${editBoard.uuid}`);
                          });
                        },
                        onError: err => {
                          setErrorMessage(err.message);
                        }
                      });
                    } else if (categoryUuid) {
                      setErrorMessage(undefined);

                      registerBoard({
                        variables: {
                          input: {
                            version: BOARD_VERSION_NEW,
                            title,
                            content: stringifiedDeltaContent,
                            isAnonymous,
                            categoryUuid,
                            files,
                            voteRegisterDto
                          }
                        },
                        onCompleted: ({ registerBoard }) => {
                          router.replace(`/board/post/${registerBoard.uuid}`);
                        },
                        onError: err => {
                          setErrorMessage(err.message);
                        }
                      });
                    } else {
                      setErrorMessage('카테고리를 선택해주세요.');
                    }
                  }}
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
                onFileUpload={result => {
                  setUploadedFiles(prev => {
                    if (prev.some(file => file.uuid === result.uuid)) return prev;
                    return [...prev, { uuid: result.uuid, url: result.url }];
                  });

                  const editor = ref.current?.getEditor();
                  const range = editor?.getSelection();
                  const index = range?.index ?? 0;

                  const imgTag = `<img src="${result.url}" alt="Uploaded Image" />`;
                  setHTMLContent(prevHTML => {
                    return prevHTML + imgTag;
                  });

                  editor?.insertEmbed(index, 'image', result.url);
                  editor?.setSelection(index + 1, 0);
                }}
              />
            </div>
          </>
        )}
      </PageLayout>
    </>
  );
};

export default BoardPostWritePage;
