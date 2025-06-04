import { axiosInstance } from "@/lib/axiosInstance";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { isAxiosError } from "axios";
type FetchParamsKey =
  | "users"
  | "profile"
  | "articles"
  | "comments"
  | "tags"
  | "categories";
type FetchParamsProps<T> = {
  TAG: FetchParamsKey;
  endpoint: string;
} & Omit<UseQueryOptions<T>, "queryKey" | "queryFn">;

const useFetchProtectedData = <T>({
  TAG,
  endpoint,
  ...queryOptions
}: FetchParamsProps<T>) => {
  const result = useQuery({
    queryKey: [TAG],
    queryFn: async (): Promise<T> => {
      const res = await axiosInstance.get(`/protected${endpoint}`);
      const data = res.data.data;
      return data;
    },
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
export default useFetchProtectedData;
