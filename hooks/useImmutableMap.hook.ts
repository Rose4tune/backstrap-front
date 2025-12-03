import { useState } from "react"

export interface Actions<K, V> {
  add: (key: K, value: V) => void
  upsert: (key: K, value: V) => void
  remove: (key: K) => void
  replace: (map: Map<K, V>) => void
  clear: () => void
  toArray: () => [K, V][]
  toKeyArray: () => K[]
  toValueArray: () => V[]
}

function useImmutableMap<K = any, V = any>(initialMap = new Map<K, V>()): [Map<K, V>, Actions<K, V>] {
  const [state, setState] = useState<Map<K, V>>(initialMap)

  const add = (key: K, value: V) => {
    setState((prev) => new Map([...prev, [key, value]]))
  }

  const upsert = (key: K, value: V) => {
    setState((prev) => new Map(prev).set(key, value))
  }

  const remove = (key: K) => {
    setState((prev) => {
      const newState = new Map(prev)
      newState.delete(key)
      return newState
    })
  }

  const replace = (map: Map<K, V>) => {
    setState(new Map(map))
  }

  const clear = () => {
    setState(new Map<K, V>())
  }

  const toArray = () => {
    return Array.from(state)
  }

  const toKeyArray = () => {
    return toArray().map(([key, _]) => key)
  }

  const toValueArray = () => {
    return toArray().map(([_, value]) => value)
  }

  return [
    state,
    {
      add,
      upsert,
      remove,
      replace,
      clear,
      toArray,
      toKeyArray,
      toValueArray,
    }
  ]
}

export default useImmutableMap
