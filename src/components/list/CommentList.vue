<template>
  <div>
    <v-card>
      <v-table>
        <tbody>
          <!-- 댓글 리스트 -->
          <template v-for="(comment, index) in comments" :key="index">
            <!-- 댓글 -->
            <CommentDetail
              :comment="comment"
              @reply="submitReply"
              @modify="modifyComment"
              @delete="deleteComment"
            ></CommentDetail>
          </template>
          <!-- 댓글 입력 폼 -->
          <tr>
            <td v-if="isAuthenticated" colspan="100%">
              <div class="form-area">
                <CommentForm
                  :name="member.name"
                  placehold="댓글을 남겨보세요"
                  v-on:submit="submitComment"
                ></CommentForm>
              </div>
            </td>
            <td v-else>
              <div class="d-flex" @click="moveToLogin">
                <div>로그인 후 댓글에 참여해보세요</div>
                <v-icon icon="mdi-chevron-right"></v-icon>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { inject } from "vue";
import CommentForm from "@/components/form/CommentForm.vue";
import DateFormatter from "../../utils/DateFormatter";
import { useRouter } from "vue-router";
import CommentDetail from "@/components/detail/CommentDetail.vue";

export default {
  name: "CommentList",
  components: { CommentDetail, CommentForm },
  props: {
    postId: {
      type: Number,
      required: true,
      default: null,
    },
    comments: {
      type: Array,
      required: false,
      default: () => {
        return [];
      },
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const isAuthenticated = store.getters["authStore/isAuthenticated"];
    const member = store.getters["authStore/getMember"];

    const axios = inject("axios");

    const submitComment = content => {
      const form = new FormData();
      form.set("content", content);
      axios
        .post(`/posts/${props.postId}/comments`, form)
        .then(() => {
          emit("reloadComments");
        })
        .catch(e => {
          console.log(e);
          alert("댓글 등록에 실패했습니다.");
        });
    };

    const submitReply = (parentId, content) => {
      const form = new FormData();
      form.set("content", content);
      axios
        .post(`/posts/${props.postId}/comments/${parentId}/replies`, form)
        .then(res => {
          console.log(res.data);
          emit("reloadComments");
        })
        .catch(e => {
          console.log(e.data);
        });
    };

    const modifyComment = (id, content) => {
      const form = new FormData();
      form.set("content", content);
      axios
        .put(`/comments/${id}`, form)
        .then(res => {
          console.log(res.data);
          emit("reloadComments");
        })
        .catch(e => {
          console.log(e.data);
        });
    };

    const deleteComment = id => {
      axios
        .delete(`/comments/${id}`)
        .then(res => {
          console.log(res.data);
          emit("reloadComments");
        })
        .catch(e => {
          console.log(e.data);
        });
    };

    let router = useRouter();
    const moveToLogin = () => {
      router.push({
        path: `/login`,
      });
    };

    return {
      member,
      moveToLogin,
      submitComment,
      submitReply,
      modifyComment,
      deleteComment,
      isAuthenticated,
      DateFormatter,
    };
  },
};
</script>

<style scoped>
.form-area {
  padding: 15px;
}
</style>
