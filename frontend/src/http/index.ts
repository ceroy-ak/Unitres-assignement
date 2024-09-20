import axios from "axios";
import axiosRetry from "axios-retry";

const http = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

axiosRetry(http, {
  retries: 3, // Number of retries
  retryCondition: (error) => {
    // Retry if the request failed due to network errors or 5xx status codes
    return axiosRetry.isNetworkOrIdempotentRequestError(error);
  },
  retryDelay: (retryCount) => {
    // Exponential backoff for retry delay
    return retryCount * 1000; // 1s, 2s, 3s delay between retries
  },
});

// Request interceptor to handle unauthorized response and redirect
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // If response status is 401 (Unauthorized), redirect the user
      window.location.href = "/login"; // Redirect to login or any other page
    }
    return Promise.reject(error); // Continue rejecting the error if not handled
  }
);

export { http };
