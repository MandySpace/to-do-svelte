import axios, { type AxiosRequestConfig } from "axios";
import { navigate } from "svelte-routing";
import { user } from "../stores";

const config: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
};

const instance = axios.create(config);

instance.interceptors.request.use(
  (config) => {
    const TOKEN: string | null = window.localStorage.getItem("token");
    if (!TOKEN) return config;
    config.headers["Authorization"] = `Bearer ${TOKEN}`;
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      error.config.url !== "/login"
    ) {
      window.localStorage.clear();
      user.set(null);
      navigate("/login", { replace: true });
    }

    return Promise.reject(error);
  }
);

export default instance;
