<template>
  <div>
    <v-card>
      <v-layout class="v-layout--full-height">
        <v-navigation-drawer floating permanent>
          <v-list>
            <v-list-item
              v-for="(menu, index) in menus"
              :key="index"
              :value="menu.id"
              :title="menu.subject"
              @click="moveToMenu(menu.name)"
            >
              <template v-slot:prepend>
                <v-icon :icon="menu.icon"></v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-main style="height: 500px"></v-main>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import router from "@/router";

export default {
  name: "BoardsMenu",
  props: ["menus"],
  setup() {
    const moveToMenu = menuName => {
      router.push({
        path: `/${menuName}`,
      });
    };
    return { moveToMenu };
  },
};
</script>
<style scoped></style>
