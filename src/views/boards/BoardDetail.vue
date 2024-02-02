<template>
  <div>
    <TitleHeader :title="boardInfo.subject"></TitleHeader>
    <div>
      <PostDetail :post="post" :images="contentFiles"></PostDetail>
    </div>
    <div
      v-if="boardInfo.accessFile !== 'NONE' && attachFiles.length > 0"
      class="file-area"
    >
      <div class="mb-3" style="font-weight: bold">첨부 파일</div>
      <FileList
        :files="attachFiles"
        :downloadable="authorization(boardInfo.accessFile)"
      ></FileList>
    </div>
    <v-divider class="mt-6 mb-6" thickness="3"></v-divider>
    <div v-if="boardInfo.accessComment !== 'NONE'" class="comment-area">
      <div class="mb-3 text-h6" style="font-weight: bold">댓글</div>
      <CommentList
        :comments="comments"
        :postId="post.id"
        @reloadComments="fetchComments"
      ></CommentList>
    </div>
    <div class="btn-area">
      <div class="text-end">
        <v-btn width="100" color="indigo" @click="moveToList">목록</v-btn>
        <v-btn
          v-if="writerMode"
          class="ml-2 mr-2"
          width="100"
          variant="tonal"
          color="indigo"
          @click="moveToModify"
          >수정
        </v-btn>
        <v-dialog v-model="deleteDialog" persistent width="500" color="indigo">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              v-if="writerMode"
              width="100"
              variant="outlined"
              color="indigo"
              @click="openDeleteDialog"
              >삭제
            </v-btn>
          </template>
          <TwoButtonModal
            question="정말 삭제하시겠습니까?"
            @sendAnswer="closeDeleteDialog"
          ></TwoButtonModal>
        </v-dialog>
      </div>
    </div>
    <!-- 답글 등록 -->
    <div v-if="authorization(boardInfo.accessReplyWrite) && !post.childExists">
      <v-btn
        v-if="!openAnswerForm"
        class="font-weight-bold text-h6"
        width="200"
        height="50"
        variant="tonal"
        color="indigo"
        @click="openAnswerForm = true"
        >답변 작성
      </v-btn>
      <AnswerForm
        v-if="openAnswerForm"
        @submit="submitReply"
        @cancel="openAnswerForm = false"
      ></AnswerForm>
    </div>
    <!-- 답글 상세 -->
    <div v-if="authorization(boardInfo.accessReplyRead) && post.childExists">
      <div v-if="!openAnswerForm">
        <div class="reply-area">
          <AnswerDetail :post="reply"></AnswerDetail>
        </div>
        <div class="text-end">
          <v-btn
            v-if="authorization(boardInfo.accessReplyWrite)"
            width="100"
            variant="tonal"
            color="indigo"
            @click="openAnswerForm = true"
            >수정
          </v-btn>
        </div>
      </div>
      <div v-else>
        <AnswerForm
          :initialData="reply"
          @submit="modifyReply"
          @cancel="openAnswerForm = false"
        ></AnswerForm>
      </div>
    </div>
  </div>
</template>

<script>
import TwoButtonModal from "@/components/modal/TwoButtonModal.vue";
import TitleHeader from "@/components/TitleHeader.vue";
import CommentList from "@/components/list/CommentList.vue";
import { computed, inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import SearchCriteria from "@/model/SearchCriteria";
import router from "@/router";
import PostDetail from "@/components/detail/PostDetail.vue";
import FileList from "@/components/list/FileList.vue";
import { authorization } from "@/utils/AuthorizaionService";
import store from "@/store";
import AnswerForm from "@/components/form/AnswerForm.vue";
import AnswerDetail from "@/components/detail/AnswerDetail.vue";

export default {
  name: "BoardDetail",
  methods: { authorization },
  components: {
    AnswerDetail,
    AnswerForm,
    FileList,
    PostDetail,
    CommentList,
    TwoButtonModal,
    TitleHeader,
  },
  setup() {
    const axios = inject("axios");
    const route = new useRoute();
    let criteria = new SearchCriteria(route.query);
    let post = ref({});
    let files = ref([]);
    let boardInfo = ref({});
    let comments = ref([]);
    let reply = ref({});

    onMounted(() => {
      post.value = store.getters["postStore/getPost"];
      boardInfo.value = post.value.boardInfo;
      criteria.setBoardId(boardInfo.value.id);
      if (post.value.fileExists) {
        fetchFiles();
      }
      if (post.value.commentExists) {
        fetchComments();
      }
      if (post.value.childExists) {
        fetchReply();
      }
    });

    const fetchFiles = () => {
      axios
        .get(`/posts/${post.value.id}/files`)
        .then(res => {
          files.value = res.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    };

    const fetchComments = () => {
      axios
        .get(`/posts/${post.value.id}/comments`)
        .then(res => {
          comments.value = res.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    };
    const fetchReply = () => {
      axios
        .get(`/posts/${post.value.id}/replies`)
        .then(res => {
          console.log(res.data);
          reply.value = res.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    };

    let attachFiles = computed(() => {
      return files.value.filter(file => file.type === "ATTACHMENT");
    });

    let contentFiles = computed(() => {
      return files.value.filter(file => file.type === "CONTENT");
    });

    const moveToList = () => {
      router.push({
        path: `/portal`,
        query: { ...criteria.getQueryParam() },
      });
    };

    let loggedInMember = computed(() => {
      return store.getters["authStore/getMember"];
    });

    let writerMode = computed(() => {
      if (post.value.member) {
        return (
          loggedInMember.value["username"] === post.value.member["username"]
        );
      }
      return false;
    });

    let adminMode = computed(() => {
      return store.getters["authStore/isAdmin"];
    });

    let deleteDialog = ref(false);
    const closeDeleteDialog = answer => {
      deleteDialog.value = false;
      if (answer) {
        deletePost();
      }
    };
    const openDeleteDialog = () => {
      if (!isProcessing) {
        deleteDialog.value = true;
      }
    };

    let openAnswerForm = ref(false);

    let isProcessing = false;
    const startProcessing = () => {
      isProcessing = true;
    };
    const endProcessing = () => {
      isProcessing = false;
    };

    const deletePost = () => {
      startProcessing();
      axios
        .delete(`/posts/${post.value.id}`)
        .then(() => {
          moveToList();
        })
        .catch(() => {
          alert("게시물 삭제를 실패했습니다.");
        })
        .finally(() => {
          endProcessing();
        });
    };

    const moveToModify = () => {
      if (post.value.childExists) {
        alert("답변이 존재하는 경우 수정할 수 없습니다.");
      } else {
        router.push({
          path: `/portal/write/${post.value.id}`,
        });
      }
    };

    const submitReply = input => {
      if (isProcessing) {
        return;
      }
      startProcessing();
      const form = new FormData();
      form.set("title", input.title);
      form.set("content", input.content);
      form.set("categoryId", post.value.category.id);
      form.set("secret", post.value.secret);
      axios
        .post(`/posts/${post.value.id}/replies`, form)
        .then(() => {
          router.go();
        })
        .catch(e => {
          console.log(e);
        })
        .finally(() => {
          endProcessing();
        });
    };

    const modifyReply = (replyId, input) => {
      if (isProcessing) {
        return;
      }
      startProcessing();
      const form = new FormData();
      form.set("title", input.title);
      form.set("content", input.content);
      form.set("categoryId", post.value.category.id);
      form.set("secret", post.value.secret);
      axios
        .patch(`/posts/${replyId}`, form)
        .then(() => {
          router.go();
        })
        .catch(e => {
          console.log(e);
        })
        .finally(() => {
          endProcessing();
        });
    };

    return {
      deleteDialog,
      openAnswerForm,
      boardInfo,
      post,
      comments,
      reply,
      attachFiles,
      contentFiles,
      writerMode,
      adminMode,
      fetchComments,
      moveToList,
      moveToModify,
      openDeleteDialog,
      closeDeleteDialog,
      submitReply,
      modifyReply,
    };
  },
};
</script>

<style scoped>
.comment-area {
  margin-bottom: 20px;
}

.btn-area {
  margin-top: 20px;
  margin-bottom: 20px;
}

.reply-area {
  margin-bottom: 20px;
}
</style>
