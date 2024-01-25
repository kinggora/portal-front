<template>
  <div>
    <v-container>
      <TitleHeader :title="boardInfo.subject" />
      <div class="form-area">
        <v-form>
          <v-row>
            <v-col cols="3">
              <v-select
                label="카테고리 선택"
                :items="categories"
                item-title="name"
                item-value="id"
                v-model="input.categoryId"
                :rules="rules.categoryId"
              ></v-select>
            </v-col>
            <v-col v-if="boardInfo.allowSecret">
              <v-checkbox v-model="input.secret" label="비밀글"></v-checkbox>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-label class="ms-2 mb-2">제목</v-label>
              <v-text-field
                :rules="rules.title"
                v-model="input.title"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-label class="ms-2 mb-2">내용</v-label>
              <v-textarea
                rows="10"
                row-height="25"
                v-model="input.content"
                :rules="rules.content"
                spellcheck="false"
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row class="mb-6">
            <v-col>
              <v-label class="ms-2 mb-2">사진 첨부</v-label>
              <ImageFileInput
                :existingFiles="contentFiles"
                @change="setInputImages"
                @delete="addFileToDelete"
              ></ImageFileInput>
            </v-col>
          </v-row>
          <v-row class="mb-6">
            <v-col>
              <v-label class="ms-2 mb-2">파일 첨부</v-label>
              <AttachFileInput
                :existingFiles="attachFiles"
                @change="setInputFiles"
                @delete="addFileToDelete"
              ></AttachFileInput>
            </v-col>
          </v-row>
          <v-row justify="space-between">
            <v-btn width="150" variant="tonal" @click="clickCancelBtn"
              >취소
            </v-btn>
            <v-btn width="150" color="indigo" @click="clickSubmitBtn"
              >등록
            </v-btn>
          </v-row>
        </v-form>
      </div>
    </v-container>
  </div>
</template>

<script>
import TitleHeader from "@/components/TitleHeader.vue";
import router from "@/router";
import { computed, inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import store from "@/store";
import ImageFileInput from "@/components/form/ImageFileInput.vue";
import AttachFileInput from "@/components/form/AttachFileInput.vue";
import ByteUtil from "../../utils/ByteUtil";

export default {
  name: "BoardWrite",
  components: { AttachFileInput, ImageFileInput, TitleHeader },
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
        // 게시물 수정
        const post = store.getters["postStore/getPost"];
        if (post.fileExists) {
          fetchFiles(post.id);
        }
        boardInfo.value = post.boardInfo;
        fetchCategories(boardInfo.value["id"]);
        initInput(post); // 입력 값 초기화
        modifyMode.value = true; // 수정 모드
      } else if (route.query.boardId) {
        // 게시물 등록
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

    const rules = {
      categoryId: [
        v => !!v || "카테고리를 선택해주세요.",
        v =>
          categories.value.find(category => category.id === v) !== -1 ||
          "유효한 카테고리 값을 입력해주세요.",
      ],
      title: [
        v => !!v || "제목을 입력해주세요.",
        v => v.replace(/^\s+|\s+$/g, "").length > 0 || "제목을 입력해주세요.",
        v =>
          ByteUtil.getByteSize(v) < 300 ||
          "제목을 300byte(한글 100자) 이내로 입력해주세요.",
      ],
      content: [
        v =>
          ByteUtil.getByteSize(v) < 6000 ||
          "내용을 6000byte(한글 2000자) 이내로 입력해주세요.",
      ],
      secret: [
        v => typeof v === "boolean" || "유효한 비밀글 여부 값을 입력해주세요.",
      ],
    };

    const validateInput = () => {
      for (let rule of rules.categoryId) {
        if (rule(input.value.categoryId) !== true) {
          alert(rule(input.value.categoryId));
          return false;
        }
      }
      for (let rule of rules.title) {
        if (rule(input.value.title) !== true) {
          alert(rule(input.value.title));
          return false;
        }
      }
      for (let rule of rules.content) {
        if (rule(input.value.content) !== true) {
          alert(rule(input.value.content));
          return false;
        }
      }
      for (let rule of rules.content) {
        if (rule(input.value.content) !== true) {
          alert(rule(input.value.content));
          return false;
        }
      }
      for (let rule of rules.secret) {
        if (rule(input.value.secret) !== true) {
          alert(rule(input.value.secret));
          return false;
        }
      }
      return true;
    };

    const initInput = post => {
      input.value.categoryId = post.category.id;
      input.value.title = post.title;
      input.value.content = post.content;
      input.value.secret = post.secret;
    };

    const setInputImages = files => {
      input.value.contentFiles = files;
    };

    const setInputFiles = files => {
      input.value.attachmentFiles = files;
    };

    let attachFiles = computed(() => {
      if (files.value.length === 0) {
        return [];
      }
      return files.value.filter(
        file =>
          file.type === "ATTACHMENT" &&
          !fileIdsToDelete.value.find(deletedId => deletedId === file.id),
      );
    });

    let contentFiles = computed(() => {
      if (files.value.length === 0) {
        return [];
      }
      return files.value.filter(
        file =>
          file.type === "CONTENT" &&
          !fileIdsToDelete.value.find(deletedId => deletedId === file.id),
      );
    });

    let isCreating = false;
    let isModifying = false;
    const startCreating = () => {
      isCreating = true;
    };
    const endCreating = () => {
      isCreating = false;
    };
    const startModifying = () => {
      isModifying = true;
    };
    const endModifying = () => {
      isModifying = false;
    };

    const clickSubmitBtn = async () => {
      if (!validateInput()) {
        return;
      }
      if (modifyMode.value && !isModifying) {
        startModifying();
        const promises = [];
        // 입력 값에 수정이 있다면 post 수정 (patch)
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
        if (fileIdsToDelete.value.length > 0) {
          const filesDeletePromise =
            fileIdsToDelete.value.map(submitFileDeleteForm);
          promises.push(Promise.all(filesDeletePromise));
        }
        Promise.all(promises)
          .then(() => {
            moveToDetail(props.postId);
          })
          .catch(() => {
            alert("게시물 수정을 완료하지 못했습니다.");
          })
          .finally(() => {
            endModifying();
          });
      } else if (!modifyMode.value && !isCreating) {
        startCreating();
        if (
          input.value.contentFiles.length > 0 ||
          input.value.attachmentFiles.length > 0
        ) {
          submitPostCreateForm()
            .then(res => {
              const id = res.data.data;
              submitFileCreateForm(id)
                .then(() => {
                  moveToDetail(id);
                })
                .catch(() => {
                  alert("파일 등록을 실패했습니다.");
                })
                .finally(() => {
                  endCreating();
                });
            })
            .catch(() => {
              endCreating();
              alert("게시물 등록을 실패했습니다.");
            });
        } else {
          submitPostCreateForm()
            .then(res => {
              const id = res.data.data;
              moveToDetail(id);
            })
            .catch(() => {
              alert("게시물 등록을 실패했습니다.");
            })
            .finally(() => {
              endCreating();
            });
        }
      }
    };

    const submitPostCreateForm = () => {
      const form = new FormData();
      form.set("categoryId", input.value.categoryId);
      form.set("title", input.value.title);
      form.set("content", input.value.content);
      form.set("secret", input.value.secret);
      return axios.post(`/boards/${boardInfo.value.id}/posts`, form);
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
      form.set("categoryId", input.value.categoryId);
      form.set("title", input.value.title);
      form.set("content", input.value.content);
      form.set("secret", input.value.secret);
      return axios.patch(`/posts/${props.postId}`, form);
    };

    const submitFileCreateForm = postId => {
      const form = new FormData();
      for (let i = 0; i < input.value.attachmentFiles.length; i++) {
        form.set(`attachment[${i}]`, input.value.attachmentFiles[i][0]);
      }
      for (let i = 0; i < input.value.contentFiles.length; i++) {
        form.set(`content[${i}]`, input.value.contentFiles[i][0]);
      }
      return axios.post(`/posts/${postId}/files`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    };

    let fileIdsToDelete = ref([]);
    const addFileToDelete = file => {
      fileIdsToDelete.value.push(file.id);
    };

    const submitFileDeleteForm = id => {
      return axios.delete(`/files/${id}`);
    };

    const moveToDetail = postId => {
      router.push({
        path: `/portal/${postId}`,
      });
    };

    const clickCancelBtn = () => {
      router.go(-1);
    };

    return {
      rules,
      input,
      boardInfo,
      categories,
      contentFiles,
      attachFiles,
      modifyMode,
      clickSubmitBtn,
      clickCancelBtn,
      addFileToDelete,
      setInputImages,
      setInputFiles,
      ByteUtil,
    };
  },
};
</script>

<style scoped>
.form-area {
  margin-top: 20px;
}
</style>
