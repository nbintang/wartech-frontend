import { UseMutationOptions } from "@tanstack/react-query";
import { z } from "zod";

type IgnoreMutationOptions =
  | "mutationFn"
  | "mutationKey"
  | "onMutate"
  | "onSuccess"
  | "onError";

type MutateParamKeys =
  | "users"
  | "profile"
  | "articles"
  | "comments"
  | "tags"
  | "categories";
type PostProtectedDataProps<TFormSchema extends z.ZodSchema, TResponse> = {
  TAG: MutateParamKeys;
  endpoint: string;
  params?: any;
  formSchema: TFormSchema;
  redirect?: boolean;
  redirectUrl?: string;
} & Omit<
  UseMutationOptions<
    TResponse,
    unknown,
    z.infer<TFormSchema>,
    unknown
  >,
  IgnoreMutationOptions
>;


