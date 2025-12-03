export const COOKIE_NS = "www_bagstrap_team";

export type CookieSchema = {
  readonly [COOKIE_NS]?: {
    readonly authPayload?: AuthPayload;
  };
};

export const COOKIE_NS_APPLE_OAUTH = "bagstrap_apple_oauth";
export const COOKIE_NS_KAKAO_OAUTH = "bagstrap_kakao_oauth";
