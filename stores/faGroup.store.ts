import { makeAutoObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'

import {
  FaGroupsDocument,
  FaGroupsQuery,
  FaGroupsQueryVariables,
} from "@generated/graphql";

import { isNotNil } from '@utils/common/base.util';
import { initializeApollo } from "@libs/apolloClient";

import RootStore from '@stores/root.store'

const ssr = typeof window === 'undefined'

enableStaticRendering(ssr)

class FaGroupStore {
  rootStore: RootStore;

  faGroups: FaGroupsQuery["FAGroups"] = []

  constructor(root: any) {
    makeAutoObservable(this)

    this.rootStore = root
  }

  _fetchFaGroups = async () => {
    const apolloClient = initializeApollo();

    const {
      data: { FAGroups = [] },
    } = await apolloClient
      .query<FaGroupsQuery, FaGroupsQueryVariables>({
        query: FaGroupsDocument,
      })
      .catch((e) => {
        console.log(e);

        return { data: { FAGroups: [] }};
      })

    this.faGroups = FAGroups.filter(isNotNil)
  }

  getFaGroups = () => {
    if(this.isEmpty() && !ssr){
      this._fetchFaGroups()
    }

    return this.faGroups
  }

  getFaGroupsByUUID = (uuid: string) => {
    if(this.isEmpty() && !ssr) {
      this._fetchFaGroups()
    }
    return this.faGroups.find((faGroup) => faGroup!.uuid === uuid)
  }

  setFaGroups = (faGroups: FaGroupsQuery["FAGroups"]) => {
    this.faGroups = faGroups.filter(isNotNil)
  }

  isEmpty = () => {
    return this.faGroups.length == 0
  }
}

export default FaGroupStore
