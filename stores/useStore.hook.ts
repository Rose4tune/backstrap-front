import { useContext } from 'react'

import { StoreContext } from './index'

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error('useStore must be used within StoreProvider')
  }
  return context
};