import axios from "axios";
import * as cookies from "@/utils/CookieService";
import store from "@/store";
import router from "@/router";

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
            store.dispatch("authStore/logout").then(() => {
              router.push("/login").catch(() => {});
            });
            break;
          case 403:
            if (store.getters["authStore/isAuthenticated"]) {
              alert("권한이 없습니다.");
            } else {
              router.push("/login").catch(() => {});
            }
            break;
        }
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

export default createInstance();
