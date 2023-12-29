import * as cookies from "@/utils/CookieService";
import AxiosInstance from "@/utils/AxiosInstance";

export const authStore = {
  namespaced: true,
  state: {
    isAuthenticated: !!cookies.getAccessToken(),
    member: {},
    accessToken: cookies.getAccessToken(),
    refreshToken: cookies.getRefreshToken(),
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
    getMember(state) {
      return state.member;
    },
  },
  mutations: {
    setMember(state, payload) {
      console.log("setMember", payload);
      state.member.id = payload.id;
      state.member.username = payload.username;
      state.member.name = payload.name;
      state.member.roles = payload.roles;
    },
    setAuthenticated(state, status) {
      console.log("setAuthenticated", status);
      state.isAuthenticated = status;
    },
    resetState(state) {
      state.isAuthenticated = false;
      state.member = {};
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
  actions: {
    login({ dispatch }, tokens) {
      cookies.addAccessToken(tokens.accessToken);
      cookies.addRefreshToken(tokens.refreshToken);
      dispatch("fetchMember");
    },
    logout({ commit }) {
      commit("resetState");
      cookies.removeAccessToken();
      cookies.removeRefreshToken();
    },
    fetchMember({ commit }) {
      // AxiosInstance interceptor 에 의해 쿠키에 있는 accessToken 을 request 에 포함
      AxiosInstance.get("/members")
        .then(res => {
          console.log(res.data);
          commit("setAuthenticated", true);
          commit("setMember", res.data.data);
        })
        .catch(() => {
          commit("resetState");
        });
    },
  },
};
