<template>
  <v-card class="card-body">
    <v-card-title> 답변 작성</v-card-title>
    <v-card-item>
      <v-label class="ms-2 mb-2">제목</v-label>
      <v-text-field v-model="input.title"></v-text-field>
    </v-card-item>
    <v-card-item>
      <v-label class="ms-2 mb-2">내용</v-label>
      <v-textarea
        rows="10"
        row-height="25"
        v-model="input.content"
      ></v-textarea>
    </v-card-item>
    <v-card-actions class="justify-space-between">
      <v-btn width="150" variant="tonal" @click="clickCancelBtn">취소</v-btn>
      <v-btn
        width="150"
        variant="outlined"
        color="indigo"
        @click="clickSubmitBtn"
        >등록
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { onMounted, ref } from "vue";

export default {
  name: "AnswerForm",
  props: {
    initialData: {
      type: Object,
      required: false,
    },
  },
  emits: ["cancel"],
  setup(props, { emit }) {
    let modifyMode = ref(false);
    const clickCancelBtn = () => {
      emit("cancel");
    };

    const clickSubmitBtn = () => {
      if (modifyMode.value) {
        emit("submit", props.initialData.id, input.value);
      } else {
        emit("submit", input.value);
      }
    };

    onMounted(() => {
      if (props.initialData) {
        modifyMode.value = true;
        input.value.title = props.initialData.title;
        input.value.content = props.initialData.content;
      }
    });

    let input = ref({
      title: "",
      content: "",
    });
    return { input, clickCancelBtn, clickSubmitBtn };
  },
};
</script>

<style scoped>
.card-body {
  padding: 50px;
}
</style>
