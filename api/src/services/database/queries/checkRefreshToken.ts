import {
  CommonQueryMethods,
  sql,
  NotFoundError as SlonikNotFoundError,
} from "slonik";
import { RefreshToken, RefreshTokenSchema } from "../../../types/schemas";
import { logger } from "../../../logging";
import { InternalServerError } from "../../../errors/server";
import { NotFoundError } from "../../../errors/client";

interface CheckRefreshTokenOptions {
  refreshTokenId: string;
}

export const checkRefreshToken = async (
  database: CommonQueryMethods,
  { refreshTokenId }: CheckRefreshTokenOptions,
): Promise<RefreshToken> => {
  try {
    return await database.one(sql.type(RefreshTokenSchema)`
      SELECT
        *
      FROM
        refresh_tokens
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

    logger.error({ error }, "Error while getting refresh token in database.");
    throw new InternalServerError({
      code: "unknown-error-getting-refresh-token",
      message: "Unknown error when trying to get refresh token from database",
    });
  }
};
