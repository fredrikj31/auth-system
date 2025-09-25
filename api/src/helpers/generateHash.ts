import { createHash } from "crypto";

interface GenerateHashOptions {
  text: string;
  salt: string;
  secret: string;
}
export const generateHash = ({ text, salt, secret }: GenerateHashOptions) => {
  return createHash("sha256").update(`${secret}${text}${salt}`).digest("hex");
};
