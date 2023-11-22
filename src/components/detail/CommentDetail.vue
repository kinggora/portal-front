<template>
  <div>
    <div style="font-weight: bold">
      {{ comment.member.name }}
    </div>
    <div>
      {{ getContent() }}
    </div>
    <div style="color: darkgray">
      {{ DateFormatter.dateToString(comment.regDate) }}
      <a class="ml-2" style="cursor: pointer" @click="openForm(comment.id)"
        >답글 달기</a
      >
    </div>
  </div>
</template>

<script>
import DateFormatter from "../../utils/DateFormatter";

export default {
  name: "CommentDetail",
  props: {
    comment: {
      type: Object,
      require: true,
    },
  },
  emits: ["openForm"],
  setup(props, { emit }) {
    const getContent = () => {
      return props.comment.delFlag
        ? "삭제된 댓글입니다."
        : props.comment.content;
    };
    const openForm = commentId => {
      emit("openForm", commentId);
    };
    return { DateFormatter, getContent, openForm };
  },
};
</script>

<style scoped></style>
