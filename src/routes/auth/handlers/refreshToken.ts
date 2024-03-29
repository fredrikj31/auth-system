import { CommonQueryMethods } from "slonik";
import { BadRequestError } from "../../../errors/client";
import { validateJwt } from "../../../helpers/validateJwt";
import { checkRefreshToken } from "../../../services/database/queries/checkRefreshToken";
import { signJwt } from "../../../helpers/signJwt";
import { getUserById } from "../../../services/database/queries/getUserById";

interface RefreshTokenHandlerOptions {
  database: CommonQueryMethods;
  refreshToken: string;
}

export const refreshTokenHandler = async ({ database, refreshToken }: RefreshTokenHandlerOptions): Promise<string> => {
  // Validate refresh token
  const refreshTokenPayload = await validateJwt({ token: refreshToken });

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

  // Sign new access token
  const newAccessToken = signJwt({
    payload: {
      userId: user.id,
      username: user.username,
    },
    expiresInSeconds: 60 * 60 * 24, // 24 hours
  });

  return newAccessToken;
};
