<template>
  <v-item-group class="text-center">
    <v-item v-if="existPrev">
      <v-btn icon="mdi-chevron-left" variant="text" @click="clickPrev"></v-btn>
    </v-item>
    <v-item v-for="num in pageList" :key="num">
      <v-btn
        :active="pageInfo.pageNum === num"
        variant="text"
        @click="clickNum(num)"
        >{{ num }}
      </v-btn>
    </v-item>
    <v-item v-if="existNext">
      <v-btn icon="mdi-chevron-right" variant="text" @click="clickNext">
      </v-btn>
    </v-item>
  </v-item-group>
</template>

<script>
import { computed } from "vue";

export default {
  name: "PaginationBar",
  props: {
    pageInfo: {
      type: Object,
      required: true,
      default: () => {
        return {
          pageNum: 1,
          totalPages: 1,
          totalCounts: 0,
        };
      },
    },
    displayPageCount: {
      type: Number,
      required: true,
      default: 10,
    },
  },
  emits: ["handlePage"],
  setup(props, { emit }) {
    const clickNum = num => {
      emit("handlePage", num);
    };

    const clickPrev = () => {
      if (existPrev.value) {
        emit("handlePage", endPageNum.value - props.displayPageCount);
      }
    };

    const clickNext = () => {
      if (existNext.value) {
        emit("handlePage", startPageNum.value + props.displayPageCount);
      }
    };

    const existPrev = computed(() => {
      return endPageNum.value - props.displayPageCount > 0;
    });

    const existNext = computed(() => {
      return (
        startPageNum.value + props.displayPageCount <= props.pageInfo.totalPages
      );
    });

    const startPageNum = computed(() => {
      return (
        Math.floor((props.pageInfo.pageNum - 1) / props.displayPageCount) *
          props.displayPageCount +
        1
      );
    });

    const endPageNum = computed(() => {
      return startPageNum.value + props.displayPageCount - 1;
    });

    const pageList = computed(() => {
      let list = [];
      let lastNum;
      if (endPageNum.value > props.pageInfo.totalPages) {
        lastNum = props.pageInfo.totalPages;
      } else {
        lastNum = endPageNum.value;
      }
      for (let n = startPageNum.value; n <= lastNum; n++) {
        list.push(n);
      }
      return list;
    });

    return {
      pageList,
      existPrev,
      existNext,
      clickNum,
      clickPrev,
      clickNext,
    };
  },
};
</script>

<style scoped></style>
