<template>
  <div>
    <v-container class="d-flex align-center flex-column">
      <v-card class="pa-9 m-3" width="600" color="indigo" variant="tonal">
        <template v-slot:text>
          <v-row class="mb-5" align="center" justify="center">
            <v-card-title class="pa-3"><h2>회원 등록</h2></v-card-title>
          </v-row>
          <v-form @submit.prevent>
            <v-row>
              <v-text-field
                label="아이디"
                :v-model="id"
                variant="outlined"
                :hint="hint.id"
              ></v-text-field>
            </v-row>
            <v-row>
              <v-text-field
                label="비밀번호"
                type="password"
                :v-model="password"
                variant="outlined"
                :hint="hint.password"
              ></v-text-field>
            </v-row>
            <v-row>
              <v-text-field
                label="닉네임"
                :hint="hint.nickname"
                :v-model="nickname"
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
                >등록
              </v-btn>
            </v-row>
          </v-form>
        </template>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "SignUp",
  components: {},
  data() {
    return {
      id: "",
      password: "",
      nickname: "",
      hint: {
        id: "영문/숫자 4자 이상 12자 미만으로 입력해주세요.",
        password:
          "영문/숫자/특수문자 포함하여 8자 이상 16자 미만으로 입력해주세요.",
        nickname: "3글자 이상 5글자 미만으로 입력해주세요.",
      },
    };
  },
  methods: {
    submitForm() {},
  },
};
</script>
<style scoped>
.v-text-field {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
