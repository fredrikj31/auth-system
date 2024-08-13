import { useMutation } from "@tanstack/react-query";
import { logoutUser } from ".";
import { ApiError } from "../errors";

export const useLogoutUser = () => {
  return useMutation<void, ApiError>({
    mutationFn: () => logoutUser(),
  });
};
