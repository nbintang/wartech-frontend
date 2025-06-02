import axios from "axios";
import { setupInterceptorsTo } from "../hooks/axiosInterceptors";


export const BASE_URL = "https://wartech-backend.vercel.app";
export const axiosInstance = setupInterceptorsTo(
  axios.create({
    baseURL: `${BASE_URL}/api`,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  })
);
