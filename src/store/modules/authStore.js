import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

export const authStore = {
  namespaced: true,
  state: {
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    username: null,
  },
  getters: {
    isAuthenticated(state) {
      return state.isAuthenticated;
    },
    getAccessToken(state) {
      return state.accessToken;
    },
    getRefreshToken(state) {
      return state.refreshToken;
    },
  },
  mutations: {
    setToken(state, payload) {
      state.isAuthenticated = true;
      cookies.set("accessToken", payload.accessToken);
      cookies.set("refreshToken", payload.refreshToken);
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
    },
    setUsername(state, username) {
      state.username = username;
    },
    resetState(state) {
      state.isAuthenticated = false;
      cookies.remove("accessToken");
      cookies.remove("refreshToken");
      state.accessToken = "";
      state.refreshToken = "";
    },
  },
  actions: {},
};
