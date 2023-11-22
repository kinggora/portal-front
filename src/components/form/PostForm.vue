<template>
  <v-form @submit.prevent>
    <v-row>
      <v-col cols="3">
        <v-select
          label="카테고리 선택"
          :items="categories"
          item-title="name"
          item-value="id"
          v-model="input.categoryId"
        ></v-select>
      </v-col>
    </v-row>
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
      <v-btn width="150" variant="tonal" @click="cancel">취소</v-btn>
      <v-btn width="150" color="info" type="submit" @click="submitForm"
      >등록
      </v-btn>
    </v-row>
  </v-form>
  {{ post }}
</template>

<script>
import { computed, inject, ref } from "vue";
import router from "@/router";

export default {
  name: "PostForm",
  props: {
    boardName: {
      type: String,
      required: true,
    },
    postId: {
      type: Number,
      required: false,
      default: undefined,
    },
  },
  setup(props) {
    const axios = inject("axios");
    let modifyMode = ref(false);
    let boardInfo = ref({});
    let categories = ref([]);
    let post = ref({});

    if (props.postId !== undefined) {
      axios
        .get(`/posts/${props.postId}`)
        .then(res => {
          console.log(res.data);
          post.value = res.data.data;
          modifyMode = true;
        })
        .catch(e => {
          console.log(e);
        });
    }

    axios
      .get(`/infos/${props.boardName}`)
      .then(res => {
        console.log(res.data);
        boardInfo.value = res.data.data;
        fetchCategories(boardInfo.value.id);
      })
      .catch(e => {
        console.log(e);
      });

    const fetchCategories = boardId => {
      axios
        .get(`/category/${boardId}`)
        .then(res => {
          console.log(res.data);
          categories.value = res.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    };

    let input = computed(() => {
      if (modifyMode.value) {
        return ref({
          categoryId: post.value.category.id,
          title: post.value.title,
          content: post.value.content,
          attachmentFiles: [],
          contentFiles: [],
        });
      }
      return ref({
        categoryId: null,
        title: "",
        content: "",
        attachmentFiles: [],
        contentFiles: [],
      });
    });

    const submitForm = () => {
      const form = new FormData();
      form.set("boardId", boardInfo.value.id);
      form.set("categoryId", input.value.categoryId);
      form.set("title", input.value.title);
      form.set("content", input.value.content);
      axios
        .post(`/posts`, form)
        .then(res => {
          console.log(res.data);
          const id = res.data.data;
          submitFileForm(id);
        })
        .catch(e => {
          console.log(e);
        });
    };

    const submitFileForm = postId => {
      const form = new FormData();
      for (let i = 0; i < input.value.attachmentFiles.length; i++) {
        form.set(`attachment[${i}]`, input.value.attachmentFiles[i]);
      }
      for (let i = 0; i < input.value.contentFiles.length; i++) {
        form.set(`content[${i}]`, input.value.contentFiles[i]);
      }
      axios
        .post(`/files/${postId}`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(res => {
          console.log(res.data);
          router.push(`/${boardInfo.value.name}/${postId}`);
        })
        .catch(e => {
          console.log(e);
        });
    };

    const cancel = () => {
      router.go(-1);
    };
    return {
      modifyMode,
      boardInfo,
      categories,
      input,
      post,
      submitForm,
      cancel,
    };
  },
};
</script>

<style scoped></style>
