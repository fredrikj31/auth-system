import {
  CommonQueryMethods,
  sql,
  NotFoundError as SlonikNotFoundError,
} from "slonik";
import { Account, AccountSchema } from "../../../../types/account";
import { InternalServerError } from "../../../../errors/server";
import { logger } from "../../../../logging";
import { NotFoundError } from "../../../../errors/client";

interface GetTwoFactorAuthenticationStatusOptions {
  userId: string;
}
export const getTwoFactorAuthenticationStatus = async (
  database: CommonQueryMethods,
  { userId }: GetTwoFactorAuthenticationStatusOptions,
): Promise<Pick<Account, "isTwoFactorAuthenticationEnabled">> => {
  try {
    return await database.one(sql.type(
      AccountSchema.pick({ isTwoFactorAuthenticationEnabled: true }),
    )`
      SELECT 
        is_two_factor_authentication_enabled
      FROM
        account
      WHERE
        user_id = ${userId};
    `);
  } catch (error) {
    if (error instanceof SlonikNotFoundError) {
      throw new NotFoundError({
        code: "user-not-found",
        message: "User was not found with provided user id",
      });
    }

    logger.error(
      { error },
      "Error while getting two factor authentication account status.",
    );
    throw new InternalServerError({
      code: "unknown-error-getting-two-factor-authentication-status",
      message:
        "Unknown error when trying to get two factor authentication status",
    });
  }
};
