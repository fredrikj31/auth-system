import jwt, {
  TokenExpiredError,
  JsonWebTokenError,
  JwtPayload,
} from "jsonwebtoken";
import { config } from "../config";
import { UnauthorizedError } from "../errors/client";
import { logger } from "../logging";

interface ValidateJwtOptions {
  token: string;
}

export const validateJwtToken = async ({
  token,
}: ValidateJwtOptions): Promise<JwtPayload> => {
  try {
    const jwtPayload = jwt.verify(token, config.tokens.jwtPrivateKey);
    if (typeof jwtPayload === "string") {
      return JSON.parse(jwtPayload) as JwtPayload;
    }
    return jwtPayload;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new UnauthorizedError({
        code: "token-expired",
        message: "The provided token has expired",
      });
    }

    if (
      error instanceof JsonWebTokenError &&
      error.message === "invalid token"
    ) {
      throw new UnauthorizedError({
        code: "invalid-token",
        message: "The provided token is invalid",
      });
    }

    logger.error({ error }, "Failed to validate jwt token");
    throw new UnauthorizedError({
      code: "unknown-error-validating-token",
      message: "Unknown error while trying to validate JWT token",
    });
  }
};
