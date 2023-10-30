<template>
  <div>
    <TitleHeader :title="post.boardInfo?.subject" />
    <v-dialog max-width="500" v-model="popState">
      <TwoButtonModal
        question="게시물을 삭제하시겠습니까?"
        @sendAnswer="closeDeleteModal"
      ></TwoButtonModal>
    </v-dialog>
    <v-container>
      <div class="post-area">
        <v-row class="mb-2">
          {{ post.category?.name }}
        </v-row>
        <v-row class="mb-2">
          <div class="text-h5">{{ post.title }}</div>
        </v-row>
        <v-row>
          <div class="text-subtitle-1">{{ post.member?.name }}</div>
        </v-row>
        <v-row justify="space-between">
          <div style="color: darkgray">
            {{ formatDate(post.regDate) }}&nbsp;&nbsp;&nbsp;조회수:
            {{ post.hit }}
          </div>
          <div v-if="post.modDate" style="color: darkgray">
            수정 일시: {{ formatDate(post.modDate) }}
          </div>
        </v-row>
        <v-divider class="mt-6 mb-12" thickness="2"></v-divider>
        <v-row>
          {{ post.content }}
        </v-row>
      </div>
      <div v-if="files" class="file-area">
        <v-row>첨부 파일</v-row>
        <FileList :files="files"></FileList>
      </div>
      <v-divider class="mt-6 mb-12" thickness="2"></v-divider>
      <div class="reply-area">
        <v-row>댓글</v-row>
        <CommentList :post-id="postId"></CommentList>
      </div>
      <div class="btn-area">
        <v-row justify="center">
          <v-btn width="150" color="indigo" @click="moveToList">목록</v-btn>
          <v-btn
            class="ml-2 mr-2"
            width="150"
            variant="tonal"
            color="indigo"
            @click="moveToModify"
            >수정
          </v-btn>
          <v-btn
            width="150"
            variant="outlined"
            color="indigo"
            @click="openDeleteModal"
            >삭제
          </v-btn>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script>
import TwoButtonModal from "@/components/modal/TwoButtonModal.vue";
import TitleHeader from "@/components/TitleHeader.vue";
import CommentList from "@/components/CommentList.vue";
import { inject, onMounted, ref } from "vue";
import DateFormatter from "@/utils/DateFormatter";
import FileList from "@/components/FileList.vue";

export default {
  name: "PostDetail",
  components: {
    FileList,
    CommentList,
    TwoButtonModal,
    TitleHeader,
  },
  props: ["postId"],
  setup(props) {
    let popState = ref(false); // 게시물 삭제 팝업 제어를 위한 변수
    const axios = inject("axios");
    let post = ref({});
    let files = ref([]);

    onMounted(() => {
      axios
        .get(`/post/${props.postId}`)
        .then(res => {
          console.log(res.data);
          post.value = res.data.data;
        })
        .catch(e => {
          console.log(e);
        });

      axios
        .get(`/files/${props.postId}`)
        .then(res => {
          console.log(res.data);
          files.value = res.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    });
    return { popState, post, files };
  },
  methods: {
    moveToList() {},
    moveToModify() {},
    openDeleteModal() {
      this.popState = true;
    },
    closeDeleteModal(answer) {
      if (answer) {
        this.deletePost();
      }
      this.popState = false;
    },
    deletePost() {
      console.log("delete...");
    },
    formatDate(date) {
      return DateFormatter.dateToString(date);
    },
  },
};
</script>

<style scoped>
.post-area {
  margin-bottom: 100px;
}

.file-area {
  margin-bottom: 100px;
}

.reply-area {
  margin-bottom: 100px;
}
</style>
