<template>
  <v-card>
    <v-img class="bg-grey-lighten-2" :src="post.thumbUrl" height="150" cover>
    </v-img>
    <v-card-item>
      <div class="text-caption" style="font-weight: bold">
        <a>{{ curtailText(post.title) }}</a>
        <a v-if="post.commentCount > 0" class="ml-2"
          >[{{ post.commentCount }}]</a
        >
      </div>
      <div class="text-caption" style="color: darkgrey">
        <div>
          {{ post.memberName }}
        </div>
        <div>{{ post.hit }} / {{ DateUtil.dateToString(post.regDate) }}</div>
      </div>
    </v-card-item>
  </v-card>
</template>

<script>
import DateUtil from "../../../utils/DateUtil";
import ByteUtil from "@/utils/ByteUtil";

export default {
  name: "GallerySummaryItem",
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
      return ByteUtil.curtailTextInBytes(text, 26);
    };
    return { DateUtil, curtailText };
  },
};
</script>

<style scoped></style>
