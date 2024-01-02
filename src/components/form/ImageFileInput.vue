<template>
  <v-file-input
    label="이미지 첨부 (최대 10MB)"
    variant="filled"
    prepend-icon="mdi-camera"
    accept="image/jpeg, image/png, image/gif, image/bmp"
    v-model="input"
    @change="addInputFile"
  ></v-file-input>
  <v-row justify="start">
    <ImageFileList
      :imageSrcList="existingImageSrcList"
      @delete="deleteExistingFile"
    ></ImageFileList>
    <ImageFileList
      :imageSrcList="inputImageSrcList"
      @delete="deleteInputFile"
    ></ImageFileList>
  </v-row>
</template>

<script>
import { computed, ref } from "vue";
import ImageFileList from "@/components/list/ImageFileList.vue";

export default {
  name: "ImageFileInput",
  components: { ImageFileList },
  props: {
    existingFiles: {
      type: Array,
      required: false,
      default: () => {
        return [];
      },
    },
  },
  emit: ["change", "delete"],
  setup(props, { emit }) {
    let input = ref(null);
    let imageFiles = ref([]);

    let existingImageSrcList = computed(() => {
      let imgSrcList = [];
      for (let i = 0; i < props.existingFiles.length; i++) {
        imgSrcList.push(props.existingFiles[i].url);
      }
      return imgSrcList;
    });

    let inputImageSrcList = computed(() => {
      let imgSrcList = [];
      for (let i = 0; i < imageFiles.value.length; i++) {
        imgSrcList.push(URL.createObjectURL(new Blob(imageFiles.value[i])));
      }
      return imgSrcList;
    });

    const addInputFile = () => {
      imageFiles.value.push(input.value);
      input.value = null;
      emit("change", imageFiles.value);
    };

    const deleteInputFile = deletedIndex => {
      imageFiles.value.splice(deletedIndex, 1);
      emit("change", imageFiles.value);
    };

    const deleteExistingFile = deletedIndex => {
      emit("delete", props.existingFiles[deletedIndex]);
    };

    return {
      input,
      imageFiles,
      existingImageSrcList,
      inputImageSrcList,
      addInputFile,
      deleteInputFile,
      deleteExistingFile,
    };
  },
};
</script>

<style scoped></style>
