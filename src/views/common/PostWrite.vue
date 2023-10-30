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
            <v-label class="ms-2 mb-2">파일 첨부</v-label>
            <v-file-input
              show-size
              v-model="input.newFiles"
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
      {{ input.newFiles[0] }}
      {{ input.newFiles[1] }}
      {{ input.newFiles[2] }}
    </v-container>
  </div>
</template>

<script>
import TitleHeader from "@/components/TitleHeader.vue";
import router from "@/router";
import { inject, ref } from "vue";

export default {
  name: "PostWrite",
  components: { TitleHeader },
  props: ["boardName"],
  setup(props) {
    const axios = inject("axios");
    let boardInfo = ref({});
    let categories = ref([]);

    axios
      .get(`/info/${props.boardName}`)
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

    let input = ref({
      categoryId: null,
      title: "",
      content: "",
      newFiles: [],
    });

    const submitForm = () => {
      const form = new FormData();
      form.set("boardId", boardInfo.value.id);
      form.set("categoryId", input.value.categoryId);
      form.set("title", input.value.title);
      form.set("content", input.value.content);
      axios
        .post(`/post`, form)
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
      form.set("postId", postId);
      for (let i = 0; i < input.value.newFiles.length; i++) {
        form.set(`newFiles[${i}]`, input.value.newFiles[i]);
      }
      axios
        .post(`/files`, form, {
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
    return { boardInfo, categories, input, submitForm, cancel };
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
