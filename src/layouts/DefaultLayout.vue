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
import BoardsFooter from "@/components/layout/BoardsFooter.vue";
import BoardsToolbar from "@/components/layout/BoardsToolbar.vue";
import BoardsMenu from "@/components/layout/BoardsMenu.vue";
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
        .get("/boards")
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
  min-height: 1000px;
}

.content {
  flex: 5;
  padding: 30px 10% 30px 5%;
}
</style>
