<template>
  <v-table density="compact">
    <tbody>
      <tr v-for="(post, index) in posts" :key="index">
        <td>
          <div class="d-flex justify-space-between text-caption mt-2">
            <div>
              {{ post.memberName }}
            </div>
            <div>
              {{ post.hit }} / {{ DateUtil.dateToString(post.regDate) }}
            </div>
          </div>
          <div class="text-subtitle-2 mb-2">
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
            <a
              v-if="post.commentCount > 0"
              class="ml-2"
              style="font-weight: bold"
              >[{{ post.commentCount }}]</a
            >
          </div>
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
  name: "PostSummaryList",
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
      return ByteUtil.curtailTextInBytes(text, 100);
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
<style scoped></style>
