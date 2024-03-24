import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  password: z.string(),
  salt: z.string(),
  email: z.string().email(),
  birthDate: z.string(),
});
export type User = z.infer<typeof UserSchema>;
