<template>
  <v-file-input
    label="파일 첨부 (최대 10MB)"
    show-size
    variant="filled"
    prepend-icon="mdi-camera"
    v-model="input"
    @change="addInputFile"
  ></v-file-input>
  <FileList
    :files="existingFiles"
    :deletable="true"
    @delete="deleteExistingFile"
  ></FileList>
  <FileList
    :files="inputFileData"
    :deletable="true"
    @delete="deleteInputFile"
  ></FileList>
</template>

<script>
import { computed, ref } from "vue";
import FileList from "@/components/list/FileList.vue";

export default {
  name: "AttachFileInput",
  components: { FileList },
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
    let inputFiles = ref([]);
    const addInputFile = () => {
      inputFiles.value.push(input.value);
      input.value = null;
      emit("change", inputFiles.value);
    };

    const deleteInputFile = deletedIndex => {
      inputFiles.value.splice(deletedIndex, 1);
      emit("change", inputFiles.value);
    };

    const deleteExistingFile = deletedIndex => {
      emit("delete", props.existingFiles[deletedIndex]);
    };

    const inputFileData = computed(() => {
      let fileData = [];
      for (let i = 0; i < inputFiles.value.length; i++) {
        const file = inputFiles.value[i];
        fileData.push({
          origName: file[0].name,
          size: file[0].size,
        });
      }
      return fileData;
    });

    return {
      input,
      inputFileData,
      addInputFile,
      deleteInputFile,
      deleteExistingFile,
    };
  },
};
</script>

<style scoped></style>
