export {};

// 특정 기능별로 파일 세분화 가능

// utils는 보편적인 함수(ex. 시간 형식 전처리)를 정의해둠.
// use-cases는 비즈니스 로직을 담당하며, 기능적인 부분을 구현한다.
// ex. 채용 공고 상세 필터링 모달에서의 키워드 [] 변화 로직
// ex. repositories에서 api를 호출하여 데이터를 받아온 후, 필요한 데이터만 필터링하는 로직

// 아래는 예시
// import { JobPost } from '@entities/jobPost';

// export const filterJobPostsByKeywords = (
//   jobPosts: JobPost[],
//   selectedKeywords: string[]
// ): JobPost[] => {
//   return jobPosts.filter(post =>
//     selectedKeywords.every(keyword => post.keywords.includes(keyword))
//   );
// };
