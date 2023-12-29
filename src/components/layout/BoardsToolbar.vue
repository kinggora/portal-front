<template>
  <div>
    <v-toolbar title="Portal" color="indigo">
      <div v-if="isAuthenticated">{{ name }} 님</div>
      <v-btn v-if="!isAuthenticated" @click="moveToLogin">LOGIN</v-btn>
      <v-btn v-if="!isAuthenticated" @click="moveToSignup">SIGNUP</v-btn>
      <v-btn v-if="isAuthenticated" @click="logout">LOGOUT</v-btn>
    </v-toolbar>
  </div>
</template>

<script>
import router from "@/router";
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "BoardsToolbar",
  setup() {
    const store = useStore();
    const isAuthenticated = computed(
      () => store.state.authStore.isAuthenticated,
    );
    const name = computed(() => store.getters["authStore/getMember"]?.name);
    const logout = () => {
      store.dispatch("authStore/logout");
      router.go();
    };

    const moveToHome = () => {
      router.push("/");
    };
    return { isAuthenticated, name, logout, moveToHome };
  },
  methods: {
    moveToLogin() {
      router.push("/login");
    },
    moveToSignup() {
      router.push("/signup");
    },
  },
};
</script>
<style scoped></style>
