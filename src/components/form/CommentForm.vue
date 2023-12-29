<template>
  <v-dialog v-model="dialog" class="m-5" width="auto">
    <OneButtonModal
      :message="dialogMessage"
      v-on:close="dialog = false"
    ></OneButtonModal>
  </v-dialog>
  <div class="align-content-center">
    <v-card
      variant="outlined"
      color="grey-lighten-1"
      width="100%"
      class="card-body"
      compact
    >
      <div class="card-text">
        <div v-if="name">
          {{ name }}
        </div>
        <v-textarea
          v-model="content"
          variant="underlined"
          rows="1"
          auto-grow
          :counter="maxLength"
          :rules="[rules.maxLength]"
          :placeholder="placeHold"
        ></v-textarea>
      </div>
      <v-card-actions>
        <v-row justify="end">
          <v-btn
            v-if="cancellable"
            width="80"
            height="30"
            variant="outlined"
            @click="cancel"
            >취소
          </v-btn>
          <v-btn
            width="80"
            height="30"
            variant="tonal"
            color="indigo"
            @click="submitComment"
            >등록
          </v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { ref } from "vue";
import OneButtonModal from "@/components/modal/OneButtonModal.vue";

export default {
  name: "CommentForm",
  components: { OneButtonModal },
  props: {
    name: {
      type: String,
      required: false,
    },
    text: {
      type: String,
      required: false,
      default: "",
    },
    cancellable: {
      type: Boolean,
      required: false,
      default: false,
    },
    placeHold: {
      type: String,
      required: false,
      default: "",
    },
  },
  emits: ["submit"],
  setup(props, { emit }) {
    let content = ref(props.text);

    let dialog = ref(false);
    let dialogMessage = ref("");

    const maxLength = 1000;
    const rules = {
      require: v => !!v || "내용을 입력해주세요",
      maxLength: v =>
        v?.length < maxLength || `${maxLength}자까지 작성할 수 있습니다`,
    };

    const submitComment = () => {
      if (validateContent()) {
        emit("submit", content.value);
        content.value = "";
      }
    };

    const cancel = () => {
      emit("cancel");
    };

    const validateContent = () => {
      for (let rule in rules) {
        if (rules[rule](content.value) !== true) {
          dialogMessage.value = rules[rule](content.value);
          dialog.value = true;
          return false;
        }
      }
      return true;
    };

    return {
      content,
      rules,
      dialog,
      dialogMessage,
      maxLength,
      submitComment,
      cancel,
    };
  },
};
</script>

<style scoped>
.card-body {
  padding: 20px 30px 10px;
}

.card-text {
  color: black;
  font-weight: bold;
}
</style>
