import { AxiosError } from "axios";
import { apiClient } from "../client";
import { ApiError } from "../errors";
import type { Account } from "../../types/account";

export const loginUser = async ({
  email,
  password,
}: Pick<Account, "email" | "password">): Promise<void> => {
  try {
    await apiClient.post("/login", {
      email,
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
