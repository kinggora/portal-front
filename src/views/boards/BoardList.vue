<template>
  <div>
    <SearchBox
      :categories="categories"
      :criteria="criteria"
      v-on:searchEvent="clickSearchBtn"
    />
    <div class="list-area">
      <div v-if="criteria.boardType === 'Q'">
        <div class="mb-2">총 {{ pageInfo.totalCount }}건</div>
        <QnaList :posts="posts" @clickTitle="moveToDetail"></QnaList>
      </div>
      <div v-else>
        <div class="d-flex justify-space-between mb-2">
          <div class="text-left mt-2">총 {{ pageInfo.totalCount }}건</div>
          <div class="text-right">
            <BoardTypeConverter
              :currentBoardType="criteria.boardType"
              @convertType="convertBoardType"
            ></BoardTypeConverter>
          </div>
        </div>
        <div v-if="criteria.boardType === 'I'">
          <GalleryList :posts="posts" @clickItem="moveToDetail"></GalleryList>
        </div>
        <div v-else>
          <PostList :posts="posts" @clickTitle="moveToDetail"></PostList>
        </div>
      </div>
    </div>
    <div class="text-right">
      <v-btn
        v-if="authorization(boardInfo.accessWrite)"
        width="150"
        color="indigo"
        @click="clickWriteBtn"
        >등록
      </v-btn>
    </div>
    <div class="page-bar-area">
      <PaginationBar
        :page-info="pageInfo"
        :display-page-count="10"
        @handlePage="moveToPage"
      ></PaginationBar>
    </div>
  </div>
</template>

<script>
import SearchBox from "@/components/SearchBox.vue";
import router from "@/router";
import { inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import SearchCriteria from "@/model/SearchCriteria";
import PaginationBar from "@/components/PaginationBar.vue";
import PostList from "@/components/list/PostList.vue";
import QnaList from "@/components/list/QnaList.vue";
import GalleryList from "@/components/list/GalleryList.vue";
import BoardTypeConverter from "@/components/BoardTypeConverter.vue";
import { authorization } from "@/utils/AuthorizaionService";

export default {
  name: "BoardList",
  methods: { authorization },
  components: {
    BoardTypeConverter,
    GalleryList,
    QnaList,
    PostList,
    PaginationBar,
    SearchBox,
  },
  setup() {
    const route = useRoute();
    const axios = inject("axios");
    let criteria = new SearchCriteria(route.query);
    const boardInfo = ref({});
    onMounted(() => {
      if (criteria.boardId) {
        axios
          .get(`/boards/${criteria.boardId}`)
          .then(res => {
            boardInfo.value = res.data.data;
            fetchCategories();
            fetchPosts();
          })
          .catch(e => {
            console.log(e);
          });
      } else {
        alert("잘못된 접근 입니다.");
      }
    });

    let categories = ref([]);
    const fetchCategories = () => {
      axios
        .get(`/boards/${criteria.boardId}/categories`)
        .then(res => {
          categories.value = res.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    };

    let posts = ref([]);
    let pageInfo = ref({});
    const fetchPosts = () => {
      axios
        .get(`/boards/${criteria.boardId}/posts`, {
          params: {
            ...criteria.getRequestParam(),
            size: criteria.boardType === "I" ? 8 : 10,
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

    const clickSearchBtn = input => {
      criteria.setSearchEvent(input);
      router.push({
        path: "/portal",
        query: {
          ...criteria.getQueryParam(),
        },
      });
    };

    const moveToPage = page => {
      router.push({
        path: `/portal`,
        query: {
          ...criteria.getQueryParam(),
          page: page,
        },
      });
    };

    const moveToDetail = id => {
      router.push({
        path: `/portal/${id}`,
        query: {
          ...criteria.getQueryParam(),
        },
      });
    };

    const moveToQnaDetail = id => {
      router.push({
        path: `/portal/qna/${id}`,
        query: {
          ...criteria.getQueryParam(),
        },
      });
    };

    const clickWriteBtn = () => {
      router.push({
        path: `/portal/write`,
        query: {
          boardId: criteria.boardId,
        },
      });
    };

    const convertBoardType = type => {
      criteria.setBoardType(type);
      router.push({
        path: `/portal`,
        query: {
          ...criteria.getQueryParam(),
        },
      });
    };
    return {
      boardInfo,
      categories,
      posts,
      pageInfo,
      criteria,
      moveToPage,
      moveToQnaDetail,
      moveToDetail,
      clickWriteBtn,
      clickSearchBtn,
      convertBoardType,
    };
  },
};
</script>

<style scoped>
.list-area {
  margin-bottom: 20px;
  min-height: 600px;
}

.page-bar-area {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
