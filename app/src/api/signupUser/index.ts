import { AxiosError } from "axios";
import { apiClient } from "../client";
import { ApiError } from "../errors";

export interface SignupUserOptions {
  email: string;
  username: string;
  password: string;
  birthDate: string;
}

export const signupUser = async ({
  email,
  username,
  password,
  birthDate,
}: SignupUserOptions): Promise<void> => {
  try {
    await apiClient.post("/signup", {
      email,
      username,
      password,
      birthDate,
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
