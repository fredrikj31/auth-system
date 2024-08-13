import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string().email(),
  birthDate: z.string().date(),
});
export type User = z.infer<typeof UserSchema>;
