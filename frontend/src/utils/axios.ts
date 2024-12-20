import tokenStorage from "@/storage/token.storage";
import axios from "axios";
import { TokenUtil } from "./token.util";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

// Add a function to handle the retry queue
const processQueue = (error: unknown, accessToken: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    }
    else {
      prom.resolve(accessToken);
    }
  });

  failedQueue = [];
};

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 5000,
});

// Request interceptor to attach access token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessTokenValue();
    TokenUtil.handleGetAccessTokenSuccess(token, config);
    return config;
  },
  error => Promise.reject(error),
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is due to token expiration
    if (
      error.response
      && error.response.status === 401
      && !originalRequest._retry
    ) {
      if (isRefreshing) {
        // Queue the request if a refresh is already in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            TokenUtil.handleGetAccessTokenSuccess(token as string, originalRequest);
            return axios(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post<{ accessToken: string }>("/refresh");
        const newAccessToken = response.data.accessToken;
        tokenStorage.setAccessTokenValue(newAccessToken);

        processQueue(null, newAccessToken);

        TokenUtil.handleGetAccessTokenSuccess(newAccessToken, originalRequest);
        return apiClient(originalRequest);
      }
      catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      }
      finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);
