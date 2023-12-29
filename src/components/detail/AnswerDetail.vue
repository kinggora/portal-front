<template>
  <v-card class="card-body">
    <v-card-title class="title-area">
      <div class="text-h5 mb-2">{{ post.title }}</div>
      <div class="d-flex justify-space-between text-subtitle-1">
        <div>관리자</div>
        <div>
          답변 일시
          {{ DateFormatter.dateToString(post.regDate) }}
        </div>
      </div>
    </v-card-title>
    <v-card-text class="content-area">
      <div class="text-h6">
        {{ post.content }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import DateFormatter from "@/utils/DateFormatter";

export default {
  name: "AnswerDetail",
  props: {
    post: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
  },
  setup() {
    return { DateFormatter };
  },
};
</script>

<style scoped>
.title-area {
  width: auto;
  background-color: #e8eaf6;
  padding: 20px 30px;
}

.content-area {
  min-height: 500px;
  padding: 30px;
}
</style>
