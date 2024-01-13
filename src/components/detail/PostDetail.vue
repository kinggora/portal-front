<template>
  <div>
    <div class="post-area">
      <div class="mb-2">
        {{ post.category?.name }}
      </div>
      <div class="mb-2">
        <div class="text-h5">{{ post.title }}</div>
      </div>
      <div>
        <div class="text-subtitle-1">{{ post.member?.name }}</div>
      </div>
      <div class="d-flex justify-space-between">
        <div style="color: darkgray">
          {{ DateUtil.dateTimeToString(post.regDate) }}&nbsp;&nbsp;&nbsp;조회수:
          {{ post.hit }}
        </div>
        <div v-if="post.modDate" style="color: darkgray">
          수정 일시: {{ DateUtil.dateTimeToString(post.modDate) }}
        </div>
      </div>
      <v-divider class="mt-6 mb-12" thickness="2"></v-divider>
      <div v-for="(image, index) in images" :key="index">
        <img :src="image.url" />
      </div>
      <div>
        {{ post.content }}
      </div>
    </div>
  </div>
</template>

<script>
import DateUtil from "@/utils/DateUtil";

export default {
  name: "PostDetail",
  props: {
    post: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
    images: {
      type: Array,
      required: false,
      default: () => {
        return [];
      },
    },
  },
  setup() {
    return { DateUtil };
  },
};
</script>

<style scoped>
.post-area {
  margin-top: 20px;
  margin-bottom: 100px;
}
</style>
