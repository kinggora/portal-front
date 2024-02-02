<template>
  <v-table style="width: 100%">
    <thead>
      <tr>
        <th></th>
        <th class="text-center font-weight-bold" style="width: 100%">댓글</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(comment, index) in comments" :key="index">
        <td>
          <v-checkbox-btn
            v-model="checkedList"
            :value="comment.id"
            @change="changeCheckedList"
          ></v-checkbox-btn>
        </td>
        <td class="list-item pb-2 pt-2">
          <a
            :style="{
              'text-decoration-line': hoverTitle === index ? 'underline' : '',
              cursor: 'pointer',
            }"
            @click="clickTitle(comment.postId)"
            @mouseover="changeHover(index)"
            @mouseleave="changeHover(null)"
          >
            <div>
              {{ comment.content }}
            </div>
            <div>
              {{ DateUtil.dateToString(comment.regDate) }}
            </div>
            <div>
              {{ curtailText(comment.postTitle) }}
            </div>
          </a>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import DateUtil from "../../utils/DateUtil";
import { ref } from "vue";
import ByteUtil from "@/utils/ByteUtil";

export default {
  name: "MyCommentList",
  props: {
    comments: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
  },
  emits: ["clickTitle", "changeCheckedList"],
  setup(props, { emit }) {
    let checkedList = ref([]);

    const changeCheckedList = () => {
      emit("changeCheckedList", checkedList.value);
    };

    let hoverTitle = ref(null);

    const curtailText = text => {
      return ByteUtil.curtailTextInBytes(text, 150);
    };

    const changeHover = index => {
      hoverTitle.value = index;
    };

    const clickTitle = postId => {
      emit("clickTitle", postId);
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
.list-item {
  word-break: break-all;
}
</style>
