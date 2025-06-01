import { isAxiosError } from "axios";
import { toast } from "sonner";

export const catchAxiosError = (error: any) => {
  console.error("error in catchAxiosError", error);
  if (isAxiosError(error)) {
    const errorServerMessage = error.response?.data.message;
    console.log(errorServerMessage);
    return errorServerMessage;
  }
};
