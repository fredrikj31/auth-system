import { useQuery } from "@tanstack/react-query";
import { getUser } from ".";
import { ApiError } from "../errors";
import { type User } from "../../types/User";

export const useGetUser = () => {
  return useQuery<User, ApiError>({
    queryFn: () => getUser(),
    queryKey: ["user"],
    retry: false,
  });
};
