import { z } from "zod";

export const GenderSchema = z.enum(["MALE", "FEMALE", "PREFER_NOT_TO_SAY"]);
export type Gender = z.infer<typeof GenderSchema>;

export const DateSchema = z.iso.date();
