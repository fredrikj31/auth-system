import {
  CommonQueryMethods,
  ForeignKeyIntegrityConstraintViolationError,
  sql,
} from "slonik";
import { RefreshToken, RefreshTokenSchema } from "../../../types/schemas";
import { logger } from "../../../logging";
import { InternalServerError } from "../../../errors/server";
import { BadRequestError } from "../../../errors/client";

interface CreateRefreshTokenOptions {
  tokenId: string;
  userId: string;
  expiresAt: string;
}

export const createRefreshToken = async (
  database: CommonQueryMethods,
  { tokenId, userId, expiresAt }: CreateRefreshTokenOptions,
): Promise<RefreshToken> => {
  try {
    return await database.one(sql.type(RefreshTokenSchema)`
      INSERT INTO 
        refresh_tokens (
          id, 
          user_id,
          expires_at
        ) 
      VALUES
        (
          ${tokenId}, 
          ${userId},
          ${expiresAt}
        )
      RETURNING *;
    `);
  } catch (error) {
    if (error instanceof ForeignKeyIntegrityConstraintViolationError) {
      logger.error(
        { error },
        "User id doesn't match any user ids in users table",
      );
      throw new BadRequestError({
        code: "user-id-not-found",
        message: "The provided user id doesn't exists in users table",
      });
    }

    logger.error({ error }, "Error while creating refresh token in database.");
    throw new InternalServerError({
      code: "unknown-error-creating-new-refresh-token",
      message: "Unknown error when trying to create refresh token in database",
    });
  }
};
