import { type User, UserSchema } from "../../types/User";
import { apiClient } from "../client";
import { ApiError } from "../errors";

export const getUser = async (): Promise<User> => {
  try {
    const { data } = await apiClient.get("/users/me");
    return UserSchema.parse(data);
  } catch {
    throw new ApiError({
      statusCode: 500,
      code: "unknown-error",
      message: "Unknown error while trying to user.",
    });
  }
};
