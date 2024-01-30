<template>
  <v-table style="width: 100%">
    <thead>
      <tr>
        <th></th>
        <th class="text-center font-weight-bold" style="width: 70%">제목</th>
        <th class="text-center font-weight-bold">조회수</th>
        <th class="text-center font-weight-bold">작성일</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(post, index) in posts" :key="index">
        <td>
          <v-checkbox-btn
            v-model="checkedList"
            :value="post.postId"
            @change="changeCheckedList"
          ></v-checkbox-btn>
        </td>
        <td class="td-title" style="width: 70%">
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
        <td>{{ post.hit }}</td>
        <td>{{ DateUtil.dateToString(post.regDate) }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import ByteUtil from "@/utils/ByteUtil";
import { ref } from "vue";
import DateUtil from "../../utils/DateUtil";

export default {
  name: "MyPostList",
  props: {
    posts: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
  },
  emits: ["changeCheckedList", "clickTitle"],
  setup(props, { emit }) {
    let checkedList = ref([]);

    const changeCheckedList = () => {
      emit("changeCheckedList", checkedList.value);
    };

    let hoverTitle = ref(null);

    const curtailText = text => {
      return ByteUtil.curtailTextInBytes(text, 120);
    };

    const changeHover = index => {
      hoverTitle.value = index;
    };

    const clickTitle = id => {
      emit("clickTitle", id);
    };

    return {
      checkedList,
      changeCheckedList,
      curtailText,
      hoverTitle,
      changeHover,
      clickTitle,
      DateUtil,
    };
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
