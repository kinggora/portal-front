<template>
  <div>
    <v-container>
      <TitleHeader :title="boardInfo.subject" />
      <v-form @submit.prevent>
        <v-row>
          <v-col cols="3">
            <v-select
              label="카테고리 선택"
              :items="categories"
              item-title="name"
              item-value="id"
              v-model="categoryId"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-label class="ms-2 mb-2">제목</v-label>
            <v-text-field :v-model="title"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-label class="ms-2 mb-2">내용</v-label>
            <v-textarea
              rows="10"
              row-height="25"
              :v-model="content"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row class="mb-6">
          <v-col cols="6">
            <v-label class="ms-2 mb-2">파일 첨부</v-label>
            <v-file-input show-size></v-file-input>
          </v-col>
        </v-row>
        <v-row justify="space-between">
          <v-btn width="150" variant="tonal" @click="cancel">취소</v-btn>
          <v-btn width="150" color="info" type="submit" @click="submitForm"
            >등록</v-btn
          >
        </v-row>
      </v-form>
    </v-container>
  </div>
</template>

<script>
import TitleHeader from "@/components/TitleHeader.vue";
import router from "@/router";

export default {
  name: "FreeWrite",
  components: { TitleHeader },
  computed: {},
  data() {
    return {
      boardInfo: {
        id: 4,
        name: "free",
        subject: "자유 게시판",
      },
      categories: [
        { id: 1, name: "JAVA" },
        { id: 2, name: "JavaScript" },
        { id: 3, name: "Python" },
      ],
      categoryId: "",
      title: "",
      content: "",
      newFiles: {
        file1: null,
        file2: null,
        file3: null,
      },
    };
  },
  setup() {},
  created() {},
  mounted() {},
  unmounted() {},
  methods: {
    cancel() {
      router.go(-1);
    },
    submitForm() {},
  },
};
</script>

<style scoped>
.form-area {
  padding-top: 50px;
}

.btn-area {
  padding-top: 50px;
}

button.btn {
  width: 150px;
}
</style>
