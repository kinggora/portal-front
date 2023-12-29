import AxiosInstance from "@/utils/AxiosInstance";

export const boardInfoStore = {
  namespaced: true,
  state: {
    boardInfo: null,
  },
  getters: {
    getBoardInfo(state) {
      return state.boardInfo;
    },
  },
  mutations: {
    setBoardInfo(state, payload) {
      console.log("setBoardInfo", payload);
      state.boardInfo = payload.data;
    },
  },
  actions: {
    fetchBoardInfo({ commit }, boardId) {
      return AxiosInstance.get(`/boards/${boardId}`)
        .then(res => {
          commit("setBoardInfo", res.data);
        })
        .catch(e => {
          console.log(e.data);
        });
    },
  },
};
