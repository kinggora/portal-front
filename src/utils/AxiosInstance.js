import axios from "axios";
import * as cookies from "@/utils/CookieService";
import store from "@/store";

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

  instance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response && error.response.status) {
        console.log(error.response);
        switch (error.response.status) {
          case 401:
            store.dispatch("authStore/logout").then(() => {});
            break;
        }
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

export default createInstance();
