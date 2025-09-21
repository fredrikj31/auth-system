import { useMutation } from "@tanstack/react-query";
import { signupUser } from ".";
import { ApiError } from "../errors";

export const useSignupUser = () => {
  return useMutation<void, ApiError, Parameters<typeof signupUser>[0]>({
    mutationFn: (params: Parameters<typeof signupUser>[0]) =>
      signupUser(params),
  });
};
