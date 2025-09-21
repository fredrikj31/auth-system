import { CommonQueryMethods } from "slonik";
import { BadRequestError } from "../../../errors/client";
import { validateJwtToken } from "../../../helpers/validateJwtToken";
import { signJwt } from "../../../helpers/signJwt";
import { config } from "../../../config";
import { checkRefreshToken } from "../../../services/database/queries/refreshToken/checkRefreshToken";
import { getProfileById } from "../../../services/database/queries/profile/getProfileById";
import { DateTime } from "luxon";

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
  const refreshTokenItem = await checkRefreshToken(database, {
    refreshTokenId,
  });

  if (
    DateTime.fromISO(refreshTokenItem.expiresAt).toUnixInteger() <
    DateTime.now().toUTC().toUnixInteger()
  ) {
    throw new BadRequestError({
      code: "refresh-token-expired",
      message: "The provided refresh token has expired",
    });
  }

  // Get user details
  const user = await getProfileById(database, {
    userId: refreshTokenItem.userId,
  });

  const expiresAt = DateTime.now()
    .toUTC()
    .plus({ seconds: config.jwt.accessTokenTTLSeconds * 1000 })
    .toISO();

  // Sign new access token
  const newAccessToken = signJwt({
    payload: {
      userId: user.userId,
      username: user.username,
    },
    expiresInSeconds: config.jwt.accessTokenTTLSeconds,
  });

  return {
    token: newAccessToken,
    expiresAt,
  };
};
