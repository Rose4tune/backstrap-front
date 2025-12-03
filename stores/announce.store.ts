import { observable, makeObservable } from 'mobx'

import {
  AnnounceResponse,
} from "@generated/graphql";
import BasePagination from './BasePagination.store';

export default class AnnounceStore extends BasePagination<AnnounceResponse> {
  constructor() {
    super()
    
    this.count = 40
  }
}
