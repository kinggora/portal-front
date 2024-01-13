<template>
  <v-card>
    <v-img
      class="bg-grey-lighten-2"
      :src="post.thumbUrl"
      height="200"
      aspect-ratio="1"
      cover
    >
    </v-img>
    <v-card-item>
      <div class="text-subtitle-2" style="font-weight: bold">
        <a>{{ curtailText(post.title) }}</a>
        <a v-if="post.commentCount > 0" class="ml-2"
          >[{{ post.commentCount }}]</a
        >
      </div>
      <div class="text-caption" style="color: darkgrey">
        <div>
          {{ post.memberName }}
        </div>
        <div>
          <div class="float-left mr-2">
            {{ DateUtil.dateTimeToString(post.regDate) }}
          </div>
          <div class="float-left">조회수 {{ post.hit }}</div>
        </div>
      </div>
    </v-card-item>
  </v-card>
</template>

<script>
import DateUtil from "@/utils/DateUtil";
import ByteUtil from "@/utils/ByteUtil";

export default {
  name: "GalleryItem",
  props: {
    post: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
  },
  setup() {
    const curtailText = text => {
      return ByteUtil.curtailTextInBytes(text, 45);
    };

    return { DateUtil, curtailText };
  },
};
</script>

<style scoped></style>
