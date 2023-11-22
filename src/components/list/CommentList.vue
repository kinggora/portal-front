<template>
  <div>
    <v-card>
      <v-table>
        <tbody>
          <!-- 댓글 리스트 -->
          <template v-for="(comment, index) in comments" :key="index">
            <!-- 댓글 -->
            <tr v-if="modifyTarget !== comment.id" class="list-area">
              <td :style="{ 'padding-left': `${comment.depth * 5}%` }">
                <div class="list-item">
                  <div style="font-weight: bold">
                    {{ comment.member.name }}
                  </div>
                  <div>
                    {{
                      comment.delFlag ? "삭제된 댓글입니다." : comment.content
                    }}
                  </div>
                  <div style="color: darkgray">
                    {{ DateFormatter.dateToString(comment.regDate) }}
                    <a
                      class="ml-2"
                      style="cursor: pointer"
                      @click="setParentId(comment.id)"
                      >답글 달기</a
                    >
                  </div>
                </div>
              </td>
              <!-- 댓글 메뉴 버튼 (수정, 삭제) -->
              <td class="menu-btn">
                <v-menu v-if="visibleMenu(comment.id, comment.member)">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      variant="plain"
                      icon="mdi-dots-vertical"
                      size="x-small"
                      height="50"
                      v-bind="props"
                    ></v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-if="!comment.delFlag"
                      @click="setModifyTarget(comment.id)"
                      >수정
                    </v-list-item>
                    <v-list-item @click="deleteComment(comment.id)"
                      >삭제
                    </v-list-item>
                  </v-list>
                </v-menu>
              </td>
            </tr>
            <!-- 댓글 수정 폼 -->
            <tr v-if="modifyTarget === comment.id">
              <td
                colspan="100%"
                :style="{ 'padding-left': `${comment.depth * 5}%` }"
              >
                <div class="form-area">
                  <CommentForm
                    :text="comment.content"
                    :cancellable="true"
                    @submit="modifyComment"
                    @cancel="setModifyTarget(null)"
                  ></CommentForm>
                </div>
              </td>
            </tr>
            <!-- 답글 입력 폼 -->
            <tr v-if="parentId === comment.id">
              <td
                colspan="100%"
                :style="{ 'padding-left': `${(comment.depth + 1) * 5}%` }"
              >
                <div class="form-area">
                  <CommentForm
                    :cancellable="true"
                    :placeHold="`${comment.member.name} 님에게 답글 달기`"
                    @submit="submitChildComment"
                    @cancel="setParentId(null)"
                  ></CommentForm>
                </div>
              </td>
            </tr>
          </template>
          <!-- 댓글 입력 폼 -->
          <tr>
            <td colspan="100%">
              <div class="form-area">
                <CommentForm
                  placehold="댓글을 남겨보세요"
                  v-on:submit="submitComment"
                ></CommentForm>
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
import { computed, inject, onMounted, ref } from "vue";
import CommentForm from "@/components/form/CommentForm.vue";
import DateFormatter from "../../utils/DateFormatter";

export default {
  name: "CommentList",
  components: { CommentForm },
  props: ["postId"],
  setup(props) {
    const store = useStore();
    const loggedInMember = computed(() => {
      if (store.getters["authStore/isAuthenticated"]) {
        return store.getters["authStore/getMember"];
      }
      return null;
    });

    const axios = inject("axios");
    let comments = ref([]);
    onMounted(() => {
      loadComments();
    });

    const loadComments = () => {
      axios
        .get(`/comments/${props.postId}`)
        .then(res => {
          console.log(res.data);
          comments.value = res.data.data;
        })
        .catch(e => {
          console.log(e.data);
        });
    };

    const submitComment = content => {
      const form = new FormData();
      form.set("postId", props.postId);
      form.set("content", content);
      axios
        .post("/comments", form)
        .then(res => {
          console.log(res.data);
          loadComments();
        })
        .catch(e => {
          console.log(e.data);
        });
    };

    let parentId = ref(null);
    const setParentId = parentId => {
      console.log(parentId);
      parentId.value = parentId;
    };

    const submitChildComment = content => {
      const form = new FormData();
      form.set("postId", props.postId);
      form.set("content", content);
      form.set("parent", parentId.value);
      parentId.value = null;
      axios
        .post("/comments", form)
        .then(res => {
          console.log(res.data);
          loadComments();
        })
        .catch(e => {
          console.log(e.data);
        });
    };

    let modifyTarget = ref(null);
    const setModifyTarget = id => {
      modifyTarget.value = id;
    };

    const modifyComment = content => {
      const form = new FormData();
      form.set("id", modifyTarget.value);
      form.set("content", content);
      modifyTarget.value = null;
      axios
        .put("/comments", form)
        .then(res => {
          console.log(res.data);
          loadComments();
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
          loadComments();
        })
        .catch(e => {
          console.log(e.data);
        });
    };

    const visibleMenu = (id, writer) => {
      return (
        loggedInMember.value !== null &&
        loggedInMember.value.username === writer.username &&
        modifyTarget.value !== id
      );
    };

    return {
      comments,
      modifyTarget,
      parentId,
      submitComment,
      submitChildComment,
      modifyComment,
      deleteComment,
      setModifyTarget,
      setParentId,
      visibleMenu,
      DateFormatter,
    };
  },
};
</script>

<style scoped>
.list-item {
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 30px;
}

.form-area {
  padding: 15px;
}

.list-area {
  background-color: #fafafa;
}

.menu-btn {
  vertical-align: top;
  text-align: right;
}
</style>
