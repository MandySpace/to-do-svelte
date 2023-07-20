import axios, {
  type AxiosRequestConfig,
  type AxiosRequestHeaders,
} from "axios";
import { navigate } from "svelte-navigator";
import { user } from "../stores";

const config: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
};

const instance = axios.create(config);

instance.interceptors.request.use(
  async (config) => {
    let accessToken: string | null = window.localStorage.getItem("token");
    const refreshToken: string | null =
      window.localStorage.getItem("refreshToken");
    const expiresIn: string | null = window.localStorage.getItem("expiresIn");

    if (!!accessToken && !!expiresIn) {
      if (!!refreshToken && +expiresIn < Date.now() / 1000) {
        try {
          const response = await axios.get(
            import.meta.env.VITE_API_BASE_URL +
              `/user/regenerate-access-token?refreshToken=${encodeURIComponent(
                refreshToken
              )}&token=${encodeURIComponent(accessToken)}`
          );
          if (response.status === 200) {
            accessToken = response.data.token;
            window.localStorage.setItem("token", accessToken);
            window.localStorage.setItem(
              "refreshToken",
              response.data.refreshToken
            );
            window.localStorage.setItem("expiresIn", response.data.expiresIn);
          }
        } catch (error: any) {
          window.localStorage.clear();
          user.set(null);
          navigate("/login", { replace: true });
        }
      }

      if (config.headers) {
        config.headers["Authorization"] = "Bearer " + accessToken;
      }
      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
        config.headers["Authorization"] = "Bearer " + accessToken;
      }
    }
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
