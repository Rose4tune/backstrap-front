import { COOKIE_NS, COOKIE_NS_APPLE_OAUTH, COOKIE_NS_KAKAO_OAUTH } from "@constants/common/cookie.constant";
import { useCookies } from "react-cookie";

export default function useAccessToken() {
    const [cookies] = useCookies();
    const accessToken =
        cookies[COOKIE_NS]?.authPayload?.access_token ||
        cookies[COOKIE_NS_APPLE_OAUTH]?.authPayload?.access_token ||
        cookies[COOKIE_NS_KAKAO_OAUTH]?.authPayload?.access_token;

    return (
        accessToken
    )
}