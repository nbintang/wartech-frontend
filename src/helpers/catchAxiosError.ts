import { isAxiosError } from "axios";

const catchAxiosErrorMessage = (error: unknown): string | undefined => {
  console.error("error in catchAxiosError", error);
  const statusCode = [401, 429];
  if (isAxiosError(error)) {
    if (error.response?.status === 401) {
      console.log(error.response?.data.message);
      return "Invalid Credentials, Please try again or sign up";
    }
    if (error.response?.status === 429) {
      console.log(error.response?.data.message);
      return "Too many requests, Please try again later";
    }
    const errorServerMessage = error.response?.data.message;
    console.log(errorServerMessage);
    return errorServerMessage?? "An unknown error occurred.";
  }
};

export default catchAxiosErrorMessage 
