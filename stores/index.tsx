import { createContext, useContext } from 'react'

import RootStore from '@stores/root.store'

let store: any;

export const StoreContext = createContext(new RootStore());

export function StoreProvider({ children, initialState }: any) {
  const store = initializeStore(initialState)

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
};

function initializeStore(initialData = null) {
  const _store = store ?? new RootStore()

  if (initialData) {
    /* initial data hydrate */
    /* pageProps를 통해 store에 저장할 게 있는 경우 사용 */
  }

  // ssr, ssg
  if (typeof window === 'undefined') return _store

  // csr
  if (!store) store = _store

  return _store
}