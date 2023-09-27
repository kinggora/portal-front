<template>
  <div>
    <v-container class="d-flex align-center flex-column mb-5">
      <v-card class="pa-9 m-3" width="600" color="indigo" variant="tonal">
        <template v-slot:text>
          <v-form @submit.prevent>
            <v-row>
              <v-text-field
                label="아이디"
                :v-model="id"
                variant="outlined"
              ></v-text-field>
            </v-row>
            <v-row>
              <v-text-field
                label="비밀번호"
                type="password"
                :v-model="password"
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
                >로그인</v-btn
              >
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
  data() {
    return {
      id: "",
      password: "",
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
