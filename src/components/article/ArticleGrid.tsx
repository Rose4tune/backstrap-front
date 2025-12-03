// import React, { useEffect, useState, useRef } from 'react';
// import { getArticlesByPaging, ArticleViewDto } from 'src/apis/article/getByPaging';
// import { useStore } from '@stores/useStore.hook';

// interface ArticleGridProps {
//   pageSize?: number;
//   sortType?: 'RECENT' | 'POPULAR' | 'LIKE';
//   categoryUuid?: string;
// }

// interface ArticleCardProps {
//   article: ArticleViewDto;
//   onClick: () => void;
// }

// const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
//   return (
//     <div
//       className="flex-shrink-0 w-[300px] cursor-pointer group"
//       onClick={onClick}
//     >
//       {/* Image */}
//       <div className="w-full h-[200px] bg-gray-20 rounded-lg mb-3 overflow-hidden">
//         {article.articleContents ? (
//           <img
//             src={article.thumbnailUrl}
//             alt={article.title || ''}
//             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center text-gray-60">
//             <div className="text-center">
//               <div className="text-med-14">이미지 없음</div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Tags */}
//       {article.tags && article.tags.length > 0 && (
//         <div className="flex flex-wrap gap-1 mb-2">
//           {article.tags.slice(0, 3).map((tag, index) => (
//             <span
//               key={index}
//               className="text-semibold-12 text-gray-60 bg-gray-20 px-2 py-1 rounded"
//             >
//               #{tag}
//             </span>
//           ))}
//         </div>
//       )}

//       {/* Title */}
//       <h3 className="text-bold-16 text-gray-90 mb-1 line-clamp-2 group-hover:text-normal transition-colors">
//         {article.title || '제목 없음'}
//       </h3>

//       {/* Description */}
//       <p className="text-med-14 text-gray-70 line-clamp-2">
//         {article.summary || article.content || '내용에 대한 한 줄 요약'}
//       </p>
//     </div>
//   );
// };

// const ArticleGrid: React.FC<ArticleGridProps> = ({
//   pageSize = 12,
//   sortType = 'RECENT',
//   categoryUuid
// }) => {
//   const { UserStore } = useStore();
//   const accessToken = UserStore.accessToken;

//   const [articles, setArticles] = useState<ArticleViewDto[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [hasNextPage, setHasNextPage] = useState(true);
//   const scrollContainerRef = useRef<HTMLDivElement>(null);

//   const fetchArticles = async (page: number = 1) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await getArticlesByPaging(
//         {
//           page,
//           count: pageSize,
//           sortType,
//           categoryUuid: categoryUuid || undefined,
//           entityStatus: 'ACTIVE'
//         },
//         accessToken
//       );

//       if (response.success && response.data?.data) {
//         const { data: articleList, hasNextPage: hasNext } = response.data;
//         setArticles(articleList || []);
//         setHasNextPage(hasNext || false);
//       } else {
//         throw new Error(response.messages || '아티클을 불러오는데 실패했습니다.');
//       }
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
//       setError(errorMessage);
//       console.error('Failed to fetch articles:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchArticles();
//   }, [pageSize, sortType, categoryUuid, accessToken]);

//   const handleArticleClick = (article: ArticleViewDto) => {
//     if (article.uuid) {
//       window.open(`/article/${article.uuid}`, '_blank');
//     }
//   };

//   const scrollLeft = () => {
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
//     }
//   };

//   const scrollRight = () => {
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
//     }
//   };

//   if (loading) {
//     return (
//       <div className="w-full h-[300px] flex items-center justify-center">
//         <div className="flex items-center gap-2">
//           <img src="/assets/loading.gif" alt="로딩" className="w-6 h-6" />
//           <span className="text-med-14 text-gray-60">아티클 로딩 중...</span>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="w-full h-[300px] flex items-center justify-center">
//         <div className="flex flex-col items-center gap-3">
//           <div className="text-med-14 text-red">{error}</div>
//           <button
//             onClick={() => fetchArticles()}
//             className="px-4 py-2 bg-gray-30 text-gray-90 text-semibold-14 rounded-lg hover:bg-hover hover:text-white transition-colors"
//           >
//             다시 시도
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (articles.length === 0) {
//     return (
//       <div className="w-full h-[300px] flex items-center justify-center">
//         <div className="text-med-14 text-gray-60">등록된 아티클이 없습니다.</div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full relative">
//       {/* Navigation Arrow - Left */}
//       <button
//         onClick={scrollLeft}
//         className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
//         aria-label="이전 아티클"
//       >
//         <svg width="7" height="13" viewBox="0 0 7 13" fill="none">
//           <path d="M6 1L1 6.5L6 12" stroke="#464D57" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//         </svg>
//       </button>

//       {/* Articles Container */}
//       <div
//         ref={scrollContainerRef}
//         className="flex gap-5 overflow-x-auto scrollbar-hide px-12 py-4"
//         style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//       >
//         {articles.map((article) => (
//           <ArticleCard
//             key={article.uuid}
//             article={article}
//             onClick={() => handleArticleClick(article)}
//           />
//         ))}
//       </div>

//       {/* Navigation Arrow - Right */}
//       <button
//         onClick={scrollRight}
//         className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
//         aria-label="다음 아티클"
//       >
//         <svg width="7" height="13" viewBox="0 0 7 13" fill="none" transform="rotate(180)">
//           <path d="M6 1L1 6.5L6 12" stroke="#464D57" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//         </svg>
//       </button>

//       {/* Hide scrollbar with CSS */}
//       <style jsx>{`
//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ArticleGrid;