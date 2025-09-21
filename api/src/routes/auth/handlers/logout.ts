import { CommonQueryMethods } from "slonik";
import { validateJwtToken } from "../../../helpers/validateJwtToken";
import { BadRequestError } from "../../../errors/client";
import { deleteRefreshToken } from "../../../services/database/queries/refreshToken/deleteRefreshToken";

interface LogoutHandlerOptions {
  database: CommonQueryMethods;
  refreshToken: string;
}
export const logoutHandler = async ({
  database,
  refreshToken,
}: LogoutHandlerOptions): Promise<void> => {
  const refreshTokenPayload = await validateJwtToken({ token: refreshToken });

  if (!refreshTokenPayload.jti) {
    throw new BadRequestError({
      code: "refresh-token-id-not-found",
      message: "Could not find refresh token id in the token.",
    });
  }

  await deleteRefreshToken(database, {
    refreshTokenId: refreshTokenPayload.jti,
  });
};
