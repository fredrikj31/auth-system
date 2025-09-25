import { createDecipheriv } from "crypto";

interface DecryptOptions {
  encryptedData: string;
  iv: string;
  key: string;
}
export const decrypt = ({ encryptedData, iv, key }: DecryptOptions): string => {
  // Create decipher
  const decipher = createDecipheriv("aes-256-cbc", key, Buffer.from(iv, "hex"));

  // Decrypt the data
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
