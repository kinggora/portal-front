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
    isAdmin(state) {
      if (state.member && state.member.roles) {
        for (let role of state.member.roles) {
          if (role === "ADMIN") {
            return true;
          }
        }
      }
      return false;
    },
  },
  mutations: {
    setMember(state, payload) {
      state.member.id = payload.id;
      state.member.username = payload.username;
      state.member.name = payload.name;
      state.member.roles = payload.roles;
    },
    setAuthenticated(state, status) {
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
    login({ dispatch, commit }, tokens) {
      cookies.addAccessToken(tokens.accessToken);
      cookies.addRefreshToken(tokens.refreshToken);
      commit("setAuthenticated", true);
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
          commit("setMember", res.data.data);
        })
        .catch(() => {
          commit("resetState");
        });
    },
  },
};
