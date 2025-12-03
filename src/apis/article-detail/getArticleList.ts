import { ApiResponse } from 'types/ApiResponseType';
import { components } from 'src/types/api';
import axios from 'axios';

type ArticlePaginationRequestDto = components['schemas']['ArticlePaginationRequestDto'];
type ArticlePaginationResultDto = components['schemas']['ArticlePaginationResultDto'];
type ArticleViewDto = components['schemas']['ArticleViewDto'];

export default async function getArticleList(
  limit: number = 10, 
  accessToken?: string
): Promise<ApiResponse<ArticlePaginationResultDto>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `${REST_API_ENDPOINT}/api/v1/article/get-by-paging`;

  const requestBody: ArticlePaginationRequestDto = {
    page: 0,
    count: limit,
  };

  try {
    const response = await axios.post<ArticlePaginationResultDto>(requestUrl, requestBody, {
      headers: {
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        'Content-Type': 'application/json'
      },
      validateStatus: () => true
    });

    const { status, data } = response;

    if (status === 200) {
      return {
        success: true,
        data
      };
    }

    let message = '게시글 목록을 불러오지 못했습니다.';
    switch (status) {
      case 401:
        message = '로그인이 필요합니다.';
        break;
      case 403:
        message = '접근 권한이 없습니다.';
        break;
      case 404:
        message = '요청한 리소스를 찾을 수 없습니다.';
        break;
      default:
        message = `서버 오류(${status})가 발생했습니다.`;
    }

    return { success: false, messages: message };
  } catch (error) {
    console.error('getArticleList Error:', error);
    return {
      success: false,
      messages: '네트워크 오류가 발생했습니다. 다시 시도해주세요.'
    };
  }
}

export type { ArticleViewDto, ArticlePaginationRequestDto, ArticlePaginationResultDto };
