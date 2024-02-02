import AxiosInstance from "@/utils/AxiosInstance";

export const postStore = {
  namespaced: true,
  state: {
    post: null,
  },
  getters: {
    getPost(state) {
      return state.post;
    },
  },
  mutations: {
    setPost(state, payload) {
      state.post = payload.data;
    },
  },
  actions: {
    fetchPost({ commit }, postId) {
      return AxiosInstance.get(`/posts/${postId}`).then(res => {
        commit("setPost", res.data);
      });
    },
  },
};
