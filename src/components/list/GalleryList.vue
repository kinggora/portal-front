<template>
  <v-row>
    <v-col
      v-for="(post, index) in posts"
      :key="index"
      class="fill-height overflow-auto"
      cols="3"
    >
      <v-card>
        <v-img
          :src="post.thumbUrl"
          aspect-ratio="1"
          cover
          class="bg-grey-lighten-2"
          @click="clickItem(post.postId)"
        >
        </v-img>
        <v-card-title class="text-h6" style="font-weight: bold"
          ><a>{{ post.title }}</a>
          <a v-if="post.commentCount > 0" class="ml-2"
            >[{{ post.commentCount }}]</a
          >
        </v-card-title>
        <v-card-subtitle class="pb-2">
          <div>
            {{ post.memberName }}
          </div>
          <div>
            <div class="float-left mr-2">
              {{ DateFormatter.dateToString(post.regDate) }}
            </div>
            <div class="float-left">조회수 {{ post.hit }}</div>
          </div>
        </v-card-subtitle>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import DateFormatter from "../../utils/DateFormatter";

export default {
  name: "GalleryList",
  computed: {
    DateFormatter() {
      return DateFormatter;
    },
  },
  props: {
    posts: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
  },
  emits: ["clickItem"],
  setup(props, { emit }) {
    const clickItem = id => {
      emit("clickItem", id);
    };
    return { clickItem };
  },
};
</script>

<style scoped></style>
