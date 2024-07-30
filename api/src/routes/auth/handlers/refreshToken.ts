import { CommonQueryMethods } from "slonik";
import { BadRequestError } from "../../../errors/client";
import { validateJwtToken } from "../../../helpers/validateJwtToken";
import { checkRefreshToken } from "../../../services/database/queries/checkRefreshToken";
import { signJwt } from "../../../helpers/signJwt";
import { getUserById } from "../../../services/database/queries/getUserById";
import { config } from "../../../config";

interface RefreshTokenHandlerOptions {
  database: CommonQueryMethods;
  refreshToken: string;
}

interface RefreshTokenHandlerOutput {
  token: string;
  expiresAt: string;
}

export const refreshTokenHandler = async ({
  database,
  refreshToken,
}: RefreshTokenHandlerOptions): Promise<RefreshTokenHandlerOutput> => {
  // Validate refresh token
  const refreshTokenPayload = await validateJwtToken({ token: refreshToken });

  const refreshTokenId = refreshTokenPayload.jti;
  if (!refreshTokenId) {
    throw new BadRequestError({
      code: "refresh-token-id-not-found",
      message: "Couldn't find the refresh token id inside of token",
    });
  }

  // Lookup refresh token in database
  const refreshTokenItem = await checkRefreshToken(database, { refreshTokenId });

  if (refreshTokenItem.expiresAt < new Date().toISOString()) {
    throw new BadRequestError({
      code: "refresh-token-expired",
      message: "The provided refresh token has expired",
    });
  }

  // Get user details
  const user = await getUserById(database, { userId: refreshTokenItem.userId });

  const expiresAt = new Date(Date.now() + config.jwt.accessTokenTTLSeconds * 1000).toISOString();

  // Sign new access token
  const newAccessToken = signJwt({
    payload: {
      userId: user.id,
      username: user.username,
    },
    expiresInSeconds: config.jwt.accessTokenTTLSeconds,
  });

  return {
    token: newAccessToken,
    expiresAt,
  };
};
