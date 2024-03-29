import { CommonQueryMethods } from "slonik";
import { loginUser } from "../../../services/database/queries/loginUser";
import { signJwt } from "../../../helpers/signJwt";
import { randomUUID } from "crypto";
import { createRefreshToken } from "../../../services/database/queries/createRefreshToken";

interface LoginUserHandlerOptions {
  database: CommonQueryMethods;
  username: string;
  password: string;
}

interface LoginUserHandlerOutput {
  accessToken: string;
  refreshToken: string;
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

  const accessToken = signJwt({
    payload: {
      userId: user.id,
      username: user.username,
    },
    expiresInSeconds: 60 * 60 * 24, // 24 hours
  });

  const refreshTokenId = randomUUID();
  const thirtyDaysInSeconds = 60 * 60 * 24 * 30; // 30 days
  const refreshToken = signJwt({
    payload: {},
    expiresInSeconds: thirtyDaysInSeconds,
    tokenId: refreshTokenId,
  });

  await createRefreshToken(database, {
    tokenId: refreshTokenId,
    userId: user.id,
    expiresAt: new Date(new Date().getTime() + thirtyDaysInSeconds * 1000).toISOString(),
  });

  return { accessToken, refreshToken };
};
