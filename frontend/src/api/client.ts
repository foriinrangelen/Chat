// frontend/src/api/client.ts
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request Interceptor: 요청 시 Access Token 자동 첨부
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: 401 에러 시 토큰 갱신 로직 (추후 구현)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // TODO: 401 에러 시 refreshToken으로 accessToken 갱신 로직
    // const originalRequest = error.config;
    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   try {
    //     const refreshToken = localStorage.getItem("refreshToken");
    //     const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
    //       headers: { Authorization: `Bearer ${refreshToken}` }
    //     });
    //     localStorage.setItem("accessToken", data.accessToken);
    //     originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
    //     return apiClient(originalRequest);
    //   } catch (refreshError) {
    //     localStorage.removeItem("accessToken");
    //     localStorage.removeItem("refreshToken");
    //     window.location.href = "/AuthenticationForm";
    //     return Promise.reject(refreshError);
    //   }
    // }
    return Promise.reject(error);
  }
);
