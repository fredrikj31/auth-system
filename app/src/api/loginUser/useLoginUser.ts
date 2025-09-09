import { useMutation } from "@tanstack/react-query";
import { loginUser, LoginUserOptions } from ".";
import { ApiError } from "../errors";

export const useLoginUser = () => {
  return useMutation<void, ApiError, LoginUserOptions>({
    mutationFn: ({ username, password }: LoginUserOptions) =>
      loginUser({ username, password }),
  });
};
