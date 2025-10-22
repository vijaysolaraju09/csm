import axios, { AxiosError, AxiosHeaders } from "axios";
import { attachMockAdapter } from "./mockAdapter";

const apiClient = axios.create({
  baseURL: "/api",
  timeout: 1500,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const headers =
        config.headers instanceof AxiosHeaders
          ? config.headers
          : AxiosHeaders.from(config.headers ?? {});

      headers.set("Authorization", `Bearer ${token}`);
      config.headers = headers;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
    }
    return Promise.reject(error);
  },
);

attachMockAdapter(apiClient);

export default apiClient;
