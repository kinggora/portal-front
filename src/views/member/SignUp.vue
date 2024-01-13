<template>
  <div>
    <div class="container">
      <v-card class="card-area" width="600" color="indigo" variant="tonal">
        <template v-slot:text>
          <v-row class="mb-5" align="center" justify="center">
            <v-card-title class="pa-3"><h2>회원 등록</h2></v-card-title>
          </v-row>
          <v-form @submit.prevent>
            <v-row>
              <v-text-field
                label="아이디"
                v-model="input.username"
                variant="outlined"
                :rules="rules.username"
              ></v-text-field>
            </v-row>
            <v-row>
              <v-text-field
                label="비밀번호"
                type="password"
                v-model="input.password"
                variant="outlined"
                :rules="rules.password"
                autoComplete="off"
              ></v-text-field>
            </v-row>
            <v-row>
              <v-text-field
                label="닉네임"
                v-model="input.name"
                variant="outlined"
                :rules="rules.name"
              ></v-text-field>
            </v-row>
            <v-row class="d-flex">
              <v-btn
                class="flex-grow-1"
                variant="flat"
                height="60"
                color="indigo-darken-4"
                type="submit"
                :loading="isLoading"
                @click="clickSubmitBtn"
                >등록
              </v-btn>
            </v-row>
          </v-form>
        </template>
      </v-card>
    </div>
  </div>
</template>

<script>
import { inject, ref } from "vue";
import router from "@/router";

export default {
  name: "SignUp",
  components: {},
  setup() {
    const axios = inject("axios");
    let input = ref({
      username: "",
      password: "",
      name: "",
    });

    const pattern = {
      username: {
        regex: /^[a-z]{1}[a-z0-9]{5,9}$/,
        hint: "영문 소문자/숫자 6-10자리로 입력해주세요.",
      },
      password: {
        regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d~!@#$%^&*()+|=]{8,20}$/,
        hint: "영문/숫자/특수문자 8-20자리로 입력해주세요.",
      },
      name: {
        regex: /^[0-9a-zA-Zㄱ-ㅎ가-힣]{2,10}$/,
        hint: "한글/영문/숫자 2-10자리로 입력해주세요.",
      },
    };

    const rules = {
      username: [
        v => !!v || "아이디를 입력해주세요.",
        v => !/^\d.*/.test(v) || "아이디는 숫자로 시작할 수 없습니다.",
        v => pattern.username.regex.test(v) || pattern.username.hint,
      ],
      password: [
        v => !!v || "비밀번호를 입력해주세요.",
        v => pattern.password.regex.test(v) || pattern.password.hint,
      ],
      name: [
        v => !!v || "닉네임을 입력해주세요.",
        v => pattern.name.regex.test(v) || pattern.name.hint,
      ],
    };

    const validateInput = () => {
      for (let rule of rules.username) {
        if (rule(input.value.username) !== true) {
          alert(rule(input.value.username));
          return false;
        }
      }
      for (let rule of rules.password) {
        if (rule(input.value.password) !== true) {
          alert(rule(input.value.password));
          return false;
        }
      }
      for (let rule of rules.name) {
        if (rule(input.value.name) !== true) {
          alert(rule(input.value.name));
          return false;
        }
      }
      return true;
    };
    const clickSubmitBtn = () => {
      if (validateInput()) {
        submitForm();
      }
    };
    const submitForm = () => {
      startLoading();
      const form = new FormData();
      form.set("username", input.value.username);
      form.set("password", input.value.password);
      form.set("name", input.value.name);
      axios
        .post("/members", form)
        .then(() => {
          alert("회원 등록을 성공했습니다. 로그인 페이지로 이동합니다.");
          moveToLogin();
        })
        .catch(e => {
          if (e.response.data && e.response.data.message) {
            alert(e.response.data.message);
          } else {
            alert("회원 등록을 실패했습니다. 잠시 후 다시 시도해주세요.");
          }
        })
        .finally(() => {
          endLoading();
        });

      const moveToLogin = () => {
        router.push({
          path: "/login",
        });
      };
    };

    let isLoading = ref(false);
    const startLoading = () => {
      isLoading.value = true;
    };

    const endLoading = () => {
      isLoading.value = false;
    };

    return { input, rules, isLoading, clickSubmitBtn };
  },
};
</script>
<style scoped>
.v-text-field {
  margin-top: 10px;
  margin-bottom: 10px;
}

.container {
  height: 700px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-area {
  padding: 30px;
}
</style>
