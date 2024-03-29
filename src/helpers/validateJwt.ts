import jwt, { TokenExpiredError, JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { BadRequestError } from "../errors/client";
import { logger } from "../logging";
import { InternalServerError } from "../errors/server";

interface ValidateJwtOptions {
  token: string;
}

export const validateJwt = async ({ token }: ValidateJwtOptions): Promise<JwtPayload> => {
  try {
    const jwtPayload = jwt.verify(token, config.jwtPrivateKey);
    if (typeof jwtPayload === "string") {
      return JSON.parse(jwtPayload) as JwtPayload;
    }
    return jwtPayload;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new BadRequestError({
        code: "token-expired",
        message: "The provided token has expired",
      });
    }

    logger.error({ error }, "Failed to validate jwt token");
    throw new InternalServerError({
      code: "unknown-error-validating-token",
      message: "Unknown error while trying to validate JWT token",
    });
  }
};
