import { AxiosError } from "axios";
import { apiClient } from "../client";
import { ApiError } from "../errors";

export const refreshToken = async (): Promise<void> => {
  try {
    await apiClient.post("/token");
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 400) {
        throw new ApiError({
          statusCode: 400,
          code: "refresh-token-not-found",
          message: "The refresh token was not found in the request",
        });
      }
    }

    throw new ApiError({
      statusCode: 500,
      code: "unknown-error",
      message: "Unknown error while trying to refresh token.",
    });
  }
};
