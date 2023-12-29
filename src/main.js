import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import AxiosInstance from "./utils/AxiosInstance";

const app = createApp({
  extends: App,
  beforeCreate() {
    if (store.getters["authStore/getAccessToken"]) {
      store.dispatch("authStore/fetchMember").then(res => {
        return res;
      });
    }
  },
})
  .use(store)
  .use(vuetify)
  .use(router);
app.provide("axios", AxiosInstance);
app.mount("#app");
