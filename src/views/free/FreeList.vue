<template>
  <div>
    <TitleHeader :title="boardInfo.subject" href="" />
    <SearchBox :categories="categories" v-on:searchEvent="search" />
    <v-table style="min-width: 1000px">
      <thead>
        <tr>
          <th class="text-center font-weight-bold">카테고리</th>
          <th class="text-center font-weight-bold" colspan="5">제목</th>
          <th class="text-center font-weight-bold">작성자</th>
          <th class="text-center font-weight-bold">조회수</th>
          <th class="text-center font-weight-bold">등록 일시</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(post, index) in posts" :key="index">
          <td>{{ post.category.name }}</td>
          <td class="td-title" colspan="5">
            <a
              :style="{
                'text-decoration-line': hoverTitle === index ? 'underline' : '',
                cursor: 'pointer',
              }"
              @click="moveToDetail(post.id)"
              @mouseover="changeHover(index)"
              @mouseleave="changeHover(null)"
            >
              {{ getTitle(post.title) }}</a
            >
            <v-icon
              class="ml-2"
              v-if="post.isAttached"
              icon="mdi-attachment"
            ></v-icon>
          </td>
          <td>{{ post.member.name }}</td>
          <td>{{ post.hit }}</td>
          <td>{{ post.regDate }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-row justify="end">
      <v-btn width="150" color="indigo" @click="moveToWrite">등록</v-btn>
    </v-row>
  </div>
</template>

<script>
import TitleHeader from "@/components/TitleHeader.vue";
import SearchBox from "@/components/SearchBox.vue";
import router from "@/router";

export default {
  name: "FreeList",
  components: { SearchBox, TitleHeader },
  data() {
    return {
      boardInfo: {
        id: 4,
        name: "free",
        subject: "자유 게시판",
      },
      categories: [
        { id: 1, name: "JAVA" },
        { id: 2, name: "JavaScript" },
        { id: 3, name: "Python" },
      ],
      posts: [
        {
          id: 1,
          title:
            "자바 (프로그래밍 언어)자바 (프로그래밍 언어)자바 (프로그래밍 언어)자바 (프로그래밍 언어)",
          hit: 100,
          regDate: "2023-09-27 14:36",
          member: {
            id: 12,
            username: "wiki",
            name: "위키피디아",
            role: "ROLE_USER",
          },
          category: {
            id: 1,
            name: "JAVA",
            boardId: 4,
          },
          isAttached: true,
        },
        {
          id: 1,
          title:
            "자바 (프로그래밍 언어)자바 (프로그래밍 언어)자바 (프로그래밍 언어)자바 (프로그래밍 언어)",
          hit: 100,
          regDate: "2023-09-27 14:36",
          member: {
            id: 12,
            username: "wiki",
            name: "위키피디아",
            role: "ROLE_USER",
          },
          category: {
            id: 1,
            name: "JAVA",
            boardId: 4,
          },
          isAttached: true,
        },
      ],
      hoverTitle: null,
    };
  },
  methods: {
    search(criteria) {
      console.log(criteria);
    },
    moveToDetail(id) {
      router.push(`/${this.boardInfo.name}/${id}`);
    },
    moveToWrite() {
      router.push({
        path: `/${this.boardInfo.name}/write`,
        params: {
          boardId: this.boardInfo.id,
        },
      });
    },
    getTitle(title) {
      return title.length > 40 ? title.substring(0, 40) + "..." : title;
    },
    changeHover(index) {
      this.hoverTitle = index;
    },
  },
};
</script>

<style scoped>
v-table {
  margin-bottom: 100px;
}
th {
  text-align: center;
  font-weight: bold;
}
td {
  text-align: center;
}
.td-title {
  text-align: left;
}
</style>
