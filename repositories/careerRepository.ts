// 특정 기능별로 파일 세분화 가능

// REST API 호출(아래는 예시)
// import { Job } from "@entities/Job";

import { fetchData } from '@apis/fetchData';

import type { PostRecruitmentListRequest } from '@dto/CareerDTO';

import type CareersMainType from '@mock/careers/types/careersMainType';

// const API_BASE_URL = "https://api.example.com/careers"; // 실제 API 주소

// // 모든 채용 공고 가져오기
// export const fetchCareers = async (): Promise<Job[]> => {
//   const response = await fetch(`${API_BASE_URL}/jobs`);
//   if (!response.ok) throw new Error("Failed to fetch careers");
//   return response.json();
// };

// 채용 공고 조회 API
export async function postRecruitmentListData(
  body: PostRecruitmentListRequest,
  token?: string
) {
  try {
    const response = await fetchData<CareersMainType[], PostRecruitmentListRequest>({
      method: 'POST',
      path: '/api/recruitment/v1/cursor',
      body: body,
      token: token
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

// 채용 공고 상세 조회 API
export async function getRecruitmentDetailData(uuid: string, token?: string) {
  try {
    const response = await fetchData({
      method: 'GET',
      path: `/api/v1/recruitment-new/get-by-uuid?uuid=${uuid}`,
      token: token
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

// 채용 필터 타입 조회 API
export async function getRecruitmentFilterTypeData() {
  try {
    const response = await fetchData({
      method: 'GET',
      path: '/api/recruitment/v1/filter?types=job,industry,recruitment,company,education,region,deadline'
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

// 북마크된 채용 공고 조회 API
export async function getRecruitmentBookmarkData(token: string) {
  try {
    const response = await fetchData({
      method: 'GET',
      path: `/api/recruitment/v1/bookmark?sort=DEADLINE&orderBy=ASC`,
      token: token
    });
    // console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

// 북마크 설정 API
export async function putRecruitmentBookmarkData(token: string, uuid: string) {
  try {
    const response = await fetchData({
      method: 'PUT',
      path: `/api/recruitment/v1/bookmark/${uuid}`,
      token: token
    });
    // console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

// 북마크 해제 DELETE
export async function deleteRecruitmentBookmarkData(token: string, uuid: string) {
  try {
    const response = await fetchData({
      method: 'DELETE',
      path: `/api/recruitment/v1/bookmark/${uuid}`,
      token: token
    });
    // console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}
