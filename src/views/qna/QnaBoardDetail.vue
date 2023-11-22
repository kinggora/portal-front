<template>
  <div>
    <v-dialog max-width="500" v-model="deleteDialog">
      <TwoButtonModal
        question="게시물을 삭제하시겠습니까?"
        @sendAnswer="closeDeleteDialog"
      ></TwoButtonModal>
    </v-dialog>
    <TitleHeader :title="question.boardInfo?.subject"></TitleHeader>
    <div>
      <PostDetail :post="question" :files="questionFiles"></PostDetail>
    </div>
    <v-divider class="mt-6 mb-12" thickness="2"></v-divider>
    <div class="post-area" v-if="openAnswerForm">
      <TitleHeader title="답변 작성"></TitleHeader>
      <AnswerForm
        @cancel="openAnswerForm = false"
        @submit="submitAnswer"
      ></AnswerForm>
    </div>
    <div class="btn-area">
      <div class="text-end">
        <v-btn width="150" class="ml-2 mr-2" color="indigo" @click="moveToList"
          >목록
        </v-btn>
        <v-btn
          v-if="writerMode && !existAnswer"
          class="ml-2 mr-2"
          width="150"
          variant="tonal"
          color="indigo"
          @click="moveToModify(question.id)"
          >수정
        </v-btn>
        <v-btn
          v-if="writerMode"
          class="ml-2 mr-2"
          width="150"
          variant="outlined"
          color="indigo"
          @click="openDeleteDialog(question.id)"
          >삭제
        </v-btn>
        <v-btn
          v-if="adminMode && !existAnswer"
          class="ml-2 mr-2 font-weight-bold"
          width="150"
          variant="tonal"
          color="indigo"
          @click="openAnswerForm = true"
          >답변 작성
        </v-btn>
      </div>
    </div>
    <div class="answer-area" v-if="existAnswer">
      <v-card class="answer-card">
        <AnswerDetail :post="answer" :files="answerFiles"></AnswerDetail>
        <div class="btn-area">
          <div class="text-end">
            <v-btn
              v-if="writerMode"
              class="ml-2 mr-2"
              width="150"
              variant="tonal"
              color="indigo"
              @click="moveToModify(answer.id)"
              >수정
            </v-btn>
            <v-btn
              v-if="writerMode"
              class="ml-2 mr-2"
              width="150"
              variant="outlined"
              color="indigo"
              @click="openDeleteDialog(answer.id)"
              >삭제
            </v-btn>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import TwoButtonModal from "@/components/modal/TwoButtonModal.vue";
import TitleHeader from "@/components/TitleHeader.vue";
import { computed, inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import SearchCriteria from "@/model/SearchCriteria";
import router from "@/router";
import { useStore } from "vuex";
import AnswerForm from "@/components/form/AnswerForm.vue";
import PostDetail from "@/components/detail/PostDetail.vue";
import AnswerDetail from "@/components/detail/AnswerDetail.vue";

export default {
  name: "QnaBoardDetail",
  components: {
    AnswerDetail,
    PostDetail,
    AnswerForm,
    TwoButtonModal,
    TitleHeader,
  },
  props: ["postId"],
  setup(props) {
    let deleteDialog = ref(false); // 게시물 삭제 팝업 제어를 위한 변수
    const axios = inject("axios");
    let question = ref({
      boardInfo: {},
      member: {},
      category: {},
    });
    let answer = ref();
    const existAnswer = ref(false);
    let questionFiles = ref([]);
    let answerFiles = ref([]);

    onMounted(() => {
      axios
        .get(`/posts/qna/${props.postId}`)
        .then(res => {
          let posts = res.data.data;
          question.value = posts.find(post => post.parent === null);
          answer.value = posts.find(post => post.parent !== null);

          if (answer.value !== undefined) {
            existAnswer.value = true;
            fetchFiles(answer.value.id, answerFiles);
          }
        })
        .catch(e => {
          console.log(e);
        });

      fetchFiles(props.postId, questionFiles);
    });

    const fetchFiles = (id, files) => {
      axios
        .get(`/files/${id}`)
        .then(res => {
          console.log(res.data);
          files.value = res.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    };

    const route = useRoute();
    let criteria = new SearchCriteria(route.query);
    const moveToList = () => {
      router.push({
        path: `/${question.value.boardInfo.name}`,
        query: { ...criteria },
      });
    };

    const moveToModify = id => {
      console.log(id);
    };

    const openAnswerForm = ref(false);

    const store = useStore();
    const loggedInMember = computed(() => {
      return store.getters["authStore/getMember"];
    });

    const adminMode = computed(() => {
      return loggedInMember.value.role === "ADMIN";
    });

    const writerMode = computed(() => {
      return loggedInMember.value.id === question.value.member?.id;
    });

    let deleteTarget = ref(null);
    const openDeleteDialog = id => {
      deleteDialog = true;
      deleteTarget.value = id;
    };
    const closeDeleteDialog = answer => {
      if (answer) {
        deletePost();
      }
      deleteDialog.value = false;
    };

    const deletePost = () => {
      axios
        .delete(`/posts/${deleteTarget.value}`)
        .then(res => {
          console.log(res.data);
          deleteTarget.value = null;
          router.replace({
            path: `/${question.value.boardInfo.name}`,
          });
        })
        .catch(e => {
          console.log(e);
        });
    };

    const submitAnswer = input => {
      const form = new FormData();
      form.set("boardId", question.value.boardInfo.id);
      form.set("categoryId", question.value.category.id);
      form.set("title", input.title);
      form.set("content", input.content);
      form.set("parent", question.value.id);
      axios
        .post(`/posts/qna`, form)
        .then(res => {
          const id = res.data.data;
          submitFileForm(id, input.attachmentFiles, input.contentFiles);
        })
        .catch(e => {
          console.log(e);
        });
    };

    const submitFileForm = (postId, attachmentFiles, contentFiles) => {
      const form = new FormData();
      for (let i = 0; i < attachmentFiles.length; i++) {
        form.set(`attachment[${i}]`, attachmentFiles[i]);
      }
      for (let i = 0; i < contentFiles.length; i++) {
        form.set(`content[${i}]`, contentFiles[i]);
      }
      axios
        .post(`/files/${postId}`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(res => {
          console.log(res.data);
          router.go();
        })
        .catch(e => {
          console.log(e);
        });
    };

    return {
      deleteDialog,
      question,
      answer,
      questionFiles,
      answerFiles,
      existAnswer,
      writerMode,
      adminMode,
      openAnswerForm,
      submitAnswer,
      moveToList,
      moveToModify,
      openDeleteDialog,
      closeDeleteDialog,
    };
  },
};
</script>

<style scoped>
.answer-card {
  padding: 50px;
}

.btn-area {
  margin-bottom: 50px;
}
</style>
