import axios from "axios";
import { config } from "../config";
import { authInterceptor } from "./interceptor";

export const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  withCredentials: true,
});

apiClient.interceptors.request.use(authInterceptor);
