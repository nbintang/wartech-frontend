import { z } from "zod";

export const signUpSchema = z
  .object({
    firstName: z.string().min(3, { message: "First name is required." }).trim(),
    lastName: z.string().min(3, { message: "Last name is required." }).trim(),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .max(20, { message: "Password must be at most 32 characters long." }),
    confirmPassword: z.string(),
    acceptedTOS: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
    if (!data.acceptedTOS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "You must accept the terms and conditions.",
        path: ["acceptedTOS"],
      });
    }
  });

export type SignUpForm = z.infer<typeof signUpSchema>;
