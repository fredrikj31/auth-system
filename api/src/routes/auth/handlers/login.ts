import { CommonQueryMethods } from "slonik";
import { loginAccount } from "../../../services/database/queries/account/loginAccount";
import { signJwt } from "../../../helpers/signJwt";
import { randomUUID } from "crypto";
import { createRefreshToken } from "../../../services/database/queries/refreshToken/createRefreshToken";
import { config } from "../../../config";
import { DateTime } from "luxon";

interface LoginHandlerOptions {
  database: CommonQueryMethods;
  email: string;
  password: string;
}
export const loginHandler = async ({
  database,
  email,
  password,
}: LoginHandlerOptions): Promise<{
  accessToken: {
    token: string;
    expiresAt: string;
  };
  refreshToken: {
    token: string;
    expiresAt: string;
  };
}> => {
  const user = await loginAccount(database, {
    email,
    password,
  });

  const accessTokenExpiresAt = DateTime.now()
    .toUTC()
    .plus({ seconds: config.jwt.accessTokenTTLSeconds * 1000 })
    .toISO();
  const accessToken = signJwt({
    payload: {
      userId: user.userId,
      email: user.email,
    },
    expiresInSeconds: config.jwt.accessTokenTTLSeconds,
  });

  const refreshTokenExpiresAt = DateTime.now()
    .toUTC()
    .plus({ seconds: config.jwt.refreshTokenTTLSeconds * 1000 })
    .toISO();
  const refreshTokenId = randomUUID();
  const refreshToken = signJwt({
    payload: {},
    expiresInSeconds: config.jwt.refreshTokenTTLSeconds,
    tokenId: refreshTokenId,
  });

  await createRefreshToken(database, {
    tokenId: refreshTokenId,
    userId: user.userId,
    expiresAt: DateTime.now()
      .toUTC()
      .plus({ seconds: config.jwt.refreshTokenTTLSeconds * 1000 })
      .toISO(),
  });

  return {
    accessToken: {
      token: accessToken,
      expiresAt: accessTokenExpiresAt,
    },
    refreshToken: {
      token: refreshToken,
      expiresAt: refreshTokenExpiresAt,
    },
  };
};
