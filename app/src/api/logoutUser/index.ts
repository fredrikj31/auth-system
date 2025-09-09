import cookies from "js-cookie";
import { apiClient } from "../client";
import { ApiError } from "../errors";

export const logoutUser = async (): Promise<void> => {
  const refreshToken = cookies.get("refresh_token");
  try {
    await apiClient.post("/logout", {
      refreshToken,
    });
  } catch {
    throw new ApiError({
      statusCode: 500,
      code: "unknown-error",
      message: "Unknown error while trying to logout.",
    });
  }
};
