import { action } from 'mobx'

import {
  NoticeEntityView,
} from "@generated/graphql";
import BasePagination from './BasePagination.store';

export default class NoticeStore extends BasePagination<NoticeEntityView> {
  constructor() {
    super()
  }

  // NOTE: notice는 아직 서버에서 totalcount 작업이 안 되어 있기 때문에 cursor 여부로 판단.
  //       cursor를 이용하면 스크롤 맨 밑에서 불필요한 쿼리 요청을 하나 날려야 함.('cursor=null'를 받기 위해)
  get hasMore(): boolean {
    return !!this.data.cursor
  }
}
