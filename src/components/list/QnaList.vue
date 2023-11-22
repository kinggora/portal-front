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
        <td>{{ post.category.name }}</td>
        <td class="td-title" style="width: 40%">
          <a
            :style="{
              'text-decoration-line': hoverTitle === index ? 'underline' : '',
              cursor: 'pointer',
            }"
            @click="clickTitle(post.id)"
            @mouseover="changeHover(index)"
            @mouseleave="changeHover(null)"
          >
            {{ curtailTitle(post.title) }}</a
          >
        </td>
        <td>{{ post.member.name }}</td>
        <td>
          <v-icon
            icon="mdi-check-circle"
            color="success"
            v-if="post.existsChild"
          />
          <v-icon icon="mdi-circle-slice-1" v-if="!post.existsChild" />
        </td>
        <td>{{ DateFormatter.dateToString(post.regDate) }}</td>
        <td>
          {{ post.modDate ? DateFormatter.dateToString(post.modDate) : "-" }}
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import { ref } from "vue";
import DateFormatter from "@/utils/DateFormatter";

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
      return title.length > 35 ? title.substring(0, 35) + "..." : title;
    };

    const changeHover = index => {
      hoverTitle.value = index;
    };

    const clickTitle = id => {
      emit("clickTitle", id);
    };

    return { hoverTitle, curtailTitle, changeHover, clickTitle, DateFormatter };
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
