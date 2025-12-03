import { makeAutoObservable } from 'mobx';
import { enableStaticRendering } from 'mobx-react-lite';
import { parse } from 'cookie';

import { COOKIE_NS } from '@constants/common/cookie.constant';

import {
  MeSummaryFragment,
  MeQuery,
  MeQueryVariables,
  MeDocument,
  SchoolVerificationStatus,
  SocialProvider
} from '@generated/graphql';

import { initializeApollo } from '@libs/apolloClient';

import RootStore from '@stores/root.store';

const ssr = typeof window === 'undefined';

const DEFAULT_ME = {
  uuid: '',
  isAdmin: false
};

enableStaticRendering(ssr);

class MeStore {
  rootStore: RootStore;

  me: MeSummaryFragment = DEFAULT_ME as MeSummaryFragment;

  constructor(root: any) {
    makeAutoObservable(this);

    this.rootStore = root;
  }

  _fetchMe = async () => {
    const cookie = parse(document.cookie);
    if (cookie == null || !cookie[COOKIE_NS]) {
      return;
    }

    const apolloClient = initializeApollo();

    const {
      data: { me = DEFAULT_ME }
    } = await apolloClient
      .query<MeQuery, MeQueryVariables>({
        query: MeDocument,
        fetchPolicy: 'network-only'
      })
      .catch(e => {
        console.log(e);

        return { data: { me: DEFAULT_ME } };
      });

    this.me = me as MeSummaryFragment;
  };

  refetch = () => {
    if (!ssr) {
      this._fetchMe();
    }

    return Promise.resolve(!this.isEmpty());
  };

  get isAdmin() {
    return !!this.me.isAdmin;
  }

  getMe = () => {
    if (this.isEmpty() && !ssr) {
      this._fetchMe();
    }
    return this.me;
  };

  getUUID = () => {
    if (this.isEmpty() && !ssr) {
      this._fetchMe();
    }
    return this.me.uuid;
  };

  isEmpty = () => {
    return this.me.uuid.length == 0;
  };

  reset = () => {
    return (this.me = {
      __typename: 'UserEntityView',
      uuid: '',
      accountNumber: null,
      email: null,
      name: null,
      realName: null,
      provider: SocialProvider.App,
      profileImage: null,
      profileImageUrl: null,
      schoolVerificationStatus: SchoolVerificationStatus.None,
      studentType: null,
      isAdmin: false,
      school: null
    });
  };

  get isVerified() {
    return this.me.schoolVerificationStatus === SchoolVerificationStatus.Approved;
  }
}

export default MeStore;