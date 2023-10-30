<template>
  <div>
    <TitleHeader :title="boardInfo?.subject" href="" />
    <SearchBox
      :categories="categories"
      :criteria="criteria"
      v-on:searchEvent="reload"
    />
    <v-table style="width: 100%">
      <thead>
        <tr>
          <th class="text-center font-weight-bold">카테고리</th>
          <th class="text-center font-weight-bold" style="width: 50%">제목</th>
          <th class="text-center font-weight-bold">작성자</th>
          <th class="text-center font-weight-bold">조회수</th>
          <th class="text-center font-weight-bold">등록 일시</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(post, index) in posts" :key="index">
          <td>{{ post.category.name }}</td>
          <td class="td-title" style="width: 50%">
            <a
              :style="{
                'text-decoration-line': hoverTitle === index ? 'underline' : '',
                cursor: 'pointer',
              }"
              @click="moveToDetail(post.id)"
              @mouseover="changeHover(index)"
              @mouseleave="changeHover(null)"
            >
              {{ curtailTitle(post.title) }}</a
            >
            <v-icon
              class="ml-2"
              v-if="post.attached"
              icon="mdi-attachment"
            ></v-icon>
          </td>
          <td>{{ post.member.name }}</td>
          <td>{{ post.hit }}</td>
          <td>{{ formatDate(post.regDate) }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-row justify="end">
      <v-btn width="150" color="indigo" @click="moveToWrite">등록</v-btn>
    </v-row>
    {{ $route.query }}
  </div>
</template>

<script>
import TitleHeader from "@/components/TitleHeader.vue";
import SearchBox from "@/components/SearchBox.vue";
import router from "@/router";
import { inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import SearchCriteria from "@/model/SearchCriteria";
import DateFormatter from "@/utils/DateFormatter";

export default {
  name: "BoardList",
  props: ["boardName"],
  components: { SearchBox, TitleHeader },
  setup(props) {
    const route = useRoute();
    const axios = inject("axios");
    let boardInfo = ref({});
    let categories = ref([]);
    let posts = ref([]);
    let criteria = new SearchCriteria(route.query);

    onMounted(() => {
      axios
        .get(`/info/${props.boardName}`)
        .then(res => {
          console.log(res.data);
          boardInfo.value = res.data.data;
          const boardId = boardInfo.value.id;
          fetchCategories(boardId);
          fetchPosts(boardId);
        })
        .catch(e => {
          console.log(e);
        });
    });

    const fetchCategories = boardId => {
      axios
        .get(`/category/${boardId}`)
        .then(res => {
          console.log(res.data);
          categories.value = res.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    };

    const fetchPosts = boardId => {
      criteria.boardId = boardId;
      axios
        .get("/posts", {
          params: criteria.getRequestParam(),
        })
        .then(res => {
          console.log(res.data);
          posts.value = res.data.data;
        })
        .catch(e => {
          console.log(e.data);
        });
    };

    const reload = criteria => {
      router.push({
        path: `/${boardInfo.value.name}`,
        query: { ...criteria },
      });
    };

    return { boardInfo, categories, posts, criteria, reload };
  },
  data() {
    return {
      hoverTitle: null,
    };
  },
  methods: {
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
    curtailTitle(title) {
      return title.length > 35 ? title.substring(0, 35) + "..." : title;
    },
    changeHover(index) {
      this.hoverTitle = index;
    },
    formatDate(date) {
      return DateFormatter.dateToString(date);
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
