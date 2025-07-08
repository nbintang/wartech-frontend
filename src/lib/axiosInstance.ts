import axios from "axios";
import { setupInterceptorsTo } from "../helpers/axiosInterceptors";

export const BASE_URL = "https://wartech-backend.vercel.app";
export const axiosInstance = setupInterceptorsTo(
  axios.create({
    baseURL: `${BASE_URL}/api`,
    withCredentials: true,
    timeout: 60000, // 60 detik untuk upload
  })
);
