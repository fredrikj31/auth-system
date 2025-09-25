import { CommonQueryMethods } from "slonik";
import { updateTwoFactorAuthentication } from "../../../services/database/queries/account/updateTwoFactorAuthentication";

interface DisableTwoFactorAuthenticationHandlerOptions {
  database: CommonQueryMethods;
  userId: string;
}
export const disableTwoFactorAuthenticationHandler = async ({
  database,
  userId,
}: DisableTwoFactorAuthenticationHandlerOptions): Promise<void> => {
  await updateTwoFactorAuthentication(database, {
    userId,
    isTwoFactorAuthenticationEnabled: false,
    twoFactorAuthenticationSecret: null,
    twoFactorAuthenticationSecretSalt: null,
  });

  return;
};
