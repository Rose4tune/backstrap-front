import React, { useState, useRef, useEffect } from 'react';
import SectionHeaderMobile from 'src/components/home/mobile/SectionHeaderMobile';
import { components } from 'src/types/api';
import useAuthGuardModalDialog from '@hooks/bagstrap/user/useAuthGuardModalDialog.hook';
import { observer } from 'mobx-react';
import { useStore } from '@stores/useStore.hook';
import { useRouter } from 'next/router';
import unBookmarkArticle from '@api/article-bookmark/unBookmarkArticle';
import bookmarkArticle from '@api/article-bookmark/bookmarkArticle';
import FireIcon from "src/assets/icons/common/FireIcon.svg";
import { getArticlesByPaging } from '@api/article/getByPaging';
import Image from 'next/image';
import BookmarkIcon from 'src/assets/icons/mentoring/[renewal]BookmarkIcon.svg';
import Loader from 'src/components/common/Loader';

type ArticleViewDto = components['schemas']['ArticleViewDto'];
type TagEntityViewDto = components['schemas']['TagEntityViewDto'];

const GradNewArticleMobile = ({tagList,
headerNoAction,
}: {
  tagList: TagEntityViewDto[] | null;
  headerNoAction?: boolean;
}) => {
  const router = useRouter();
  const [AuthModalComponent, openAuthModal] = useAuthGuardModalDialog();
  const { UserStore } = useStore();
  const accessToken = UserStore.getAccessToken();

  const [selectedTagUuid, setTagSelectedUuid] = useState<string>();
  const [articleList, setArticleList] = useState<ArticleViewDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  
  /** 전체 → BEST → NEW 순서 */
  const sortedTagList = React.useMemo(() => {
    if (!tagList) return [];
    const sorted = [...tagList].sort(
      (a, b) => (a?.displayOrder || 0) - (b?.displayOrder || 0)
    );
    return [{ uuid: 'all', name: '전체' }, ...sorted];
  }, [tagList]);

  /** 첫 번째 태그를 초기 선택 */
  useEffect(() => {
    if (sortedTagList.length > 0 && !selectedTagUuid) {
      setTagSelectedUuid(sortedTagList[0].uuid);
    }
  }, [sortedTagList]);

  /** 아티클 로드 */
  async function loadArticles(reset = false) {
    const nextCursor = reset ? null : cursor;
    const params =
      selectedTagUuid && selectedTagUuid !== 'all'
        ? { count: 10, tagUuids: [selectedTagUuid], cursor: nextCursor ?? undefined }
        : { count: 10, tagUuids: [], cursor: nextCursor ?? undefined };

    try {
      const result = await getArticlesByPaging(params, accessToken);
      if (result.success && result.data) {
        const newData = result.data.data?.filter((a) => !!a.uuid) ?? [];
        setArticleList((prev) => (reset ? newData : [...(prev ?? []), ...newData]));
        if (newData.length > 0) {
          setCursor(newData[newData.length - 1].uuid ?? null);
        }
        setHasMore(newData.length === 10);
      }
    } catch (error) {
      console.error(error);
    }
  }

  /** 태그 변경 시 초기화 */
  useEffect(() => {
    if (!selectedTagUuid) return;
    setArticleList([]);
    setCursor(null);
    setHasMore(true);
    setIsLoading(true);
    loadArticles(true).finally(() => setIsLoading(false));
  }, [selectedTagUuid]);

  /** 무한 스크롤 */
  useEffect(() => {
    if (!hasMore || isFetchingMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsFetchingMore(true);
          loadArticles().finally(() => setIsFetchingMore(false));
        }
      },
      { rootMargin: '0px 0px 100px 0px' }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, isFetchingMore, cursor, selectedTagUuid]);

  // 북마크 토글
  async function handleBookmark(event: React.MouseEvent, isBookMarked?: boolean, articleUuid?: string) {
    event.stopPropagation();
    if (!accessToken) {
      openAuthModal();
      return;
    }
    if (articleUuid && articleList) {
      setArticleList((prev) =>
        prev?.map((a) =>
          a.uuid === articleUuid ? { ...a, isBookmarkedByMe: !isBookMarked } : a
        )
      );
      try {
        if (isBookMarked) {
          await unBookmarkArticle(articleUuid, accessToken);
        } else {
          await bookmarkArticle(articleUuid, accessToken);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  return (
    <div className="flex flex-col w-full space-y-5 p-5">
      <div className="flex flex-col w-full">
        <SectionHeaderMobile
          icon={FireIcon}
          content="따끈따끈 최신 아티클"
          navigateText={headerNoAction ? undefined : '전체보기'}
          onClick={() => {
            if (selectedTagUuid && selectedTagUuid !== 'all') {
              router.push({
                pathname: '/grad-onboarding/list',
                query: { tagUuid: selectedTagUuid },
              });
            } else {
              router.push('/grad-onboarding/list');
            }
          }}
          subtitle="주제별 태그로 가방끈 아티클 보기"
        />
      </div>

      {/* Tag 리스트 */}
      <div className="flex w-full gap-[12px] overflow-x-auto my-3 no-scrollbar">
        {sortedTagList.map((tag) => {
          const isSelected = tag.uuid === selectedTagUuid;
          return (
            <div
              key={tag.uuid}
              onClick={() => setTagSelectedUuid(tag.uuid)}
              className={`${
                isSelected ? 'bg-gray-70 text-white' : 'bg-gray-30 text-gray-70'
              } flex items-center rounded-[12px] px-3 py-2 gap-[3px] text-semibold-12 cursor-pointer`}
            >
              <span className="whitespace-nowrap">{tag.name}</span>
              {tag.isBest ? (
                <span className="text-normal mt-[1px]">BEST</span>
              ) : tag.isNew ? (
                <span className="text-red">NEW</span>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* 스크롤 가능한 아티클 리스트 */}
      <div className="relative">
        {isLoading ? (
          <div className="flex h-[80px] w-full items-center justify-center text-gray-500 text-semibold-18">
            <Loader />
          </div>
        ) : articleList.length === 0 ? (
          <div className="flex h-[80px] w-full items-center justify-center text-gray-500 text-semibold-14">
            아직 작성된 아티클이 없습니다
          </div>
        ) : (
          <>
            <div className="flex flex-col w-full gap-[32px]">
              {articleList.map((article) => (
                <div
                  key={article.uuid}
                  className="flex justify-between"
                  onClick={() => router.push(`/grad-onboarding/detail/${article.uuid}`)}
                >
                  {/* 아티클 정보 */}
                  <div className="flex flex-col flex-1 pr-[10px] min-w-0">
                    <div className="text-bold-14 text-gray-90 truncate">
                      {article.title}
                    </div>
                    <div className="text-gray-60 text-med-12 truncate">
                      {article.smallTitle}
                    </div>
                  </div>

                  {/* 썸네일 */}
                  <div className="flex relative w-[84px] h-[56px] rounded-[8px] overflow-hidden cursor-pointer shrink-0">
                    <button
                      onClick={(event) =>
                        handleBookmark(event, article.isBookmarkedByMe, article.uuid)
                      }
                      className="absolute top-0 right-0 z-20 p-1"
                    >
                      <BookmarkIcon
                        width={24}
                        height={24}
                        className={
                          article.isBookmarkedByMe
                            ? 'text-yellow'
                            : 'text-gray-40'
                        }
                      />
                    </button>
                    <Image
                      src={article.imageUrlM as string}
                      fill
                      alt="썸네일 이미지"
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div ref={loaderRef} className="flex justify-center mt-[20px]">
                {isFetchingMore && <Loader />}
              </div>
            )}
          </>
        )}
      </div>

      {AuthModalComponent}
    </div>
  );
};

export default observer(GradNewArticleMobile);
