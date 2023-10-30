<template>
  <div>
    <div class="toolbar">
      <BoardsToolbar />
    </div>
    <div class="body">
      <div class="menu">
        <BoardsMenu :menus="boardInfos" />
      </div>
      <div class="content">
        <router-view :key="route.fullPath" />
      </div>
    </div>
    <BoardsFooter />
  </div>
</template>
<script>
import BoardsFooter from "@/layouts/BoardsFooter.vue";
import BoardsToolbar from "@/layouts/BoardsToolbar.vue";
import BoardsMenu from "@/layouts/BoardsMenu.vue";
import { inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "DefaultLayout",
  components: { BoardsMenu, BoardsToolbar, BoardsFooter },
  setup() {
    const route = useRoute();
    let boardInfos = ref([]);
    onMounted(() => {
      inject("axios")
        .get("/info")
        .then(res => {
          console.log(res.data);
          boardInfos.value = res.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    });
    return { route, boardInfos };
  },
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
