<template>
  <div>
    <BoardsToolbar />
    <router-view></router-view>
    <BoardsFooter />
  </div>
</template>

<script>
import BoardsToolbar from "@/layouts/BoardsToolbar.vue";
import BoardsFooter from "@/layouts/BoardsFooter.vue";

export default {
  name: "NoMenuLayout",
  components: { BoardsFooter, BoardsToolbar },
};
</script>
<style scoped></style>
