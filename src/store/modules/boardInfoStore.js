import AxiosInstance from "@/utils/AxiosInstance";
import router from "@/router";

export const boardInfoStore = {
  namespaced: true,
  state: {
    boardInfo: null,
    boardInfos: null,
  },
  getters: {
    getBoardInfo(state) {
      return state.boardInfo;
    },
    getBoardInfos(state) {
      return state.boardInfos;
    },
  },
  mutations: {
    setBoardInfo(state, payload) {
      console.log("setBoardInfo", payload);
      state.boardInfo = payload.data;
    },
    setBoardInfos(state, payload) {
      console.log("setBoardInfos", payload);
      state.boardInfos = payload.data;
    },
  },
  actions: {
    fetchBoardInfo({ commit }, boardId) {
      return AxiosInstance.get(`/boards/${boardId}`)
        .then(res => {
          commit("setBoardInfo", res.data);
        })
        .catch(error => {
          switch (error.response.status) {
            case 404:
              router.push("/").catch(() => {});
              break;
          }
        });
    },
    fetchBoardInfos({ commit }) {
      return AxiosInstance.get("/boards")
        .then(res => {
          commit("setBoardInfos", res.data);
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
};
