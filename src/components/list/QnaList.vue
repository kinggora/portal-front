<template>
  <v-table style="width: 100%">
    <thead>
      <tr>
        <th class="text-center font-weight-bold">카테고리</th>
        <th class="text-center font-weight-bold" style="width: 40%">제목</th>
        <th class="text-center font-weight-bold">작성자</th>
        <th class="text-center font-weight-bold">답변 여부</th>
        <th class="text-center font-weight-bold">등록 일시</th>
        <th class="text-center font-weight-bold">수정 일시</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(post, index) in posts" :key="index">
        <td>{{ post.categoryName }}</td>
        <td class="td-title" style="width: 40%">
          <a
            :style="{
              'text-decoration-line': hoverTitle === index ? 'underline' : '',
              cursor: 'pointer',
            }"
            @click="clickTitle(post.postId)"
            @mouseover="changeHover(index)"
            @mouseleave="changeHover(null)"
          >
            {{ curtailTitle(post.title) }}</a
          >
          <v-icon class="ml-2" icon="mdi-lock" v-if="post.secret" />
        </td>
        <td>{{ post.memberName }}</td>
        <td>
          <v-icon
            icon="mdi-check-circle"
            color="success"
            v-if="post.childExists"
          />
          <v-icon icon="mdi-circle-slice-1" v-if="!post.childExists" />
        </td>
        <td>{{ DateUtil.dateTimeToString(post.regDate) }}</td>
        <td>
          {{ post.modDate ? DateUtil.dateTimeToString(post.modDate) : "-" }}
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import { ref } from "vue";
import DateUtil from "@/utils/DateUtil";
import ByteUtil from "@/utils/ByteUtil";

export default {
  name: "QnaList",
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

    const curtailTitle = title => {
      return ByteUtil.curtailTextInBytes(title, 90);
    };

    const changeHover = index => {
      hoverTitle.value = index;
    };

    const clickTitle = id => {
      emit("clickTitle", id);
    };

    return { hoverTitle, curtailTitle, changeHover, clickTitle, DateUtil };
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
