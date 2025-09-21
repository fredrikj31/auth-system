import { AxiosError } from "axios";
import { apiClient } from "../client";
import { ApiError } from "../errors";
import type { Account } from "../../types/account";
import type { Profile } from "../../types/profile";

export const signupUser = async ({
  email,
  password,
  username,
  firstName,
  lastName,
  birthDate,
  gender,
}: Pick<Account, "email" | "password"> &
  Omit<
    Profile,
    "userId" | "createdAt" | "updatedAt" | "deletedAt"
  >): Promise<void> => {
  try {
    await apiClient.post("/signup", {
      email,
      password,
      username,
      firstName,
      lastName,
      birthDate,
      gender,
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 409) {
        throw new ApiError({
          statusCode: 409,
          code: "username-taken",
          message: "A user with that username already exists.",
        });
      }
    }

    throw new ApiError({
      statusCode: 500,
      code: "unknown-error",
      message: "Unknown error while trying to signup.",
    });
  }
};
