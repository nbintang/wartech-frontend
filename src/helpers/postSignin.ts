import { axiosInstance } from "@/lib/axiosInstance";
import { SignInForm } from "../features/auth/signin/schema/signInSchema";
 const postSignin = async (values: SignInForm): Promise<string> => {
  const response = await axiosInstance.post(`/auth/signin`, values);
  const accessToken = response.data.data.accessToken;
  return accessToken as string;
};


export default postSignin