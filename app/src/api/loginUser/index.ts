import { AxiosError } from "axios";
import { apiClient } from "../client";
import { ApiError } from "../errors";

export interface LoginUserOptions {
  username: string;
  password: string;
}

export const loginUser = async ({
  username,
  password,
}: LoginUserOptions): Promise<void> => {
  try {
    await apiClient.post("/login", {
      username,
      password,
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new ApiError({
          statusCode: 404,
          code: "user-not-found",
          message: "A user with that username was not found.",
        });
      }
    }

    throw new ApiError({
      statusCode: 500,
      code: "unknown-error",
      message: "Unknown error while trying to login.",
    });
  }
};
