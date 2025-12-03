import qs from "qs"

import {
  LINK_PATH_BOARD_DETAIL,
  LINK_PATH_SCHOOL_VERIFY,
  LINK_PATH_TIMETABLE,
} from "@constants/bagstrap/etc/link.constant"
import MeStore from "@stores/me.store"
import { StudentType } from "@generated/graphql"

export const resolveLinkPath = (actionUrl: string, meStore?: MeStore): string | undefined => {
  const parsed = actionUrl
    ? qs.parse(actionUrl.substring(actionUrl.indexOf("?") + 1))
    : undefined

  const linkUrl = parsed?.link as string | undefined

  const linkPath = linkUrl && new URL(linkUrl).pathname

  const linkParam = linkUrl?.split("?")?.[1]

  const uuid = linkParam && (qs.parse(linkParam)?.uuid as string | undefined)

  if (linkPath === LINK_PATH_BOARD_DETAIL && uuid) {
    return `/board/post/${uuid}`
  }

  if (linkPath === LINK_PATH_SCHOOL_VERIFY) {
    // console.log(meStore)
    if (meStore && !meStore?.isEmpty()) {
      if (!meStore.isVerified) {
        if (meStore.getMe().studentType === StudentType.Postgrad) {
          return `/user/cert/postgraduate`
        } else if (meStore.getMe().studentType === StudentType.Postgrad) {
          return `/user/cert/undergraduate`
        }
      } else {
        return `/my/profile`
      }
    } else {
      return '/user/sign-in'
    }
  }

  if (linkPath === LINK_PATH_TIMETABLE) {
    return "https://bagstrap.netlify.com/"
  }
}
