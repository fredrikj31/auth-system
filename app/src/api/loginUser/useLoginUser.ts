import { useMutation } from "@tanstack/react-query";
import { loginUser } from ".";
import { ApiError } from "../errors";

export const useLoginUser = () => {
  return useMutation<void, ApiError, Parameters<typeof loginUser>[0]>({
    mutationFn: (params: Parameters<typeof loginUser>[0]) => loginUser(params),
  });
};
