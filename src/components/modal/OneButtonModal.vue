<template>
  <v-card class="modal-area">
    <v-card-text class="text-area">
      {{ message }}
    </v-card-text>
    <v-card-actions justify="center">
      <v-btn variant="flat" color="indigo" block @click="close">확인</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "OneButtonModal",
  props: {
    message: {
      type: String,
      required: true,
    },
  },
  emits: ["close"],
  setup(props, { emit }) {
    const close = () => {
      emit("close");
    };
    return { close };
  },
};
</script>

<style scoped>
.text-area {
  margin-bottom: 20px;
}

.modal-area {
  padding: 20px 50px 20px 50px;
  width: max-content;
  height: fit-content;
  text-align: center;
}
</style>
