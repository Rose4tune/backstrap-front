import { ReviewDetailFragment, SchoolVerificationStatus } from "@generated/graphql";
import { uniqBy } from "lodash";

function flattenReviews(reviews: ReviewDetailFragment[]) {
  const _reviews: ReviewDetailFragment[] = []
  reviews.forEach(review => {
    _reviews.push(review)
    review.childReviews?.forEach(cReview => {
      if (cReview) _reviews.push(cReview)
    })
  })
  return _reviews
}

function sortReviewsWithCreatedDate(reviews: ReviewDetailFragment[]) {
  return reviews.sort((a, b) => {
    if (a.createdDate > b.createdDate) return 1
    else return -1
  })
}

/**
 * 
 * @param reviews 
 * @param boardUserUuid 
 * @returns {string[]} uuid list. 각 uuid의 index+1이 익명 번호
 */
function getAnonymousReviewSequence(reviews: ReviewDetailFragment[], boardUserUuid: string | nil) {
  const flattendReviews = flattenReviews(reviews).filter((review) => review.user?.uuid !== boardUserUuid)
  const sortedReviews = sortReviewsWithCreatedDate(flattendReviews)
  const anonymousReviews = sortedReviews.filter(_review => _review.isAnonymous)
  return uniqBy(anonymousReviews, "user.uuid").map(r => r.user?.uuid)
}

export function resolveAnonymousUserName(reviews: ReviewDetailFragment[], review: ReviewDetailFragment, boardUserUuid: string | nil) {
  const anonymousSeq = getAnonymousReviewSequence(reviews, boardUserUuid).findIndex(s => s === review.user?.uuid) + 1

  const username = review.isAnonymous
  ? review.user?.uuid === boardUserUuid
    ? "익명의 글쓴끈"
    : `익명의 끈 ${anonymousSeq < 1 ? "" : anonymousSeq}`
  : review.user?.name || ""

  const schoolInfo = review.user?.schoolVerificationStatus === SchoolVerificationStatus.Approved
    ? ` | ${review.user.school?.name ?? ''}`
    : ''

  return username + schoolInfo
}
