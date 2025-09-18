import { z } from "zod";

export const GenderSchema = z.enum(["MALE", "FEMALE", "PREFER_NOT_TO_SAY"]);
export type Gender = z.infer<typeof GenderSchema>;

export const DateSchema = z.regex(
  /^(?:19[0-9]{2}|2[0-1][0-9]{2})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])$/,
);
