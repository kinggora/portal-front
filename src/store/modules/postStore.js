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
      console.log("setPost", payload);
      state.post = payload.data;
    },
  },
  actions: {
    fetchPost({ commit }, postId) {
      return AxiosInstance.get(`/posts/${postId}`)
        .then(res => {
          commit("setPost", res.data);
        })
        .catch(error => {
          switch (error.response.status) {
            case 404:
              alert("존재하지 않는 게시글입니다.");
              break;
          }
        });
    },
  },
};
