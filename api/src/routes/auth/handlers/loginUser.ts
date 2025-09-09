import { CommonQueryMethods } from "slonik";
import { loginUser } from "../../../services/database/queries/loginUser";
import { signJwt } from "../../../helpers/signJwt";
import { randomUUID } from "crypto";
import { createRefreshToken } from "../../../services/database/queries/createRefreshToken";
import { config } from "../../../config";

interface LoginUserHandlerOptions {
  database: CommonQueryMethods;
  username: string;
  password: string;
}

interface LoginUserHandlerOutput {
  accessToken: {
    token: string;
    expiresAt: string;
  };
  refreshToken: {
    token: string;
    expiresAt: string;
  };
}

export const loginUserHandler = async ({
  database,
  username,
  password,
}: LoginUserHandlerOptions): Promise<LoginUserHandlerOutput> => {
  const user = await loginUser(database, {
    username,
    password,
  });

  const accessTokenExpiresAt = new Date(
    new Date().getTime() + config.jwt.accessTokenTTLSeconds * 1000,
  ).toISOString();
  const accessToken = signJwt({
    payload: {
      userId: user.id,
      username: user.username,
    },
    expiresInSeconds: config.jwt.accessTokenTTLSeconds,
  });

  const refreshTokenExpiresAt = new Date(
    Date.now() + config.jwt.refreshTokenTTLSeconds * 1000,
  ).toISOString();
  const refreshTokenId = randomUUID();
  const refreshToken = signJwt({
    payload: {},
    expiresInSeconds: config.jwt.refreshTokenTTLSeconds,
    tokenId: refreshTokenId,
  });

  await createRefreshToken(database, {
    tokenId: refreshTokenId,
    userId: user.id,
    expiresAt: new Date(
      Date.now() + config.jwt.refreshTokenTTLSeconds * 1000,
    ).toISOString(),
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
