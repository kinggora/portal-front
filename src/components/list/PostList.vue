<template>
  <v-table style="width: 100%">
    <thead>
      <tr>
        <th class="text-center font-weight-bold">카테고리</th>
        <th class="text-center font-weight-bold" style="width: 50%">제목</th>
        <th class="text-center font-weight-bold">작성자</th>
        <th class="text-center font-weight-bold">조회수</th>
        <th class="text-center font-weight-bold">등록 일시</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(post, index) in posts" :key="index">
        <td>{{ post.categoryName }}</td>
        <td class="td-title" style="width: 50%">
          <a
            :style="{
              'text-decoration-line': hoverTitle === index ? 'underline' : '',
              cursor: 'pointer',
            }"
            @click="clickTitle(post.postId)"
            @mouseover="changeHover(index)"
            @mouseleave="changeHover(null)"
          >
            {{ curtailText(post.title) }}</a
          >
          <v-icon class="ml-2" v-if="post.imaged" icon="mdi-image"></v-icon>
          <v-icon
            class="ml-2"
            v-if="post.attached"
            icon="mdi-attachment"
          ></v-icon>
          <a v-if="post.commentCount > 0" class="ml-2" style="font-weight: bold"
            >[{{ post.commentCount }}]</a
          >
        </td>
        <td>{{ post.memberName }}</td>
        <td>{{ post.hit }}</td>
        <td>{{ DateUtil.dateTimeToString(post.regDate) }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import { ref } from "vue";
import DateUtil from "../../utils/DateUtil";
import ByteUtil from "@/utils/ByteUtil";

export default {
  name: "PostList",
  props: {
    posts: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
  },
  emits: ["clickTitle"],
  setup(props, { emit }) {
    let hoverTitle = ref(null);

    const curtailText = text => {
      return ByteUtil.curtailTextInBytes(text, 90);
    };

    const changeHover = index => {
      hoverTitle.value = index;
    };

    const clickTitle = id => {
      emit("clickTitle", id);
    };

    return { hoverTitle, curtailText, changeHover, clickTitle, DateUtil };
  },
};
</script>

<style scoped>
th {
  text-align: center;
  font-weight: bold;
}

td {
  text-align: center;
}

.td-title {
  text-align: left;
}
</style>
