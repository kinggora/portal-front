<template>
  <div>
    <v-container>
      <TitleHeader :title="boardInfo.subject" />
      <v-form>
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
          <v-col v-if="boardInfo.secret">
            <v-checkbox v-model="input.secret" label="비밀글"></v-checkbox>
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
            <FileList
              v-if="modifyMode"
              :files="contentFiles"
              :deletable="true"
              @delete="addFileToDelete"
            ></FileList>
            <v-file-input
              show-size
              v-model="input.contentFiles"
              accept=".jpg,.jpeg,.gif,.png,.bmp"
              multiple
            ></v-file-input>
          </v-col>
        </v-row>
        <v-row class="mb-6">
          <v-col cols="6">
            <v-label class="ms-2 mb-2">파일 첨부</v-label>
            <FileList
              v-if="modifyMode"
              :files="attachFiles"
              :downloadable="true"
              :deletable="true"
              @delete="addFileToDelete"
            ></FileList>
            <v-file-input
              show-size
              v-model="input.attachmentFiles"
              multiple
            ></v-file-input>
          </v-col>
        </v-row>
        <v-row justify="space-between">
          <v-btn width="150" variant="tonal" @click="cancel">취소</v-btn>
          <v-btn width="150" color="info" @click="submitForm">등록</v-btn>
        </v-row>
      </v-form>
    </v-container>
  </div>
</template>

<script>
import TitleHeader from "@/components/TitleHeader.vue";
import router from "@/router";
import { computed, inject, onMounted, ref } from "vue";
import FileList from "@/components/list/FileList.vue";
import { useRoute } from "vue-router";
import store from "@/store";

export default {
  name: "BoardWrite",
  components: { FileList, TitleHeader },
  props: ["postId"],
  setup(props) {
    const axios = inject("axios");
    let route = useRoute();
    let modifyMode = ref(false);
    let boardInfo = ref({});
    let categories = ref([]);
    let files = ref([]);

    onMounted(() => {
      if (props.postId) {
        const post = store.getters["postStore/getPost"];
        if (post.fileExists) {
          fetchFiles(post.id);
        }
        boardInfo.value = post.boardInfo;
        fetchCategories(boardInfo.value["id"]);
        initInput(post);
        modifyMode.value = true;
      } else if (route.query.boardId) {
        boardInfo.value = store.getters["boardInfoStore/getBoardInfo"];
        fetchCategories(boardInfo.value["id"]);
      }
    });

    const fetchFiles = postId => {
      axios
        .get(`/posts/${postId}/files`)
        .then(res => {
          files.value = res.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    };

    const fetchCategories = boardId => {
      axios
        .get(`/boards/${boardId}/categories`)
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
      secret: false,
      attachmentFiles: [],
      contentFiles: [],
    });

    const initInput = post => {
      input.value.categoryId = post.category.id;
      input.value.title = post.title;
      input.value.content = post.content;
      input.value.secret = post.secret;
    };

    let attachFiles = computed(() => {
      if (files.value.length === 0) {
        return [];
      }
      return files.value.filter(
        file =>
          file.type === "ATTACHMENT" &&
          !deletedFileIds.value.find(deletedId => deletedId === file.id),
      );
    });

    let contentFiles = computed(() => {
      if (files.value.length === 0) {
        return [];
      }
      return files.value.filter(
        file =>
          file.type === "CONTENT" &&
          !deletedFileIds.value.find(deletedId => deletedId === file.id),
      );
    });

    const submitForm = async () => {
      if (modifyMode.value) {
        const promises = [];
        // 입력 값에 수정이 있다면 post 수정 (put)
        if (checkModification()) {
          promises.push(submitPostModifyForm());
        }
        // 입력 파일 있다면 file 등록 (post)
        if (
          input.value.attachmentFiles.length > 0 ||
          input.value.contentFiles.length > 0
        ) {
          promises.push(submitFileCreateForm(props.postId));
        }
        // 삭제 파일 있다면 file 삭제 (delete)
        if (deletedFileIds.value.length > 0) {
          const filesDeletePromise =
            deletedFileIds.value.map(submitFileDeleteForm);
          promises.push(Promise.all(filesDeletePromise));
        }
        Promise.all(promises)
          .then(() => {
            moveToDetail(props.postId);
          })
          .catch(e => {
            console.log(e);
            alert("게시물 수정을 완료하지 못했습니다.");
          });
      } else {
        // post 등록 (post)
        const id = await submitPostCreateForm();
        // 입력 파일 있다면 file 등록 (post)
        if (
          input.value.contentFiles.length > 0 ||
          input.value.attachmentFiles.length > 0
        ) {
          await submitFileCreateForm(id);
        }
        moveToDetail(id);
      }
    };

    const submitPostCreateForm = () => {
      const form = new FormData();
      form.set("categoryId", input.value.categoryId);
      form.set("title", input.value.title);
      form.set("content", input.value.content);
      form.set("secret", input.value.secret);
      return axios
        .post(`/boards/${boardInfo.value.id}/posts`, form)
        .then(res => {
          return res.data.data;
        })
        .catch(e => {
          console.log(e);
          alert("게시글 등록에 실패했습니다.");
        });
    };

    const checkModification = () => {
      const initialPost = store.getters["postStore/getPost"];
      if (initialPost.category.id !== input.value.categoryId) {
        return true;
      }
      if (initialPost.title !== input.value.title) {
        return true;
      }
      if (initialPost.content !== input.value.content) {
        return true;
      }
      if (initialPost.secret !== input.value.secret) {
        return true;
      }
      return false;
    };

    const submitPostModifyForm = () => {
      const form = new FormData();
      const initialPost = store.getters["postStore/getPost"];
      if (initialPost.category.id !== input.value.categoryId) {
        form.set("categoryId", input.value.categoryId);
      }
      if (initialPost.title !== input.value.title) {
        form.set("title", input.value.title);
      }
      if (initialPost.content !== input.value.content) {
        form.set("content", input.value.content);
      }
      if (initialPost.secret !== input.value.secret) {
        form.set("secret", input.value.secret);
      }
      return axios.put(`/posts/${initialPost.id}`, form);
    };

    const submitFileCreateForm = postId => {
      const form = new FormData();
      for (let i = 0; i < input.value.attachmentFiles.length; i++) {
        form.set(`attachment[${i}]`, input.value.attachmentFiles[i]);
      }
      for (let i = 0; i < input.value.contentFiles.length; i++) {
        form.set(`content[${i}]`, input.value.contentFiles[i]);
      }
      return axios.post(`/posts/${postId}/files`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    };

    let deletedFileIds = ref([]);
    const addFileToDelete = file => {
      deletedFileIds.value.push(file.id);
    };

    const submitFileDeleteForm = id => {
      return axios.delete(`/files/${id}`);
    };

    const moveToDetail = postId => {
      router.push({
        path: `/portal/${postId}`,
      });
    };

    const cancel = () => {
      router.go(-1);
    };
    return {
      input,
      boardInfo,
      categories,
      contentFiles,
      attachFiles,
      modifyMode,
      submitForm,
      cancel,
      addFileToDelete,
    };
  },
};
</script>

<style scoped></style>
