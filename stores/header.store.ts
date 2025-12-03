import { action, makeObservable, observable } from 'mobx';

export default class HeaderStore {
  constructor() {
    makeObservable(this, {
      /* observables */
      isMessageOpen: observable,
      isSendMessageOpen: observable,
      type: observable,
      uuid: observable,
      messageRoomsReloadKey: observable,
      /* actions */
      setIsSendMessageOpen: action,
      setIsMessageOpen: action,
      setType: action,
      setUuid: action,
      bumpMessageRoomsReloadKey: action
    });
  }

  isMessageOpen: boolean = false;
  isSendMessageOpen: boolean = false;
  type: string = ""
  uuid: string = ""
  messageRoomsReloadKey = 0;

  setType = (value: string) => {
    this.type = value;
  }
  setUuid = (value: string) => {
    this.uuid = value;
  }
  setIsSendMessageOpen = (value: boolean) => {
    this.isSendMessageOpen = value;
  }
  setIsMessageOpen = (value: boolean) => {
    this.isMessageOpen = value;
  };
  bumpMessageRoomsReloadKey() {
    this.messageRoomsReloadKey += 1;
  }
}
