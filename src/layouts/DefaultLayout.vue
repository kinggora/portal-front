<template>
  <div>
    <div class="toolbar">
      <BoardsToolbar />
    </div>
    <div class="body">
      <div class="menu">
        <BoardsMenu />
      </div>
      <div class="content">
        <router-view />
      </div>
    </div>
    <BoardsFooter />
  </div>
</template>
<script>
import BoardsFooter from "@/layouts/BoardsFooter.vue";
import BoardsToolbar from "@/layouts/BoardsToolbar.vue";
import BoardsMenu from "@/layouts/BoardsMenu.vue";

export default {
  name: "DefaultLayout",
  components: { BoardsMenu, BoardsToolbar, BoardsFooter },
};
</script>
<style scoped>
.body {
  display: flex;
}
.content {
  flex: 5;
  padding: 30px 100px 100px;
}
</style>
