<template>
  <div>
    <v-card>
      <v-layout class="v-layout--full-height">
        <v-navigation-drawer floating permanent>
          <v-list>
            <v-list-item
              v-for="(menu, index) in menus"
              :active="menu.id === selected"
              :key="index"
              :value="menu.id"
              :title="menu.subject"
              @click="moveToMenu(menu.id, menu.boardType)"
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
import { useRoute } from "vue-router";
import { computed } from "vue";

export default {
  name: "BoardsMenu",
  props: {
    menus: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
  },
  setup() {
    const route = useRoute();
    let selected = computed(() => {
      if (route.query.boardId) {
        return parseInt(route.query.boardId);
      }
      return null;
    });
    const moveToMenu = (boardId, boardType) => {
      router.push({
        path: `/portal`,
        query: {
          boardId: boardId,
          boardType: boardType,
        },
      });
    };
    return { selected, moveToMenu };
  },
};
</script>
<style scoped></style>
