<template>
  <div>
    <v-container class="d-flex flex-column align-center">
      <v-card class="card-area" width="100%" color="indigo" variant="tonal">
        <v-card-title class="text-center text-h5 font-weight-bold"
          >회원정보 수정
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
                spellcheck="false"
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
        </v-card-text>
        <v-card-actions class="btn-area">
          <v-row class="justify-space-between">
            <v-dialog
              v-model="passwordDialog"
              persistent
              width="700"
              color="indigo"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  color="indigo-darken-3"
                  variant="flat"
                  min-width="150"
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
                    <v-col cols="3" class="mt-3">기존 비밀번호</v-col>
                    <v-col cols="9" class="d-flex align-center">
                      <v-text-field
                        type="password"
                        v-model="input.currentPassword"
                        variant="outlined"
                        density="compact"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="3" class="mt-3">새 비밀번호</v-col>
                    <v-col cols="9" class="d-flex align-center">
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
                    <v-col cols="3" class="mt-3">새 비밀번호 확인</v-col>
                    <v-col cols="9" class="d-flex align-center">
                      <v-text-field
                        type="password"
                        v-model="input.newPasswordConfirm"
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
            <v-dialog
              v-model="withdrawDialog"
              persistent
              width="700"
              color="indigo"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  variant="tonal"
                  min-width="150"
                  v-bind="props"
                  @click="openWithdrawDialog"
                  >회원 탈퇴
                </v-btn>
              </template>
              <TwoButtonModal
                question="정말 탈퇴하시겠습니까?"
                @sendAnswer="closeWithdrawDialog"
              ></TwoButtonModal>
            </v-dialog>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import store from "@/store";
import { inject, watch, ref } from "vue";
import router from "@/router";
import TwoButtonModal from "@/components/modal/TwoButtonModal.vue";

export default {
  name: "ModifyProfile",
  components: { TwoButtonModal },
  setup() {
    let member = store.getters["authStore/getMember"];
    const axios = inject("axios");
    let input = ref({
      name: member.name,
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
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

    let withdrawDialog = ref(false);
    let openWithdrawDialog = () => {
      withdrawDialog.value = true;
    };
    let closeWithdrawDialog = answer => {
      withdrawDialog.value = false;
      if (answer) {
        deleteMember();
      }
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
      newPasswordConfirm: [
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
      for (let rule of rules.newPasswordConfirm) {
        if (rule(input.value.newPasswordConfirm) !== true) {
          alert(rule(input.value.newPasswordConfirm));
          return false;
        }
      }
      return true;
    };

    const clickModifyNameBtn = () => {
      if (isProcessing) {
        return;
      }
      if (validateName()) {
        startProcessing();
        const form = new FormData();
        form.set("name", input.value.name);
        axios
          .patch("/members", form)
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
          })
          .finally(() => {
            endProcessing();
          });
      }
    };

    const resetPasswordInput = () => {
      input.value.currentPassword = "";
      input.value.newPassword = "";
      input.value.newPasswordConfirm = "";
    };

    const clickModifyPasswordBtn = () => {
      if (isProcessing) {
        return;
      }
      if (validatePassword()) {
        startProcessing();
        const form = new FormData();
        form.set("currentPassword", input.value.currentPassword);
        form.set("newPassword", input.value.newPassword);
        axios
          .patch("/members/password", form)
          .then(() => {
            alert("비밀번호 변경을 완료했습니다.");
            closePasswordDialog();
            resetPasswordInput();
          })
          .catch(e => {
            if (e.response.data && e.response.data.message) {
              alert(e.response.data.message);
            } else {
              alert("비밀번호 변경을 실패했습니다. 잠시 후 다시 시도해주세요.");
            }
          })
          .finally(() => {
            endProcessing();
          });
      }
    };

    const deleteMember = () => {
      if (isProcessing) {
        return;
      }
      startProcessing();
      axios
        .delete("/members")
        .then(() => {
          alert("회원 탈퇴되었습니다.");
        })
        .catch(e => {
          if (e.response.data && e.response.data.message) {
            alert(e.response.data.message);
          } else {
            alert("회원 탈퇴를 실패했습니다. 잠시 후 다시 시도해주세요.");
          }
        })
        .finally(() => {
          endProcessing();
        });
    };

    let isProcessing = false;
    const startProcessing = () => {
      isProcessing = true;
    };

    const endProcessing = () => {
      isProcessing = false;
    };

    return {
      member,
      input,
      pattern,
      rules,
      passwordDialog,
      withdrawDialog,
      clickModifyNameBtn,
      clickModifyPasswordBtn,
      openPasswordDialog,
      closePasswordDialog,
      openWithdrawDialog,
      closeWithdrawDialog,
    };
  },
};
</script>
<style scoped>
.card-area {
  margin-top: 30px;
  padding: 40px;
}

.v-card-title {
  margin-bottom: 50px;
}

.btn-area {
  padding: 20px;
}

.dialog-item-area {
  margin-bottom: 20px;
}
</style>
