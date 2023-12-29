import { createStore } from "vuex";
import { authStore } from "@/store/modules/authStore";
import { boardInfoStore } from "@/store/modules/boardInfoStore";
import { postStore } from "@/store/modules/postStore";

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    authStore,
    boardInfoStore,
    postStore,
  },
});
