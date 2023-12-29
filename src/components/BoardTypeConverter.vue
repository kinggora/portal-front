<template>
  <v-btn-toggle v-model="selected" color="indigo" mandatory>
    <v-btn
      icon="mdi-border-all"
      value="I"
      @click="clickTypeButton(`I`)"
    ></v-btn>
    <v-btn
      icon="mdi-view-headline"
      value="L"
      @click="clickTypeButton(`L`)"
    ></v-btn>
  </v-btn-toggle>
</template>

<script>
import { ref } from "vue";

export default {
  name: "BoardTypeConverter",
  props: {
    currentBoardType: {
      type: String,
      default: "L",
      require: true,
    },
  },
  emits: ["convertType"],
  setup(props, { emit }) {
    let selected = ref(props.currentBoardType);
    if (props.currentBoardType === "I") {
      selected.value = "I";
    }

    const clickTypeButton = type => {
      emit("convertType", type);
    };
    return {
      selected,
      clickTypeButton,
    };
  },
};
</script>

<style scoped></style>
