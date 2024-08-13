import { InternalAxiosRequestConfig } from "axios";
import cookies from "js-cookie";
import { refreshToken } from "./refreshToken";

const clearCookies = () => {
  cookies.remove("access_token");
  cookies.remove("refresh_token");
};

interface IsAccessTokenExpiredOptions {
  accessToken: string | undefined;
  refreshToken: string | undefined;
}
const isAccessTokenExpired = ({ accessToken, refreshToken }: IsAccessTokenExpiredOptions): boolean => {
  if (!refreshToken) {
    clearCookies();
    return false;
  }

  if (!accessToken) {
    return true;
  }

  try {
    const payload = JSON.parse(atob(decodeURIComponent(accessToken.split(".")[1] ?? "")));
    // 5 seconds buffer to prevent token expiring during API call
    if (new Date((payload.exp - 5) * 1000).getTime() < Date.now()) {
      return true;
    }
  } catch (error) {
    // If we can't validate the JWT access token then clear the cookies
    clearCookies();
    return false;
  }

  return false;
};

export const authInterceptor = async (axiosConfig: InternalAxiosRequestConfig) => {
  let accessTokenCookie = cookies.get("access_token");
  const refreshTokenCookie = cookies.get("refresh_token");

  if (isAccessTokenExpired({ accessToken: accessTokenCookie, refreshToken: refreshTokenCookie })) {
    await refreshToken();
    accessTokenCookie = cookies.get("access_token");
  }

  if (accessTokenCookie) {
    axiosConfig.headers.set("Authorization", accessTokenCookie);
  }

  return axiosConfig;
};
