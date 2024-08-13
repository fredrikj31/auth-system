import { useMutation } from "@tanstack/react-query";
import { signupUser, SignupUserOptions } from ".";
import { ApiError } from "../errors";

export const useSignupUser = () => {
  return useMutation<void, ApiError, SignupUserOptions>({
    mutationFn: (params: SignupUserOptions) => signupUser(params),
  });
};
