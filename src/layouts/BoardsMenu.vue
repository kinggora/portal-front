<template>
  <div>
    <v-card>
      <v-layout class="v-layout--full-height">
        <v-navigation-drawer floating permanent>
          <v-list>
            <v-list-item
              v-for="menu in menus"
              :key="menu.id"
              :value="menu.id"
              :title="menu.subject"
              @click="moveTo(menu.name)"
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
  data() {
    return {
      menus: [
        {
          id: 1,
          name: "notice",
          subject: "공지",
        },
        {
          id: 2,
          name: "news",
          subject: "뉴스",
        },
        {
          id: 3,
          name: "dataroom",
          subject: "자료실",
        },
        {
          id: 4,
          name: "free",
          subject: "자유게시판",
        },
        {
          id: 5,
          name: "gallery",
          subject: "갤러리",
        },
        {
          id: 6,
          name: "qna",
          subject: "Q&A",
        },
      ],
    };
  },
  methods: {
    moveTo(menuName) {
      router.push(`/${menuName}`);
    },
  },
};
</script>
<style scoped></style>
