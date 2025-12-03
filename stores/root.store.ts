import FaGroupStore from './faGroup.store';
import MeStore from './me.store';
import UserStore from './user.store';
import BoardStore from './board.store';
import NoticeStore from './notice.store';
import AnnounceStore from './announce.store';
import HeaderStore from './header.store';

export default class RootStore {
  FaGroupStore;
  MeStore;
  UserStore;
  BoardStore;
  NoticeStore;
  AnnounceStore;
  HeaderStore; 

  constructor() {
    this.FaGroupStore = new FaGroupStore(this);
    this.MeStore = new MeStore(this);
    this.UserStore = new UserStore(this);
    this.BoardStore = new BoardStore();
    this.NoticeStore = new NoticeStore();
    this.AnnounceStore = new AnnounceStore();
    this.HeaderStore = new HeaderStore(); 
  }
}
