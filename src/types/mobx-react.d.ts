declare module 'mobx-react' {
  export * from 'mobx-react-lite';
  
  // Legacy API that might be used in the codebase
  export function inject(...stores: string[]): any;
  export function observer<T>(component: T): T;
  export function Provider(props: any): any;
}