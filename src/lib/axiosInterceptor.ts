import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";
import  jwtDecode from "@/helpers/jwtDecoder";
import { BASE_URL } from "./axiosInstance";

const isExpiredToken = (token: string) => {
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp && decodedToken.exp < currentTime;
};

const getRefreshToken = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/auth/refresh-token`,
      null,
      {
        withCredentials: true,
      }
    );
    const accessToken = response.data.data.accessToken;
    Cookies.set("accessToken", accessToken);
    return accessToken;
  } catch (error) {
    console.log(error);
  }
};

const onRequest = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  const token = Cookies.get("accessToken");
  if (token) {
    if (isExpiredToken(token)) {
      await getRefreshToken();
      const newToken = Cookies.get("accessToken");
      if (newToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${newToken}`;
      }
    } else {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response;
};

const onResponseError = async (error: AxiosError) => {
  if (error.response) {
    const { status, data, config } = error.response;

    if (status === 401) {
      const originalRequest = config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        const newAccessToken = await getRefreshToken();
        if (newAccessToken) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        }
      }
    }
    return Promise.reject(error);
  }
  return Promise.reject(error);
};

// export const getErrorServerResponse = () => errorServerResponse;

export const setupInterceptorsTo = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
};
