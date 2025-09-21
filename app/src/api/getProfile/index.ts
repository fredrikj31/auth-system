import { ProfileSchema, type Profile } from "../../types/profile";
import { apiClient } from "../client";
import { ApiError } from "../errors";

export const getProfile = async (): Promise<
  Omit<Profile, "createdAt" | "updatedAt" | "deletedAt">
> => {
  try {
    const { data } = await apiClient.get("/profiles/me");
    return ProfileSchema.omit({
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    }).parse(data);
  } catch {
    throw new ApiError({
      statusCode: 500,
      code: "unknown-error",
      message: "Unknown error while trying to profile.",
    });
  }
};
