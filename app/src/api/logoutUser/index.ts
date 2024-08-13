import { apiClient } from "../client";
import { ApiError } from "../errors";

export const logoutUser = async (): Promise<void> => {
  try {
    await apiClient.post("/logout");
  } catch (error) {
    throw new ApiError({
      statusCode: 500,
      code: "unknown-error",
      message: "Unknown error while trying to logout.",
    });
  }
};
