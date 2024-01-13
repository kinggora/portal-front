<template>
  <div class="container">
    <v-card class="card-area" color="indigo" variant="tonal">
      <v-card-item>
        <v-form>
          <v-text-field
            label="아이디"
            v-model="auth.username"
            variant="outlined"
          ></v-text-field>
          <v-text-field
            label="비밀번호"
            type="password"
            v-model="auth.password"
            variant="outlined"
            autoComplete="off"
          ></v-text-field>
        </v-form>
      </v-card-item>
      <v-card-text>
        <div v-if="error.status" class="error-message">
          {{ error.message }}
        </div>
      </v-card-text>
      <v-card-actions class="d-flex">
        <v-btn
          class="flex-grow-1"
          variant="flat"
          height="60"
          color="indigo-darken-4"
          :loading="isLoading"
          @click="clickLoginBtn"
          >로그인
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { inject, ref } from "vue";
import { useStore } from "vuex";
import router from "@/router";
import { useRoute } from "vue-router";

export default {
  name: "SignIn",
  setup() {
    const store = useStore();
    const route = useRoute();
    const axios = inject("axios");
    let auth = ref({
      username: "",
      password: "",
    });
    let returnUrl = route.query.returnUrl;
    let error = ref({
      status: false,
      message: "",
    });

    const clickLoginBtn = () => {
      if (!auth.value.username || !auth.value.username.trim()) {
        error.value.message = "아이디를 입력해주세요.";
        error.value.status = true;
      } else if (!auth.value.password || !auth.value.password.trim()) {
        error.value.message = "비밀번호를 입력해주세요.";
        error.value.status = true;
      } else {
        submitForm();
      }
    };
    const submitForm = () => {
      startLoading();
      const loginForm = new FormData();
      loginForm.set("username", auth.value.username);
      loginForm.set("password", auth.value.password);
      axios
        .post("/signin", loginForm)
        .then(res => {
          login(res.data.data);
          if (returnUrl) {
            router.replace(returnUrl);
          } else {
            router.replace("/");
          }
        })
        .catch(e => {
          auth.value.password = "";
          if (e.response.data && e.response.data.message) {
            error.value.message = e.response.data.message;
          } else {
            error.value.message =
              "로그인을 실패했습니다. 잠시 후 다시 시도해주세요.";
          }
          error.value.status = true;
        })
        .finally(() => {
          endLoading();
        });
    };
    const login = tokens => {
      store.dispatch("authStore/login", tokens);
    };

    let isLoading = ref(false);
    const startLoading = () => {
      isLoading.value = true;
    };

    const endLoading = () => {
      isLoading.value = false;
    };

    return { auth, error, isLoading, clickLoginBtn, submitForm };
  },
};
</script>

<style scoped>
.container {
  height: 700px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-area {
  width: 700px;
  padding: 30px;
}

.v-text-field {
  margin-top: 10px;
}

.error-message {
  color: red;
}
</style>
