import { action, makeObservable, observable } from 'mobx'

import {
  BoardEntityView,
} from "@generated/graphql";
import BasePagination from './BasePagination.store';

export default class BoardStore extends BasePagination<BoardEntityView> {
  constructor() {
    super()
    makeObservable(this, {
      /* observables */
      categoryUUID: observable,

      /* actions */
      setCategoryUUID: action,
    })
  }
  categoryUUID: string = '';

  setCategoryUUID = (uuid: string) => (this.categoryUUID = uuid)
}
