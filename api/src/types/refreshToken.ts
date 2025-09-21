import z from "zod";

export const RefreshTokenSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  expiresAt: z.iso.datetime(),
});
export type RefreshToken = z.infer<typeof RefreshTokenSchema>;
