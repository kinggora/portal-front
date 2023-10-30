import axios from "axios";
import * as cookies from "@/utils/CookieService";

const createInstance = () => {
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
  });
  return setInterceptors(axiosInstance);
};

const setInterceptors = instance => {
  instance.interceptors.request.use(
    config => {
      const accessToken = cookies.getAccessToken();
      if (config.headers && accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    error => {
      console.log(error);
      return Promise.reject(error);
    },
  );
  return instance;
};

export default createInstance();
