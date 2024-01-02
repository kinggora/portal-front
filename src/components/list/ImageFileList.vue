<template>
  <v-col v-for="(src, index) in imageSrcList" :key="index" cols="auto">
    <v-img width="200" height="200" :src="src">
      <v-btn
        class="float-right mt-1 mr-1"
        density="compact"
        size="small"
        icon="mdi-close"
        @click="clickDeleteBtn(index)"
      ></v-btn>
    </v-img>
  </v-col>
</template>

<script>
export default {
  name: "ImageFileList",
  props: {
    imageSrcList: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
  },
  emits: ["delete", "cancel"],
  setup(props, { emit }) {
    const clickDeleteBtn = index => {
      emit("delete", index);
    };

    return { clickDeleteBtn };
  },
};
</script>

<style scoped></style>
