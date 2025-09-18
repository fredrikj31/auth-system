import z from "zod";

export const AccountSchema = z.object({
  userId: z.uuid(),
  email: z.email(),
  password: z.string(),
  passwordSalt: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime().nullable(),
  deletedAt: z.iso.datetime().nullable(),
});
export type Account = z.infer<typeof AccountSchema>;
