<template>
  <v-row :dense="summary">
    <v-col
      v-for="(post, index) in posts"
      :key="index"
      class="fill-height overflow-auto"
      :cols="12 / columnCount"
    >
      <div v-if="summary">
        <GallerySummaryItem
          :post="post"
          @click="clickItem(post.postId)"
        ></GallerySummaryItem>
      </div>
      <div v-else>
        <GalleryItem :post="post" @click="clickItem(post.postId)"></GalleryItem>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import DateUtil from "../../utils/DateUtil";
import GallerySummaryItem from "@/components/list/item/GallerySummaryItem.vue";
import GalleryItem from "@/components/list/item/GalleryItem.vue";

export default {
  name: "GalleryList",
  components: { GalleryItem, GallerySummaryItem },
  props: {
    posts: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
    columnCount: {
      type: Number,
      required: true,
      default: 4,
    },
    summary: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["clickItem"],
  setup(props, { emit }) {
    const clickItem = id => {
      emit("clickItem", id);
    };
    return { clickItem, DateUtil };
  },
};
</script>
<style scoped></style>
