import { z } from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 0.8; // 800kB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
export const signUpSchema = z
  .object({
    image: z
      .instanceof(File, {
        message: "Please upload an image.",
      })
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: `The image is too large. Please choose an image smaller than  1MB.`,
      })
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: "Please upload a valid image file (JPEG, PNG, or WebP).",
      })
      .or(z.string().url()).optional(),
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
