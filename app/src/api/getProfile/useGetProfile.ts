import { useQuery } from "@tanstack/react-query";
import { getProfile } from ".";
import { ApiError } from "../errors";
import type { Profile } from "../../types/profile";

export const useGetProfile = () => {
  return useQuery<
    Omit<Profile, "createdAt" | "updatedAt" | "deletedAt">,
    ApiError
  >({
    queryFn: () => getProfile(),
    queryKey: ["profile"],
    retry: false,
  });
};
