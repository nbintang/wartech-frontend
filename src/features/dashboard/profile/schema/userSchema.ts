import { z } from "zod";

export const userProfileSchema = z.object({
  email: z.string().email().optional(),
  name: z
    .string()
    .min(6, { message: "Name must be at least 6 characters long." })
    .optional(),
  image: z.string().url().nullable().optional(),
});

export type UserProfileForm = z.infer<typeof userProfileSchema>;
