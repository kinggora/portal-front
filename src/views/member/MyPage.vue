<template>
  <v-container class="d-flex flex-column align-center">
    <v-card class="card-area" width="100%" color="indigo" variant="tonal">
      <v-card-text class="profile-area text-end">
        <div class="align-center d-flex justify-end mr-2 mb-4">
          <div class="text-h5 font-weight-bold">
            {{ profile.name }}
          </div>
          <div class="text-subtitle-2 ml-3">
            {{ profile.role }}
          </div>
        </div>
        <v-btn variant="tonal" @click="moveToModifyProfile"
          >회원정보 수정
        </v-btn>
      </v-card-text>
      <div class="list-area">
        <v-btn-toggle v-model="selected" color="indigo" mandatory>
          <v-btn value="post" @click="viewMyPosts" variant="text">작성글</v-btn>
          <v-btn value="comment" @click="viewMyComments" variant="text"
            >작성댓글
          </v-btn>
        </v-btn-toggle>
        <div v-if="selected === 'post'">
          <MyPostList
            :posts="posts"
            @changeCheckedList="setCheckedList"
            @clickTitle="moveToDetail"
          ></MyPostList>
        </div>
        <div v-if="selected === 'comment'">
          <MyCommentList
            :comments="comments"
            @clickTitle="moveToDetail"
            @changeCheckedList="setCheckedList"
          ></MyCommentList>
        </div>
      </div>
      <div class="text-end">
        <v-btn color="indigo" variant="flat" @click="clickDeleteBtn"
          >삭제
        </v-btn>
      </div>
      <PaginationBar
        :page-info="pageInfo"
        :displayPageCount="10"
        @handlePage="moveToPage"
      ></PaginationBar>
    </v-card>
  </v-container>
  <v-dialog v-model="deleteDialog" persistent width="700" color="indigo">
    <TwoButtonModal
      :question="getDeleteQuestion()"
      @sendAnswer="closeDeleteDialog"
    ></TwoButtonModal>
  </v-dialog>
</template>

<script>
import { computed, inject, onMounted, ref } from "vue";
import router from "@/router";
import PaginationBar from "@/components/PaginationBar.vue";
import TwoButtonModal from "@/components/modal/TwoButtonModal.vue";
import MyPostList from "@/components/list/MyPostList.vue";
import MyCommentList from "@/components/list/MyCommentList.vue";
import store from "@/store";

export default {
  name: "MyPage",
  components: { MyCommentList, MyPostList, TwoButtonModal, PaginationBar },
  setup() {
    const axios = inject("axios");
    onMounted(() => {
      fetchPost();
    });
    let selected = ref("post");
    let posts = ref([]);
    let comments = ref([]);
    let currentPage = ref(1);
    let pageInfo = ref({});

    const fetchPost = () => {
      axios
        .get("/boards/my/posts", {
          params: {
            page: currentPage.value,
            size: 20,
          },
        })
        .then(res => {
          posts.value = res.data.data;
          pageInfo.value = res.data.pageInfo;
        });
    };

    const fetchComments = () => {
      axios
        .get("/comments/my", {
          params: {
            page: currentPage.value,
            size: 20,
          },
        })
        .then(res => {
          comments.value = res.data.data;
          pageInfo.value = res.data.pageInfo;
        });
    };

    const profile = computed(() => {
      if (store.getters["authStore/isAuthenticated"]) {
        const member = store.getters["authStore/getMember"];
        return {
          name: `${member.name}(${member.username})`,
          role: store.getters["authStore/isAdmin"]
            ? "관리자 회원"
            : "일반 회원",
        };
      }
      return {};
    });

    const checkedList = ref(null);

    const resetCheckList = () => {
      checkedList.value = null;
    };

    let isProcessing = ref(false);
    const startProcessing = () => {
      isProcessing.value = true;
    };
    const endProcessing = () => {
      isProcessing.value = false;
    };

    const submitPostDeleteForm = id => {
      return axios.delete(`/posts/${id}`);
    };

    const submitCommentDeleteForm = id => {
      return axios.delete(`/comments/${id}`);
    };

    const deletePosts = () => {
      startProcessing();
      const promises = checkedList.value.map(submitPostDeleteForm);
      Promise.all(promises)
        .then(() => {
          fetchComments();
        })
        .finally(() => {
          resetCheckList();
          endProcessing();
        });
    };
    const deleteComments = () => {
      startProcessing();
      const promises = checkedList.value.map(submitCommentDeleteForm);
      Promise.all(promises)
        .then(() => {
          fetchComments();
        })
        .finally(() => {
          resetCheckList();
          endProcessing();
        });
    };

    const viewMyPosts = () => {
      selected.value = "post";
      currentPage.value = 1;
      resetCheckList();
      fetchPost();
    };

    const viewMyComments = () => {
      selected.value = "comment";
      currentPage.value = 1;
      resetCheckList();
      fetchComments();
    };

    const moveToPage = page => {
      resetCheckList();
      currentPage.value = page;
      if (selected.value === "post") {
        fetchPost();
      } else if (selected.value === "comment") {
        fetchComments();
      }
    };

    const setCheckedList = list => {
      checkedList.value = list;
    };

    const moveToDetail = id => {
      router.push(`/portal/${id}`);
    };

    const moveToModifyProfile = () => {
      router.push("/profile/modify");
    };

    let deleteDialog = ref(false);
    const getDeleteQuestion = () => {
      switch (selected.value) {
        case "post":
          return "선택한 게시글을 삭제하시겠습니까?";
        case "comment":
          return "선택한 댓글을 삭제하시겠습니까?";
      }
      return "";
    };

    const clickDeleteBtn = () => {
      if (isProcessing.value) {
        return;
      }
      if (!checkedList.value || checkedList.value.length === 0) {
        alert("삭제할 항목을 선택해주세요.");
      } else {
        deleteDialog.value = true;
      }
    };

    const closeDeleteDialog = answer => {
      deleteDialog.value = false;
      if (answer) {
        switch (selected.value) {
          case "post":
            deletePosts();
            break;
          case "comment":
            deleteComments();
            break;
        }
      }
    };

    return {
      posts,
      comments,
      profile,
      selected,
      pageInfo,
      viewMyPosts,
      viewMyComments,
      moveToPage,
      moveToDetail,
      moveToModifyProfile,
      setCheckedList,
      deleteDialog,
      getDeleteQuestion,
      clickDeleteBtn,
      closeDeleteDialog,
    };
  },
};
</script>

<style scoped>
.card-area {
  margin-top: 30px;
  padding: 30px;
}

.list-area {
  margin-bottom: 20px;
}
</style>
