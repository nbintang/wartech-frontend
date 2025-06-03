import { isAxiosError } from "axios";
import { toast } from "sonner";

const catchAxiosErrorMessage = (error: unknown): string | undefined => {
  console.error("error in catchAxiosError", error);
  const statusCode = [401, 429];
  if (isAxiosError(error)) {
    if (
      typeof error.response?.status === "number" &&
      statusCode.includes(error.response?.status)
    ) {
      console.log(error.response?.data.message);
      return "Invalid Credentials";
    }
    const errorServerMessage = error.response?.data.message;
    console.log(errorServerMessage);
    return errorServerMessage;
  }
};

export default catchAxiosErrorMessage;
