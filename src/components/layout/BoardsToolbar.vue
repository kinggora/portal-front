<template>
  <div>
    <v-toolbar color="indigo">
      <v-toolbar-title @click="moveToHome">Portal</v-toolbar-title>
      <div v-if="isAuthenticated">
        {{ name }} 님
        <v-btn v-if="isAuthenticated" @click="moveToMyPage">MYPAGE</v-btn>
        <v-btn v-if="isAuthenticated" @click="logout">LOGOUT</v-btn>
      </div>
      <div v-else>
        <v-btn v-if="!isAuthenticated" @click="moveToLogin">LOGIN</v-btn>
        <v-btn v-if="!isAuthenticated" @click="moveToSignUp">SIGNUP</v-btn>
      </div>
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

    const moveToLogin = () => {
      router.push("/login");
    };
    const moveToSignUp = () => {
      router.push("/signup");
    };

    const moveToMyPage = () => {
      router.push("/mypage");
    };
    return {
      isAuthenticated,
      name,
      logout,
      moveToHome,
      moveToLogin,
      moveToSignUp,
      moveToMyPage,
    };
  },
};
</script>
<style scoped></style>
