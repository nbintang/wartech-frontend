import { isAxiosError } from "axios";
import { toast } from "sonner";

const catchAxiosErrorMessage = (error: any): string | undefined => {
  console.error("error in catchAxiosError", error);
  const execptionStatusCodeMessage  = [401, 429]
  if (isAxiosError(error)) {
    if (
      typeof error.response?.status === "number" &&
     execptionStatusCodeMessage .includes(error.response?.status)
    ) {
      console.log(error.response?.data.message);
      return "Failed to verify email. Please try again later.";
    }
    const errorServerMessage = error.response?.data.message;
    console.log(errorServerMessage);
    return errorServerMessage;
  }
};

export default catchAxiosErrorMessage;
