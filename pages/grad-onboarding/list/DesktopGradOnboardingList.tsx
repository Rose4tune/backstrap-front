import bookmarkArticle from "@api/article-bookmark/bookmarkArticle";
import unBookmarkArticle from "@api/article-bookmark/unBookmarkArticle";
import { getArticlesByPaging } from "@api/article/getByPaging";
import Loader from "@common/loader/loader";
import useAuthGuardModalDialog from "@hooks/bagstrap/user/useAuthGuardModalDialog.hook";
import { useStore } from "@stores/useStore.hook";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import SectionHeaderDesktop from "src/components/home/desktop/SectionHeaderDesktop";
import { components } from "src/types/api";
import FireIcon from "src/assets/icons/common/FireIcon.svg";
import Image from "next/image";
import BookmarkIcon from "src/assets/icons/mentoring/[renewal]BookmarkIcon.svg";

type TagEntityViewDto = components["schemas"]["TagEntityViewDto"];
type ArticleViewDto = components["schemas"]["ArticleViewDto"];

function DesktopGradOnboardingList({
  tagList,
  tagUuidValue,
}: {
  tagList: TagEntityViewDto[] | null;
  tagUuidValue?: string;
}) {
  const router = useRouter();
  const [AuthModalComponent, openAuthModal] = useAuthGuardModalDialog();
  const { UserStore } = useStore();
  const accessToken = UserStore.getAccessTokenFromCookies();

  // 기본값은 전체 (undefined)
  const [selectedTagUuid, setTagSelectedUuid] = useState<string | undefined>(
    tagUuidValue || undefined
  );
  const [articleList, setArticleList] = useState<ArticleViewDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 무한 스크롤 상태
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // 태그 스크롤
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const loaderRef = useRef<HTMLDivElement | null>(null);

  /** BEST → NEW → 나머지 순서로 정렬 */
  const sortedTagList = useMemo(() => {
    if (!tagList) return [];
    // 전체 버튼을 맨 앞에 삽입
    const sorted = [...tagList].sort(
      (a, b) => (a?.displayOrder || 0) - (b?.displayOrder || 0)
    );
    return [{ uuid: "all", name: "전체" }, ...sorted];
  }, [tagList]);
  
  /** 태그 선택 시 자동 스크롤 */
  useEffect(() => {
    if (!selectedTagUuid) return;
    const el = tagRefs.current[selectedTagUuid];
    if (el && scrollContainerRef.current) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedTagUuid]);

  /** 아티클 로드 (cursor 기반) */
  async function loadArticles(reset = false) {
    const nextCursor = reset ? null : cursor;
    
    const params =
    selectedTagUuid && selectedTagUuid !== "all"
      ? { count: 20, tagUuids: [selectedTagUuid], cursor: nextCursor ?? undefined }
      : { count: 20, tagUuids: [], cursor: nextCursor ?? undefined };

    const result = await getArticlesByPaging(params, accessToken);

    if (result.success && result.data) {
      const newData = result.data.data?.filter((a) => !!a.uuid) ?? []; 

      setArticleList((prev) =>
        reset ? newData : [...(prev ?? []), ...newData]
      );

      if (newData.length > 0) {
        const lastUuid = newData[newData.length - 1].uuid;
        setCursor(lastUuid || null);
      }
      setHasMore(newData.length === 20);
    }
  }

  /** 태그 변경 시 초기화 */
  useEffect(() => {
    setArticleList([]);
    setCursor(null);
    setHasMore(true);
    setIsLoading(true);
    loadArticles(true).finally(() => setIsLoading(false));
  }, [selectedTagUuid]);

  /** 무한 스크롤 IntersectionObserver */
  useEffect(() => {
    if (!hasMore || isFetchingMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsFetchingMore(true);
          loadArticles().finally(() => setIsFetchingMore(false));
        }
      },
      { rootMargin: "0px 0px 80px 0px" }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, isFetchingMore, cursor, selectedTagUuid]);

  /** 북마크 토글 */
  async function handleBookmark(
    event: React.MouseEvent,
    isBookMarked?: boolean,
    articleUuid?: string
  ) {
    event.stopPropagation();
    if (!accessToken) {
      openAuthModal();
      return;
    }

    if (!articleUuid) return;

    setArticleList((prev) =>
      (prev || []).map((a) =>
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

  return (
    <div className="flex flex-col w-full max-w-[1920px] px-20 space-y-10 py-[40px]">
      {/* 상단 영역 */}
      <div className="flex flex-col gap-1">
        <SectionHeaderDesktop
          icon={FireIcon}
          content="따끈따끈 최신 아티클"
          subtitle="주제별 태그로 가방끈 아티클 보기"
        />

        {/* 태그 목록 */}
        <div
          ref={scrollContainerRef}
          className="flex w-full gap-[12px] overflow-x-auto mt-[16px] mb-[24px] no-scrollbar"
        >
          {sortedTagList.map((tag) => {
            // 전체
            const isAll = tag.uuid === "all";
            const isSelected = isAll
              ? !selectedTagUuid
              : tag.uuid === selectedTagUuid;

            return (
              <div
                key={tag.uuid}
                ref={(el: HTMLDivElement | null) => {
                  tagRefs.current[tag.uuid || 0] = el;
                }}
                onClick={() =>
                  isAll
                    ? setTagSelectedUuid(undefined)
                    : setTagSelectedUuid(tag.uuid as string)
                }
                className={`${
                  isSelected ? "bg-gray-70 text-white" : "bg-gray-30 text-gray-70"
                } flex items-center rounded-[12px] px-3 py-2 gap-[4px] text-semibold-16 cursor-pointer`}
              >
                <span className="whitespace-nowrap">{tag.name}</span>
                {!isAll &&
                  (tag.isBest ? (
                    <span className="text-normal">BEST</span>
                  ) : tag.isNew ? (
                    <span className="text-red">NEW</span>
                  ) : null)}
              </div>
            );
          })}
        </div>
      </div>

      {/* 아티클 리스트 */}
      <div className="relative w-full">
        {isLoading ? (
          <div className="flex h-[316px] w-full items-center justify-center text-gray-500 text-semibold-18">
            <Loader />
          </div>
        ) : articleList.length === 0 ? (
          <div className="flex h-[316px] w-full items-center justify-center text-gray-500 text-semibold-18">
            아직 작성된 아티클이 없습니다
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 xl:grid-cols-4  w-full max-w-[1920px] mx-auto gap-[24px] ">
              {articleList.map((article) => (
                <div
                  key={article.uuid}
                  onClick={() => {
                    if (!article.uuid) return;
                    router.push(`/grad-onboarding/detail/${article.uuid}`);
                  }}
                  className="flex flex-col gap-[12px] cursor-pointer"
                >
                  <div
                    className="relative rounded-[24px] overflow-hidden
                    w-[304px] h-[200px] 4xl:w-[340px] 4xl:h-[230px]"
                  >
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handleBookmark(
                          event,
                          article.isBookmarkedByMe,
                          article.uuid
                        );
                      }}
                      className="absolute top-0 right-0 z-20 p-4"
                    >
                      <BookmarkIcon
                        width={32}
                        height={32}
                        className={
                          article.isBookmarkedByMe
                            ? "text-yellow"
                            : "text-gray-40"
                        }
                      />
                    </button>
                    <Image
                      src={article.imageUrlMO as string}
                      fill
                      alt="썸네일 이미지"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-[2px] w-[310px]">
                    <div className="flex gap-1 truncate">
                      {article.tags?.map((tag) => (
                        <span
                          key={tag.uuid}
                          className="text-reg-14 text-gray-70"
                        >
                          {"#" + tag.name}
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
              <GradForm />
            </div>

            {/* 무한 스크롤 로딩 위치 */}
            {hasMore && (
              <div ref={loaderRef} className="flex justify-center mt-[80px]">
                {isFetchingMore && <Loader />}
              </div>
            )}
          </>
        )}
      </div>

      {AuthModalComponent}
    </div>
  );
}

export default observer(DesktopGradOnboardingList);

function GradForm() {
  return (
    <div className="flex flex-col bg-[#8FA4FF] rounded-[24px] w-[340px] h-[316px] p-8">
      <span className="flex w-full text-bold-24 text-white mb-[8px]">
        듣고 싶은 이야기가 있나요?
      </span>
      <span className="flex w-full text-semibold-16 text-white flex-1 whitespace-pre-line">
        {`아티클로 보고 싶은 주제들을\n 가방끈팀에게 알려주세요!`}
      </span>
      <button
        className="flex justify-center bg-white rounded-[16px] py-[18px] text-[#8FA4FF] text-bold-20"
        onClick={() =>
          window.open(
            "https://walla.my/v/w85vkot13KvHY4eYMJ6t",
            "_blank"
          )
        }
      >
        요청하기
      </button>
    </div>
  );
}
