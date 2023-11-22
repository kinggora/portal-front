<template>
  <v-form @submit.prevent>
    <v-row>
      <v-col cols="12">
        <v-label class="ms-2 mb-2">제목</v-label>
        <v-text-field v-model="input.title"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-label class="ms-2 mb-2">내용</v-label>
        <v-textarea
          rows="10"
          row-height="25"
          v-model="input.content"
        ></v-textarea>
      </v-col>
    </v-row>
    <v-row class="mb-6">
      <v-col cols="6">
        <v-label class="ms-2 mb-2">사진 첨부</v-label>
        <v-file-input
          show-size
          v-model="input.contentFiles"
          multiple
        ></v-file-input>
      </v-col>
    </v-row>
    <v-row class="mb-6">
      <v-col cols="6">
        <v-label class="ms-2 mb-2">파일 첨부</v-label>
        <v-file-input
          show-size
          v-model="input.attachmentFiles"
          multiple
        ></v-file-input>
      </v-col>
    </v-row>
    <v-row justify="space-between">
      <v-btn width="150" variant="tonal" @click="clickCancel">취소</v-btn>
      <v-btn width="150" color="info" @click="clickSubmit">등록 </v-btn>
    </v-row>
  </v-form>
</template>

<script>
import { ref } from "vue";

export default {
  name: "AnswerForm",
  emits: ["cancel"],
  setup(props, { emit }) {
    const clickCancel = () => {
      emit("cancel");
    };

    const clickSubmit = () => {
      emit("submit", input.value);
    };

    let input = ref({
      title: "",
      content: "",
      contentFiles: [],
      attachmentFiles: [],
    });
    return { input, clickCancel, clickSubmit };
  },
};
</script>

<style scoped></style>
