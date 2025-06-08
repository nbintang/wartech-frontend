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
type FetchParamsProps<TResponse> = {
  TAG: FetchParamsKey;
  params?: any;
  endpoint: string;
} & Omit<UseQueryOptions<TResponse>, "queryKey" | "queryFn">;

const useFetchProtectedData = <TResponse>({
  TAG,
  endpoint,
  params,
  ...queryOptions
}: FetchParamsProps<TResponse>) => {
  const result = useQuery({
    queryKey: [TAG],
    queryFn: async (): Promise<TResponse> => {
      const res = await axiosInstance.get(`/protected${endpoint}`, { params });
      const data = res.data.data;
      return data as TResponse;
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
