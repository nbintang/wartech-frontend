import { axiosInstance } from "@/lib/axiosInstance";
import { useProgress } from "@bprogress/next";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import test from "node:test";

type FetchParamsKey =
  | "users"
  | "me"
  | "articles"
  | "comments"
  | "tags"
  | "categories"
  | "landing"
  | "category";

type ProtectedDataTags = FetchParamsKey | FetchParamsKey[] | string[];

type FetchParamsProps<TResponse> = {
  TAG: ProtectedDataTags;
  params?: any;
  endpoint: string;
} & Omit<UseQueryOptions<TResponse>, "queryKey" | "queryFn" | "placeholderData">;

const useFetchProtectedData = <TResponse>({
  TAG,
  endpoint,
  params,
  ...queryOptions
}: FetchParamsProps<TResponse>) => {
  const loader = useProgress();
  
  // Buat queryKey yang lebih unik
  const queryKey = Array.isArray(TAG) 
    ? [...TAG, endpoint, params] 
    : [TAG, endpoint, params];

  const result = useQuery({
    queryKey,
    queryFn: async (): Promise<TResponse> => {
      loader.start();
      try {
        const res = await axiosInstance.get(`/protected${endpoint}`, {
          params,
        });
        const data = res.data.data;
        return data as TResponse;
      } catch (error) {
        throw error;
      } finally {
        loader.stop();
      }
    },
    placeholderData: (prev) => prev,
    ...queryOptions,
  });

  const isUnauthorized =
    result.error &&
    isAxiosError(result.error) &&
    result.error.response?.status === 401;

  return {
    ...result,
    isUnauthorized,
  } as typeof result & { isUnauthorized: boolean };
};

export type UseFetchQueryResult<T> = ReturnType<typeof useFetchProtectedData<T>>;

export default useFetchProtectedData;