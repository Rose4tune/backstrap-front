import React, { useState, useEffect } from 'react';
import SectionHeaderDesktop from 'src/components/home/desktop/SectionHeaderDesktop';
import { components } from 'src/types/api';
import useAuthGuardModalDialog from '@hooks/bagstrap/user/useAuthGuardModalDialog.hook';
import { observer } from 'mobx-react';
import { useStore } from '@stores/useStore.hook';
import { useRouter } from 'next/router';
import unBookmarkArticle from '@api/article-bookmark/unBookmarkArticle';
import bookmarkArticle from '@api/article-bookmark/bookmarkArticle';
import FireIcon from "src/assets/icons/common/FireIcon.svg"
import { getArticlesByPaging } from '@api/article/getByPaging';
import Image from 'next/image';
import BookmarkIcon from 'src/assets/icons/mentoring/[renewal]BookmarkIcon.svg';
import Loader from 'src/components/common/Loader';
import ArrowRightIcon from 'src/assets/icons/common/[renewal]RightArrowIcon.svg'
import ArrowLeftIcon from 'src/assets/icons/common/[renewal]LeftArrowIcon.svg'


type ArticleViewDto = components['schemas']['ArticleViewDto']
type TagEntityViewDto = components['schemas']['TagEntityViewDto']

const GradNewArticleDesktop = ({ tagList }: { tagList: TagEntityViewDto[] | null }) => {
  const router = useRouter();
  const pageQuery = Number(router.query.page ?? 1);
  const [AuthModalComponent, openAuthModal] = useAuthGuardModalDialog();
  const { UserStore } = useStore();
  const accessToken = UserStore.getAccessTokenFromCookies();

  const [selectedTagUuid, setTagSelectedUuid] = useState<string>();
  const [articleList, setArticleList] = useState<ArticleViewDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 기존 구조 유지, cursorMap만 추가
  const [cursorMap, setCursorMap] = useState<Record<number, string | null>>({ 1: null });
  const [cursor, setCursor] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const count = 16;
  const totalPages = totalCount ? Math.ceil(totalCount / count) : 0;

  // pageQuery 유효성 처리
  const currentPage = isNaN(pageQuery) || pageQuery < 1 ? 1 : pageQuery;

  /** 태그 정렬 */
  const sortedTagList = React.useMemo(() => {
    if (!tagList) return [];
    return [...tagList].sort((a, b) => (a?.displayOrder || 0) - (b?.displayOrder || 0));
  }, [tagList]);

  /** 데이터 불러오기 */
  const fetchArticles = async (cursorParam: string | null, page: number) => {
    setIsLoading(true);
    try {
      const params = selectedTagUuid
        ? { count, cursor: cursorParam ?? undefined, tagUuids: [selectedTagUuid] }
        : { count, cursor: cursorParam ?? undefined };
      const result = await getArticlesByPaging(params, accessToken);
      if (result.success && result.data) {
        const { data, cursor: nextCursor, totalCount } = result.data;
        setArticleList(data as ArticleViewDto[]);
        setTotalCount(totalCount || 0);
        setCursor(nextCursor ?? null);

        // 다음 페이지 커서 저장
        setCursorMap(prev => ({
          ...prev,
          [page + 1]: nextCursor ?? null,
        }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  /** 커서 확보 함수 */
  const ensureCursorAvailable = async (targetPage: number): Promise<string | null> => {
    if (cursorMap[targetPage] !== undefined) {
      return cursorMap[targetPage] ?? null;
    }

    let prevCursor = cursorMap[1] ?? null;
    let lastCursor: string | null = prevCursor;

    for (let p = 1; p < targetPage; p++) {
      if (cursorMap[p + 1] !== undefined) {
        lastCursor = cursorMap[p + 1];
        continue;
      }

      const params = selectedTagUuid
        ? { count, cursor: lastCursor ?? undefined, tagUuids: [selectedTagUuid] }
        : { count, cursor: lastCursor ?? undefined };

      const result = await getArticlesByPaging(params, accessToken);
      if (result.success && result.data) {
        const { cursor: nextCursor } = result.data;
        setCursorMap(prev => ({
          ...prev,
          [p + 1]: nextCursor ?? null,
        }));
        lastCursor = nextCursor ?? null;
      } else break;
    }

    return lastCursor;
  };

  /** 페이지 변경 감지 */
  useEffect(() => {
    const fetchPage = async () => {
      setIsLoading(true);
      try {
        const cursorToUse = await ensureCursorAvailable(currentPage);
        await fetchArticles(cursorToUse, currentPage);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [currentPage, selectedTagUuid, accessToken]);

  /** 태그 변경 시 초기화 */
  useEffect(() => {
    setCursorMap({ 1: null });
    setCursor(null);
    router.push(
      {
        pathname: router.pathname,
        query: { page: 1, tagUuid: selectedTagUuid },
      },
      undefined,
      { shallow: true }
    );
  }, [selectedTagUuid]);

  /** 페이지 이동 */
  const handlePageClick = (page: number) => {
    if (page < 1 || page > totalPages) return;
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, page, tagUuid: selectedTagUuid },
      },
      undefined,
      { shallow: true }
    );
  };

  /** 북마크 */
  async function handleBookmark(
    event: React.MouseEvent,
    isBookMarked?: boolean,
    articleUuid?: string
  ) {
    event.stopPropagation();
    if (!accessToken) return openAuthModal();
    if (articleUuid) {
      setArticleList(prev =>
        prev.map(a =>
          a.uuid === articleUuid ? { ...a, isBookmarkedByMe: !isBookMarked } : a
        )
      );
      try {
        if (isBookMarked) await unBookmarkArticle(articleUuid, accessToken);
        else await bookmarkArticle(articleUuid, accessToken);
      } catch (e) {
        console.error(e);
      }
    }
  }

  /** 페이지네이션 숫자 계산 */
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage > totalPages - 4) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col w-full space-y-5">
      <SectionHeaderDesktop
        icon={FireIcon}
        content="따끈따끈 최신 아티클"
        navigateText="전체보기"
        onClick={() =>
          router.push({
            pathname: '/grad-onboarding/list',
            query: { tagUuid: selectedTagUuid },
          })
        }
        subtitle="주제별 태그로 가방끈 아티클 보기"
      />

      {/* 태그 */}
      <div className="flex w-full gap-[12px] overflow-x-auto mt-[16px] mb-[24px] no-scrollbar">
        <TagButton
          selected={!selectedTagUuid}
          label="전체"
          onClick={() => setTagSelectedUuid(undefined)}
        />
        {sortedTagList.map(tag => (
          <TagButton
            key={tag.uuid}
            selected={tag.uuid === selectedTagUuid}
            label={tag.name ?? ''}
            badge={tag.isBest ? 'BEST' : tag.isNew ? 'NEW' : undefined}
            onClick={() => setTagSelectedUuid(tag.uuid)}
          />
        ))}
      </div>

      {/* 아티클 그리드 */}
      {isLoading ? (
        <div className="flex h-[286px] w-full items-center justify-center">
          <Loader />
        </div>
      ) : articleList.length === 0 ? (
        <div className="flex h-[286px] w-full items-center justify-center text-gray-500 text-semibold-18">
          아직 작성된 아티클이 없습니다
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-[32px] w-full">
          {articleList.map(article => (
            <div key={article.uuid} className="flex flex-col gap-[12px] w-[270px] 3xl:w-[290px]  4xl:w-[340px]">
              <div
                className="relative w-[270px] h-[200px] 3xl:w-[290px] std1:w-[320px] 4xl:w-[340px] 4xl:h-[230px] rounded-[16px] overflow-hidden cursor-pointer"
                onClick={() => router.push(`/grad-onboarding/detail/${article.uuid}`)}
              >
                <button
                  onClick={event =>
                    handleBookmark(event, article.isBookmarkedByMe, article.uuid)
                  }
                  className="absolute top-0 right-0 z-20 p-4"
                >
                  <BookmarkIcon
                    width={32}
                    height={32}
                    className={
                      article.isBookmarkedByMe ? 'text-yellow' : 'text-gray-40'
                    }
                  />
                </button>
                <Image
                  src={article.imageUrlMO as string}
                  alt="썸네일 이미지"
                  fill
                  className="object-cover"
                />
              </div>

              {/* 텍스트 */}
              <div className="flex flex-col gap-[2px] 4xl:w-[340px] std1:w-[320px] 3xl:w-[290px] w-[270px]">
                <div className="flex gap-1 truncate">
                  {article.tags?.map(tag => (
                    <span key={tag.uuid} className="text-reg-14 text-gray-70">
                      {'#' + tag.name}
                    </span>
                  ))}
                </div>
                <div className="text-bold-20 text-black truncate min-w-0">
                  {article.title}
                </div>
                <div className="text-gray-70 text-med-16 truncate min-w-0">
                  {article.smallTitle}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 py-8 text-gray-500 text-semibold-16">
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-[28px] h-[28px] justify-center items-center flex disabled:opacity-40 hover:text-black transition"
          >
            <ArrowLeftIcon width={20} height={20} className="text-gray-50" />
          </button>

          {getPageNumbers().map((p, idx) =>
            typeof p === 'number' ? (
              <button
                key={idx}
                onClick={() => handlePageClick(p)}
                className={`px-3 py-1 rounded-md transition ${
                  p === currentPage
                    ? 'bg-gray-70 text-white font-bold'
                    : 'text-gray-400 hover:text-black hover:bg-gray-20'
                }`}
              >
                {p}
              </button>
            ) : (
              <span key={idx} className="px-2 select-none text-gray-400">
                {p}
              </span>
            )
          )}

          <button
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-[28px] h-[28px] justify-center items-center flex disabled:opacity-40 hover:text-black transition"
          >
            <ArrowRightIcon width={20} height={20} className="text-gray-50" />
          </button>
        </div>
      )}

      {AuthModalComponent}
    </div>
  );
};

/** 태그 버튼 */
const TagButton = ({
  selected,
  label,
  badge,
  onClick,
}: {
  selected: boolean;
  label: string;
  badge?: string;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className={`${
      selected ? 'bg-gray-70 text-white' : 'bg-gray-30 text-gray-70'
    } flex items-center rounded-[12px] px-3 py-2 gap-[4px] text-semibold-16 cursor-pointer transition`}
  >
    <span className="whitespace-nowrap">{label}</span>
    {badge && (
      <span className={`text-${badge === 'NEW' ? 'red' : 'normal'}`}>{badge}</span>
    )}
  </div>
);

export default observer(GradNewArticleDesktop);
