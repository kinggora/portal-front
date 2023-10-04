import axios from "axios";
import { useCookies } from "vue3-cookies";

const createInstance = () => {
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
  });
  return setInterceptors(axiosInstance);
};

const setInterceptors = instance => {
  instance.interceptors.request.use(
    config => {
      const { cookies } = useCookies();
      const accessToken = cookies.get("accessToken");
      if (config.headers && accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    error => Promise.reject(error),
  );
  return instance;
};

export default createInstance();
