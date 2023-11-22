<template>
  <v-card class="modal-area" variant="tonal" color="indigo">
    <div class="text-area">
      {{ question }}
    </div>
    <v-card-actions>
      <v-btn
        class="mr-2"
        color="indigo"
        variant="outlined"
        width="150px"
        @click="sendAnswer(false)"
        >Cancel
      </v-btn>
      <v-btn
        class="ml-2"
        color="indigo"
        variant="flat"
        width="150px"
        @click="sendAnswer(true)"
        >OK
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "TwoButtonModal",
  props: {
    question: {
      type: String,
      required: true,
    },
  },
  emits: ["sendAnswer"],
  setup(props, { emit }) {
    const sendAnswer = answer => {
      emit("sendAnswer", answer);
    };
    return { sendAnswer };
  },
};
</script>

<style scoped>
.modal-area {
  padding: 50px 50px 30px 50px;
  width: max-content;
  height: fit-content;
  text-align: center;
  background-color: white;
}

.text-area {
  margin-bottom: 50px;
}
</style>
