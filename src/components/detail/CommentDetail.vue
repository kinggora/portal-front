<template>
  <tr v-if="!modifyMode" class="list-area">
    <td :style="{ 'padding-left': `${comment.depth * 5}%` }">
      <div v-if="comment.deleted" class="list-item">
        <div>삭제된 댓글입니다.</div>
        <div></div>
      </div>
      <div v-else class="list-item">
        <div style="font-weight: bold">
          {{ comment.member.name }}
        </div>
        <div>
          {{ comment.content }}
        </div>
        <div style="color: darkgray">
          {{ DateUtil.dateTimeToString(comment.regDate) }}
          <a class="ml-2" style="cursor: pointer" @click="setReplyMode(true)"
            >답글 달기</a
          >
        </div>
      </div>
    </td>
    <!-- 댓글 메뉴 버튼 (수정, 삭제) -->
    <td class="menu-btn">
      <v-menu v-if="visibleMenu">
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
          <v-list-item @click="setModifyMode(true)">수정</v-list-item>
          <v-list-item @click="deleteComment">삭제</v-list-item>
        </v-list>
      </v-menu>
    </td>
  </tr>
  <!-- 댓글 수정 폼 -->
  <tr v-if="modifyMode">
    <td colspan="100%" :style="{ 'padding-left': `${comment.depth * 5}%` }">
      <div class="form-area">
        <CommentForm
          :text="comment.content"
          :cancellable="true"
          @submit="modifyComment"
          @cancel="setModifyMode(false)"
        ></CommentForm>
      </div>
    </td>
  </tr>
  <!-- 답글 입력 폼 -->
  <tr v-if="replyMode">
    <td
      colspan="100%"
      :style="{ 'padding-left': `${(comment.depth + 1) * 5}%` }"
    >
      <div class="form-area">
        <CommentForm
          :cancellable="true"
          :placeHold="`${comment.member.name} 님에게 답글 달기`"
          @submit="submitReply"
          @cancel="setReplyMode(false)"
        ></CommentForm>
      </div>
    </td>
  </tr>
</template>

<script>
import DateUtil from "../../utils/DateUtil";
import { computed, ref } from "vue";
import store from "@/store";
import CommentForm from "@/components/form/CommentForm.vue";

export default {
  name: "CommentDetail",
  components: { CommentForm },
  props: {
    comment: {
      type: Object,
      require: true,
    },
  },
  emits: ["reply", "modify", "delete"],
  setup(props, { emit }) {
    let modifyMode = ref(false);
    let replyMode = ref(false);
    let loggedInMember = store.getters["authStore/getMember"];

    const visibleMenu = computed(() => {
      return loggedInMember["username"] === props.comment.member["username"];
    });

    const setModifyMode = status => {
      modifyMode.value = status;
    };

    const setReplyMode = status => {
      replyMode.value = status;
    };

    const submitReply = content => {
      emit("reply", props.comment.id, content);
      setReplyMode(false);
    };

    const modifyComment = content => {
      emit("modify", props.comment.id, content);
      setModifyMode(false);
    };

    const deleteComment = () => {
      emit("delete", props.comment.id);
    };

    return {
      DateUtil,
      modifyMode,
      replyMode,
      visibleMenu,
      setReplyMode,
      setModifyMode,
      modifyComment,
      submitReply,
      deleteComment,
    };
  },
};
</script>

<style scoped>
.form-area {
  padding: 15px;
}

.list-item {
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 30px;
}

.list-area {
  background-color: #fafafa;
}

.menu-btn {
  vertical-align: top;
  text-align: right;
}
</style>
