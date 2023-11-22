<template>
  <div>
    <TitleHeader :title="boardInfo?.subject" href="" />
    <SearchBox
      :categories="categories"
      :criteria="criteria"
      v-on:searchEvent="reload"
    />
    <div class="mb-2">총 {{ pageInfo?.totalCount }}건</div>
    <div class="list-area">
      <QnaList :posts="posts" @clickTitle="moveToDetail"></QnaList>
    </div>
    <div class="text-end">
      <v-btn width="150" color="indigo" @click="moveToWrite">등록</v-btn>
    </div>
    <div class="page-bar-area">
      <PaginationBar
        :page-info="pageInfo"
        :display-page-count="10"
        @handlePage="moveToPage"
      ></PaginationBar>
    </div>
    {{ $route.query }}
    {{ pageInfo }}
  </div>
</template>

<script>
import QnaList from "@/components/list/QnaList.vue";
import PaginationBar from "@/components/PaginationBar.vue";
import SearchBox from "@/components/SearchBox.vue";
import TitleHeader from "@/components/TitleHeader.vue";
import { useRoute } from "vue-router";
import { inject, onMounted, ref } from "vue";
import SearchCriteria from "@/model/SearchCriteria";
import router from "@/router";

export default {
  name: "QnaBoardList",
  components: { QnaList, PaginationBar, SearchBox, TitleHeader },
  setup() {
    const route = useRoute();
    const axios = inject("axios");
    let criteria = new SearchCriteria(route.query);
    let boardInfo = ref({});

    onMounted(() => {
      axios
        .get(`/infos/qna`)
        .then(res => {
          boardInfo.value = res.data.data;
          const boardId = boardInfo.value.id;
          fetchCategories(boardId);
          fetchPosts(boardId);
        })
        .catch(e => {
          console.log(e);
        });
    });

    let categories = ref([]);
    const fetchCategories = boardId => {
      axios
        .get(`/categories/${boardId}`)
        .then(res => {
          categories.value = res.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    };

    let posts = ref([]);
    let pageInfo = ref();
    const fetchPosts = boardId => {
      criteria.setBoardId(boardId);
      axios
        .get("/posts/qna", {
          params: criteria.getRequestParam(),
        })
        .then(res => {
          posts.value = res.data.data.data;
          pageInfo.value = res.data.data.pageInfo;
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

    const moveToPage = page => {
      criteria.setPage(page);
      console.log(criteria);
      reload(criteria);
    };

    const moveToDetail = id => {
      router.push({
        path: `/${boardInfo.value.name}/${id}`,
        query: { ...criteria },
      });
    };

    const moveToWrite = () => {
      router.push({
        path: `/${boardInfo.value.name}/write`,
      });
    };
    return {
      boardInfo,
      categories,
      posts,
      pageInfo,
      criteria,
      moveToPage,
      moveToDetail,
      moveToWrite,
      reload,
    };
  },
};
</script>

<style scoped></style>
