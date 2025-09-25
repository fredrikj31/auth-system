import { createCipheriv } from "crypto";

interface EncryptOptions {
  text: string;
  key: string;
  iv: Buffer<ArrayBufferLike>;
}
export const encrypt = ({
  text,
  key,
  iv,
}: EncryptOptions): { iv: string; encryptedData: string } => {
  // Create cipher with AES-256-CBC
  const cipher = createCipheriv("aes-256-cbc", key, iv);

  // Encrypt the data
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Return both the encrypted data and the IV
  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted,
  };
};
