import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import AxiosInstance from "./utils/AxiosInstance";
import { loadFonts } from "./plugins/webfontloader";

loadFonts();

const app = createApp(App).use(router).use(store).use(vuetify);
app.config.globalProperties.$axios = AxiosInstance;
app.mount("#app");
