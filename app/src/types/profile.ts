import z from "zod";
import { DateSchema, GenderSchema } from "./shared";

export const ProfileSchema = z.object({
  userId: z.uuid(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  birthDate: DateSchema,
  gender: GenderSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime().nullable(),
  deletedAt: z.iso.datetime().nullable(),
});
export type Profile = z.infer<typeof ProfileSchema>;
