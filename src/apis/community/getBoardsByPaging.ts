import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';
import { components } from 'src/types/api';

interface GetBoardsByPagingParams {
  count?: number;
  cursor?: string;
  page?: number;
  sortType?: 'LIKE' | 'POPULAR' | 'RECENT' | 'MONTHLY_POPULAR' | 'MONTHLY_COMMENT_POPULAR' | 'MONTHLY_IF_POPULAR' | 'MONTHLY_VOTE_POPULAR' | 'COMMENT';
  searchKeyword?: string;
  boardType?: 'TOTY';
  fetchType?: 'LIKE' | 'MY_SCRAP' | 'REVIEW';
  userUuid?: string;
  groupUuid?: string;
  keywordUuids?: string[];
  isDisplayTop?: boolean;
  entityStatus?: 'ACTIVE' | 'BLOCKED' | 'DELETED' | 'INVALID' | 'SEARCHABLE';
}

type GetBoardsByPagingResponse = components['schemas']['BoardPaginationResultDto'];

export default async function getBoardsByPaging(
  params: GetBoardsByPagingParams = {}
): Promise<ApiResponse<GetBoardsByPagingResponse>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `/api/v1/board/get-by-paging`;

  const requestBody: components['schemas']['BoardFetchDto'] = {
    paginationRequestDto: {
      count: params.count || 10,
      cursor: params.cursor,
      page: params.page || 0
    },
    sortType: params.sortType || 'RECENT',
    searchKeyword: params.searchKeyword,
    boardType: params.boardType,
    fetchType: params.fetchType,
    userUuid: params.userUuid,
    groupUuid: params.groupUuid,
    keywordUuids: params.keywordUuids,
    isDisplayTop: params.isDisplayTop,
    entityStatus: params.entityStatus
  };
  try {
    const response = await axios.post(requestUrl, requestBody, {
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json'
      },
      validateStatus: () => true
    });

    const { status, data } = response;

    if (status === 200 || status === 201) {
      return {
        success: true,
        data: data
      };
    }

    let message = '게시글 조회에 실패했습니다.';

    switch (status) {
      case 401:
        message = '로그인이 필요합니다.';
        break;
      case 403:
        message = '접근 권한이 없습니다.';
        break;
      case 404:
        message = '서버를 찾을 수 없습니다.';
        break;
      default:
        if (typeof data === 'object' && data && 'message' in data) {
          message = (data as any).message;
        }
    }

    return { success: false, messages: message };
  } catch (error: any) {
    return {
      success: false,
      messages: '네트워크 오류가 발생했습니다. 다시 시도해주세요.'
    };
  }
}