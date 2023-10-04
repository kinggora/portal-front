<template>
  <div>
    <v-container class="d-flex align-center flex-column mb-5">
      <v-card class="pa-9 m-3" width="600" color="indigo" variant="tonal">
        <template v-slot:text>
          <v-form @submit.prevent>
            <v-row>
              <v-text-field
                label="아이디"
                v-model="username"
                variant="outlined"
              ></v-text-field>
            </v-row>
            <v-row>
              <v-text-field
                label="비밀번호"
                type="password"
                v-model="password"
                variant="outlined"
              ></v-text-field>
            </v-row>
            <v-row class="d-flex">
              <v-btn
                class="flex-grow-1"
                variant="flat"
                height="60"
                color="indigo-darken-4"
                type="submit"
                @click="submitForm"
                >로그인
              </v-btn>
            </v-row>
          </v-form>
        </template>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { useStore } from "vuex";
import router from "@/router";

export default {
  name: "SignIn",
  setup() {
    const store = useStore();
    const setToken = token => store.commit("authStore/setToken", token);
    const setUsername = username =>
      store.commit("authStore/setUsername", username);
    return { setToken, setUsername };
  },
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    submitForm() {
      const loginForm = new FormData();
      loginForm.set("username", this.username);
      loginForm.set("password", this.password);
      this.$axios
        .post("/members/signin", loginForm)
        .then(res => {
          console.log(res.data);
          this.setToken(res.data.data);
          this.setUsername(this.username);
          router.push("/");
        })
        .catch(e => {
          console.log(e);
          this.username = "";
          this.password = "";
        });
    },
  },
};
</script>

<style scoped>
.v-text-field {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
