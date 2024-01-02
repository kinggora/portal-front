<template>
  <div>
    <v-container class="d-flex flex-column align-center">
      <v-card class="card-area" width="1000" color="indigo" variant="tonal">
        <v-card-title class="text-center text-h4 font-weight-bold"
          >MY PAGE
        </v-card-title>
        <v-card-text class="mb-4">
          <v-row>
            <v-col cols="1"> 아이디</v-col>
            <v-col cols="2">
              {{ member.username }}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="1" class="mt-3">닉네임</v-col>
            <v-col cols="5" class="d-flex align-center">
              <v-text-field
                v-model="input.name"
                variant="outlined"
                :hint="pattern.name.hint"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-btn
                variant="outlined"
                height="40px"
                :disabled="input.name === member.name"
                @click="clickModifyNameBtn"
                >변경
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-dialog
              v-model="passwordDialog"
              persistent
              width="1024"
              color="indigo"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  class="ml-2"
                  color="indigo-darken-3"
                  variant="flat"
                  v-bind="props"
                  @click="openPasswordDialog"
                  >비밀번호 변경
                </v-btn>
              </template>
              <v-card class="card-area">
                <v-card-title class="text-center text-h5 font-weight-bold"
                  >비밀번호 변경
                </v-card-title>
                <v-card-item class="dialog-item-area">
                  <v-row>
                    <v-col cols="2" class="mt-3">기존 비밀번호</v-col>
                    <v-col cols="5" class="d-flex align-center">
                      <v-text-field
                        type="password"
                        v-model="input.currentPassword"
                        variant="outlined"
                        density="compact"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2" class="mt-3">새 비밀번호</v-col>
                    <v-col cols="5" class="d-flex align-center">
                      <v-text-field
                        type="password"
                        v-model="input.newPassword"
                        variant="outlined"
                        :hint="pattern.newPassword.hint"
                        persistent-hint
                        density="compact"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2" class="mt-3">새 비밀번호 확인</v-col>
                    <v-col cols="5" class="d-flex align-center">
                      <v-text-field
                        type="password"
                        v-model="input.newPassword2"
                        variant="outlined"
                        density="compact"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-item>
                <v-card-actions class="ma-3">
                  <v-row class="justify-space-between">
                    <v-btn
                      color="indigo-darken-3"
                      variant="tonal"
                      width="150"
                      @click="closePasswordDialog"
                      >취소
                    </v-btn>
                    <v-btn
                      color="indigo-darken-3"
                      variant="flat"
                      width="150"
                      @click="clickModifyPasswordBtn"
                      >변경
                    </v-btn>
                  </v-row>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
        </v-card-text>
        <v-card-item class="justify-end">
          <v-btn variant="tonal">회원 탈퇴</v-btn>
        </v-card-item>
      </v-card>
    </v-container>
    {{ input.name }}
  </div>
</template>

<script>
import store from "@/store";
import { inject, watch, ref } from "vue";
import router from "@/router";

export default {
  name: "MyPage",
  components: {},
  setup() {
    let member = store.getters["authStore/getMember"];
    const axios = inject("axios");
    let input = ref({
      name: member.name,
      currentPassword: "",
      newPassword: "",
      newPassword2: "",
    });

    watch(
      () => member.name,
      newValue => {
        input.value.name = newValue;
      },
    );

    let passwordDialog = ref(false);
    let openPasswordDialog = () => {
      passwordDialog.value = true;
    };
    let closePasswordDialog = () => {
      passwordDialog.value = false;
    };

    const pattern = {
      newPassword: {
        regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d~!@#$%^&*()+|=]{8,20}$/,
        hint: "영문/숫자/특수문자 8-20자리",
        message: "비밀번호는 영문/숫자/특수문자 8-20자리로 입력해주세요.",
      },
      name: {
        regex: /^[0-9a-zA-Zㄱ-ㅎ가-힣]{2,10}$/,
        hint: "한글/영문/숫자 2-10자리",
        message: "닉네임은 한글/영문/숫자 2-10자리로 입력해주세요.",
      },
    };

    const rules = {
      name: [
        v => !!v || "닉네임을 입력해주세요.",
        v => pattern.name.regex.test(v) || pattern.name.message,
      ],
      currentPassword: [v => !!v || "비밀번호를 입력해주세요."],
      newPassword: [
        v => !!v || "새 비밀번호를 입력해주세요.",
        v => pattern.newPassword.regex.test(v) || pattern.newPassword.message,
        v =>
          v !== input.value.currentPassword ||
          "새 비밀번호가 기존 비밀번호와 동일합니다.",
      ],
      newPassword2: [
        v => !!v || "새 비밀번호 확인을 입력해주세요.",
        v =>
          v === input.value.newPassword ||
          "새 비밀번호와 동일하게 입력해주세요.",
      ],
    };

    const validateName = () => {
      for (let rule of rules.name) {
        if (rule(input.value.name) !== true) {
          alert(rule(input.value.name));
          return false;
        }
      }
      return true;
    };

    const validatePassword = () => {
      for (let rule of rules.currentPassword) {
        if (rule(input.value.currentPassword) !== true) {
          alert(rule(input.value.currentPassword));
          return false;
        }
      }
      for (let rule of rules.newPassword) {
        if (rule(input.value.newPassword) !== true) {
          alert(rule(input.value.newPassword));
          return false;
        }
      }
      for (let rule of rules.newPassword2) {
        if (rule(input.value.newPassword2) !== true) {
          alert(rule(input.value.newPassword2));
          return false;
        }
      }
      return true;
    };

    const clickModifyNameBtn = () => {
      if (validateName()) {
        const form = new FormData();
        form.set("name", input.value.name);
        axios
          .put("/members", form)
          .then(() => {
            alert("닉네임 변경을 완료했습니다.");
            router.go();
          })
          .catch(e => {
            if (e.response.data && e.response.data.message) {
              alert(e.response.data.message);
            } else {
              alert("닉네임 변경을 실패했습니다. 잠시 후 다시 시도해주세요.");
            }
          });
      }
    };

    const clickModifyPasswordBtn = () => {
      if (validatePassword()) {
        const form = new FormData();
        form.set("currentPassword", input.value.currentPassword);
        form.set("newPassword", input.value.newPassword);
        axios
          .put("/members/password", form)
          .then(() => {
            alert("비밀번호 변경을 완료했습니다.");
            closePasswordDialog();
          })
          .catch(e => {
            if (e.response.data && e.response.data.message) {
              alert(e.response.data.message);
            } else {
              alert("비밀번호 변경을 실패했습니다. 잠시 후 다시 시도해주세요.");
            }
          });
      }
    };
    return {
      member,
      input,
      pattern,
      rules,
      passwordDialog,
      clickModifyNameBtn,
      clickModifyPasswordBtn,
      openPasswordDialog,
      closePasswordDialog,
    };
  },
};
</script>
<style scoped>
.card-area {
  margin-top: 100px;
  padding: 30px;
}

.v-card-title {
  margin-bottom: 50px;
}

.dialog-item-area {
  margin-bottom: 20px;
}
</style>
