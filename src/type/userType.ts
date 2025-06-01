import { z } from 'zod';
const userProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  verified: z.boolean(),
  image: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type UserProfileResponse = z.infer<typeof userProfileSchema>;