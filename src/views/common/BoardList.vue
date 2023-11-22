<template>
  <div>
    <TitleHeader :title="boardInfo?.subject" href="" />
    <SearchBox
      :categories="categories"
      :criteria="criteria"
      v-on:searchEvent="search"
    />
    <div class="mb-2">총 {{ pageInfo?.totalCount }}건</div>
    <div class="list-area">
      <div v-if="listMode">
        <PostList :posts="posts" @clickTitle="moveToDetail"></PostList>
      </div>
      <div v-else>
        <GalleryList :posts="posts" @clickItem="moveToDetail"></GalleryList>
      </div>
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
    {{ posts }}
    {{ pageInfo }}
  </div>
</template>

<script>
import TitleHeader from "@/components/TitleHeader.vue";
import SearchBox from "@/components/SearchBox.vue";
import router from "@/router";
import { inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import SearchCriteria from "@/model/SearchCriteria";
import PaginationBar from "@/components/PaginationBar.vue";
import PostList from "@/components/list/PostList.vue";
import GalleryList from "@/components/list/GalleryList.vue";

export default {
  name: "BoardList",
  props: ["boardName"],
  components: {
    PostList,
    GalleryList,
    PaginationBar,
    SearchBox,
    TitleHeader,
  },
  setup(props) {
    const route = useRoute();
    const axios = inject("axios");
    let criteria = new SearchCriteria(route.query);
    let currentPage = route.query.page ? route.query.page : 1;

    let boardInfo = ref({});
    onMounted(() => {
      axios
        .get(`/infos/${props.boardName}`)
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
        .get("/posts", {
          params: {
            ...criteria.getRequestParam(),
            page: currentPage,
            size: 10,
          },
        })
        .then(res => {
          posts.value = res.data.data.data;
          pageInfo.value = res.data.data.pageInfo;
        })
        .catch(e => {
          const error = e.response.data;
          if (error.code === -404 && error.errors.length > 0) {
            alert(error.errors[0].message);
          }
        });
    };

    const search = input => {
      const newCriteria = new SearchCriteria(input);
      router.push({
        path: `/${boardInfo.value.name}`,
        query: {
          ...newCriteria.getRequestParam(),
        },
      });
    };

    const moveToPage = page => {
      router.push({
        path: `/${boardInfo.value.name}`,
        query: {
          ...criteria.getRequestParam(),
          page: page,
        },
      });
    };

    const moveToDetail = id => {
      router.push({
        path: `/${boardInfo.value.name}/${id}`,
        query: {
          ...criteria.getRequestParam(),
          page: currentPage,
        },
      });
    };

    const moveToWrite = () => {
      router.push({
        path: `/${boardInfo.value.name}/write`,
      });
    };

    let listMode = true;
    return {
      boardInfo,
      categories,
      posts,
      pageInfo,
      criteria,
      moveToPage,
      moveToDetail,
      moveToWrite,
      listMode,
      search,
    };
  },
};
</script>

<style scoped>
.list-area {
  margin-bottom: 20px;
}

.page-bar-area {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
