import { useRouter } from "next/router"
import { useEffect } from "react"
import { observer } from "mobx-react-lite"

import { StudentType } from "@generated/graphql"
import { useStore } from "@stores/useStore.hook"

function Cert() {
  const router = useRouter()
  const { MeStore } = useStore()

  useEffect(() => {
    if (MeStore.getMe().studentType === StudentType.Postgrad) {
      router.push('/user/cert/postgraduate')
    } else if (MeStore.getMe().studentType === StudentType.Undergraduate) {
      router.push('/user/cert/undergraduate')
    } else {
      router.push('/')
    }
  }, [MeStore.me, router])

  return null
}

export default observer(Cert)
