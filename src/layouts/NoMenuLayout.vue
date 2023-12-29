<template>
  <div>
    <BoardsToolbar />
    <div class="body">
      <router-view :key="route.fullPath" />
    </div>
    <BoardsFooter />
  </div>
</template>

<script>
import BoardsToolbar from "@/components/layout/BoardsToolbar.vue";
import BoardsFooter from "@/components/layout/BoardsFooter.vue";
import { useRoute } from "vue-router";

export default {
  name: "NoMenuLayout",
  components: { BoardsFooter, BoardsToolbar },
  setup() {
    let route = useRoute();
    return { route };
  },
};
</script>
<style scoped>
.body {
  min-height: 1000px;
}
</style>
