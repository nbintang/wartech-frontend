import { axiosInstance } from "@/lib/axiosInstance";
import { SignInForm } from "../schema/signInSchema";
export const signin = async (values: SignInForm): Promise<string> => {
  const response = await axiosInstance.post(`/auth/signin`, values);
  const accessToken = response.data.data.accessToken;
  return accessToken as string;
};
