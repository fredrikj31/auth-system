import { createHash } from "crypto";

interface GenerateHashOptions {
  password: string;
  userSalt: string;
  salt: string;
}
export const generateHash = ({ password, userSalt, salt }: GenerateHashOptions) => {
  return createHash("sha256").update(`${userSalt}${password}${salt}`).digest("hex");
};
