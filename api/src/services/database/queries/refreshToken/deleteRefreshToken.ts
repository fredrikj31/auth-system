import {
  CommonQueryMethods,
  sql,
  NotFoundError as SlonikNotFoundError,
} from "slonik";
import { NotFoundError } from "../../../../errors/client";
import { logger } from "../../../../logging";
import { InternalServerError } from "../../../../errors/server";
import { RefreshTokenSchema } from "../../../../types/refreshToken";

interface DeleteRefreshTokenOptions {
  refreshTokenId: string;
}

export const deleteRefreshToken = async (
  database: CommonQueryMethods,
  { refreshTokenId }: DeleteRefreshTokenOptions,
): Promise<void> => {
  try {
    await database.any(sql.type(RefreshTokenSchema)`
      DELETE FROM
        refresh_token
      WHERE
        id = ${refreshTokenId};
    `);
  } catch (error) {
    if (error instanceof SlonikNotFoundError) {
      throw new NotFoundError({
        code: "refresh-token-not-found",
        message: "Refresh token was not found in database",
      });
    }

    logger.error({ error }, "Error while delete refresh token in database.");
    throw new InternalServerError({
      code: "unknown-error-deleting-refresh-token",
      message: "Unknown error when trying to get delete token from database",
    });
  }
};
