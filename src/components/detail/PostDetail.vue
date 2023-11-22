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
          {{
            DateFormatter.dateToString(post.regDate)
          }}&nbsp;&nbsp;&nbsp;조회수:
          {{ post.hit }}
        </div>
        <div v-if="post.modDate" style="color: darkgray">
          수정 일시: {{ DateFormatter.dateToString(post.modDate) }}
        </div>
      </div>
      <v-divider class="mt-6 mb-12" thickness="2"></v-divider>
      <div v-for="(file, index) in contentFiles" :key="index">
        <img :src="file.storeDir" />
      </div>
      <div>
        {{ post.content }}
      </div>
    </div>
    <div v-if="attachFiles.length !== 0" class="file-area">
      <div class="mb-3" style="font-weight: bold">첨부 파일</div>
      <FileList :files="attachFiles"></FileList>
    </div>
  </div>
</template>

<script>
import DateFormatter from "@/utils/DateFormatter";
import { computed } from "vue";
import FileList from "@/components/list/FileList.vue";

export default {
  name: "PostDetail",
  components: { FileList },
  props: {
    post: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
    files: {
      type: Array,
      required: false,
      default: () => {
        return [];
      },
    },
  },
  setup(props) {
    const attachFiles = computed(() => {
      return props.files.filter(file => file.type === "ATTACHMENT");
    });

    const contentFiles = computed(() => {
      return props.files.filter(file => file.type === "CONTENT");
    });

    return { DateFormatter, attachFiles, contentFiles };
  },
};
</script>

<style scoped>
.post-area {
  margin-top: 20px;
  margin-bottom: 100px;
}

.file-area {
  margin-bottom: 100px;
}
</style>
