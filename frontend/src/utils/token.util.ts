import { InternalAxiosRequestConfig } from "axios";

export const TokenUtil = {
  handleGetAccessTokenSuccess(token: string, config: InternalAxiosRequestConfig) {
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  },
};
