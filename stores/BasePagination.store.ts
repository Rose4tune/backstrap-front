import { action, computed, makeObservable, observable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'

import { isNotNil } from '@utils/common/base.util';

const ssr = typeof window === 'undefined'

enableStaticRendering(ssr)

interface Data<T> {
  list: T[]
  cursor: string | null
}

export default class BasePaginationStore<T extends { uuid: string }> {
  constructor() {
    makeObservable(this, {
      /* observables */
      data: observable,
      page: observable,
      totalCount: observable,
      count: observable,

      /* actions */
      initData: action,
      setList: action,
      setCount: action,
      setCursor: action,
      setPage: action,
      setTotalCount: action,
      getEntityByUUID: action,
      pushList: action,

      /* computed */
      isEmpty: computed,
      hasMore: computed,
    })
  }

  data: Data<T> = {
    list: [],
    cursor: null,
  }

  page: number = 0

  totalCount: number = 50

  count: number = 20

  initData = () => {
    this.data = {
      list: [],
      cursor: null,
    }
  }

  setList = (list: T[]) => {
    this.data = {
      ...this.data,
      list: [...list],
    }
    // console.log('set list', this.data.list)
  }

  pushList = (list: T[]) => {
    // this.data = {
    //   ...this.data,
    //   list: [...this.data.list, ...list],
    // }

    /* 중복 list는 push 하지 않는 로직 */
    this.data = {
      ...this.data,
      list: [
        ...this.data.list,
        ...list.map((l) => {
          const newEl = this.data.list.find((el) => el.uuid === l.uuid)
          if (!!!newEl) return l
          return null
        }).filter(isNotNil),
      ],
    }
    // console.log('push list', this.data.list)
  }

  setCursor = (cursor: string | null) => {
    this.data = {
      ...this.data,
      cursor,
    }
  }

  getEntityByUUID = (uuid: string) => {
    return this.data.list.find((el) => el.uuid == uuid)
  }

  setPage = (p: number) => this.page = p

  setTotalCount = (c: number) => this.totalCount = c

  setCount = (c: number) => this.count = c

  get isEmpty() {
    return this.data.list.length == 0
  }

  get hasMore() {
    return this.totalCount > this.count
  }
}
