import { FastifyRequest } from "fastify";
import { UnauthorizedError } from "../errors/client";
import { validateJwtToken } from "../helpers/validateJwtToken";

export const validateJwt = async (request: FastifyRequest) => {
  const requestHeaders = request.headers;
  const jwtHeader = requestHeaders.authorization;

  if (!jwtHeader) {
    throw new UnauthorizedError({
      code: "access-token-not-found",
      message: "Access token wasn't found in the request headers",
    });
  }

  const validatedJwt = await validateJwtToken({ token: jwtHeader });

  request.user = { id: validatedJwt["userId"] };
};
