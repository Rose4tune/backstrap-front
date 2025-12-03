// 전역 타입 선언
declare global {
  interface Window {
    ChannelIO: {
      (command: 'boot', options: { pluginKey: string }): void;
      (command: 'show' | 'hide' | 'shutdown'): void;
      (command: string, options?: any): void;
    };
    Kakao: any;
    AppleID: any;
  }
}

export {};