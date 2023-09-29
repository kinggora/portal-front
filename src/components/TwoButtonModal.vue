<template>
  <div class="modal-bg">
    <div class="modal-container">
      <v-card class="modal-area" variant="tonal" color="indigo">
        <div class="text-area">
          {{ question }}
        </div>
        <div class="btn-area">
          <v-btn
            class="mr-2"
            color="indigo"
            variant="outlined"
            width="150px"
            @click="sendAnswer(false)"
            >Cancel</v-btn
          >
          <v-btn
            class="ml-2"
            color="indigo"
            width="150px"
            @click="sendAnswer(true)"
            >OK</v-btn
          >
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "TwoButtonModal",
  props: {
    question: String,
  },
  methods: {
    sendAnswer(answer) {
      this.$emit("sendAnswer", answer);
    },
  },
};
</script>

<style scoped>
.modal-bg {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow-y: scroll;
  position: fixed;
  display: flex;
  background: rgba(0, 0, 0, 0.33);
}
.modal-container {
  background-color: white;
  border-radius: 5px;
  width: fit-content;
  margin: auto;
}
.modal-area {
  padding: 50px 50px 30px 50px;
  width: max-content;
  height: fit-content;
  text-align: center;
}
.text-area {
  margin-bottom: 50px;
}
</style>
