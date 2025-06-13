import { axiosInstance } from "@/lib/axiosInstance";

const fetchSearchedData = async <T>(
  endpoint: string,
  params: Record<string, string | undefined | null> = {}
): Promise<T[]> =>
  (await axiosInstance.get(`/protected${endpoint}`, { params })).data.data
    .items as T[];

export default fetchSearchedData;
