<template>
  <div>
    <v-dialog max-width="500" v-model="deleteDialog">
      <TwoButtonModal
        question="게시물을 삭제하시겠습니까?"
        @sendAnswer="closeDeleteModal"
      ></TwoButtonModal>
    </v-dialog>
    <TitleHeader :title="post.boardInfo?.subject"></TitleHeader>
    <div>
      <PostDetail :post="post" :files="files"></PostDetail>
    </div>
    <v-divider class="mt-6 mb-12" thickness="2"></v-divider>
    <div class="comment-area">
      <div class="mb-3" style="font-weight: bold">댓글</div>
      <CommentList :postId="postId"></CommentList>
    </div>
    <div class="btn-area">
      <div class="text-center">
        <v-btn width="150" color="indigo" @click="moveToList">목록</v-btn>
        <v-btn
          v-if="writerMode"
          class="ml-2 mr-2"
          width="150"
          variant="tonal"
          color="indigo"
          @click="moveToModify"
          >수정
        </v-btn>
        <v-btn
          v-if="writerMode"
          width="150"
          variant="outlined"
          color="indigo"
          @click="deleteDialog = true"
          >삭제
        </v-btn>
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
import { useStore } from "vuex";
import PostDetail from "@/components/detail/PostDetail.vue";

export default {
  name: "BoardDetail",
  components: {
    PostDetail,
    CommentList,
    TwoButtonModal,
    TitleHeader,
  },
  props: ["postId"],
  setup(props) {
    let deleteDialog = ref(false); // 게시물 삭제 팝업 제어를 위한 변수
    const axios = inject("axios");
    let post = ref({});
    let files = ref([]);

    onMounted(() => {
      axios
        .get(`/posts/${props.postId}`)
        .then(res => {
          post.value = res.data.data;
        })
        .catch(e => {
          console.log(e);
        });

      axios
        .get(`/files/${props.postId}`)
        .then(res => {
          files.value = res.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    });

    const route = useRoute();
    let criteria = new SearchCriteria(route.query);

    const moveToList = () => {
      router.push({
        path: `/${post.value.boardInfo.name}`,
        query: { ...criteria },
      });
    };

    const store = useStore();
    const loggedInMember = computed(() => {
      return store.getters["authStore/getMember"];
    });

    const writerMode = computed(() => {
      return loggedInMember.value.id === post.value.member?.id;
    });

    const closeDeleteModal = answer => {
      if (answer) {
        deletePost();
      }
      deleteDialog.value = false;
    };

    const deletePost = () => {
      axios
        .delete(`/posts/${props.postId}`)
        .then(res => {
          console.log(res.data);
          router.replace({
            path: `/${post.value.boardInfo.name}`,
          });
        })
        .catch(e => {
          console.log(e);
        });
    };

    return {
      deleteDialog,
      post,
      files,
      writerMode,
      moveToList,
      closeDeleteModal,
    };
  },
  methods: {
    moveToModify() {},
  },
};
</script>

<style scoped>
.comment-area {
  margin-bottom: 100px;
}
</style>
