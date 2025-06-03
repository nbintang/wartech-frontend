import { z } from "zod";

export const BaseResetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
  confirmPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

export const ResetPasswordSchema = BaseResetPasswordSchema.refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);


export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
export const ResetPasswordAPISchema = BaseResetPasswordSchema.pick({ newPassword: true })
