import { randomBytes } from "crypto";
import * as OTPAuth from "otpauth";
import { updateTwoFactorAuthentication } from "../../../services/database/queries/account/updateTwoFactorAuthentication";
import { CommonQueryMethods } from "slonik";
import { encrypt } from "../../../helpers/encrypt";
import { config } from "../../../config";
import { getTwoFactorAuthenticationStatus } from "../../../services/database/queries/account/getTwoFactorAuthentication";
import { ConflictError } from "../../../errors/client";

interface EnableTwoFactorAuthenticationHandlerOptions {
  database: CommonQueryMethods;
  userId: string;
  label: string;
}
export const enableTwoFactorAuthenticationHandler = async ({
  database,
  userId,
  label,
}: EnableTwoFactorAuthenticationHandlerOptions): Promise<{
  authenticatorString: string;
}> => {
  const twoFactorAuthenticationSecret = randomBytes(64).toString("hex");
  const twoFactorAuthenticationSecretSalt = randomBytes(16);
  const { encryptedData, iv } = encrypt({
    text: twoFactorAuthenticationSecret,
    key: config.tokens.twoFactorAuthenticationSecret,
    iv: twoFactorAuthenticationSecretSalt,
  });

  const { isTwoFactorAuthenticationEnabled } =
    await getTwoFactorAuthenticationStatus(database, {
      userId,
    });

  if (isTwoFactorAuthenticationEnabled) {
    throw new ConflictError({
      code: "two-factor-authentication-already-enabled",
      message: "Two Factor authentication is already enabled.",
    });
  }

  await updateTwoFactorAuthentication(database, {
    userId,
    isTwoFactorAuthenticationEnabled: true,
    twoFactorAuthenticationSecret: encryptedData,
    twoFactorAuthenticationSecretSalt: iv,
  });

  const totp = new OTPAuth.TOTP({
    issuer: "Auth System",
    label: label,
    algorithm: "SHA256",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromHex(twoFactorAuthenticationSecret),
  });

  return {
    authenticatorString: totp.toString(),
  };
};
