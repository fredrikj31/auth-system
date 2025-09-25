import { CommonQueryMethods, sql } from "slonik";
import { Account, AccountSchema } from "../../../../types/account";
import { InternalServerError } from "../../../../errors/server";
import { logger } from "../../../../logging";
import { DateTime } from "luxon";

interface UpdateTwoFactorAuthenticationOptions {
  userId: string;
  isTwoFactorAuthenticationEnabled: boolean;
  twoFactorAuthenticationSecret: string | null;
  twoFactorAuthenticationSecretSalt: string | null;
}
export const updateTwoFactorAuthentication = async (
  database: CommonQueryMethods,
  {
    userId,
    isTwoFactorAuthenticationEnabled,
    twoFactorAuthenticationSecret,
    twoFactorAuthenticationSecretSalt,
  }: UpdateTwoFactorAuthenticationOptions,
): Promise<Account> => {
  try {
    return await database.one(sql.type(AccountSchema)`
      UPDATE
        account
      SET
        is_two_factor_authentication_enabled = ${isTwoFactorAuthenticationEnabled},
        two_factor_authentication_secret = ${twoFactorAuthenticationSecret},
        two_factor_authentication_secret_salt = ${twoFactorAuthenticationSecretSalt},
        updated_at = ${DateTime.now().toUTC().toISO()}
      WHERE
        user_id = ${userId}
      RETURNING *;
    `);
  } catch (error) {
    logger.error(
      { error },
      "Error while updating two factor authentication account status.",
    );
    throw new InternalServerError({
      code: "unknown-error-updating-two-factor-authentication-status",
      message: "Unknown error when trying to update two factor authentication",
    });
  }
};
