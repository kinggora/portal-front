<template>
  <v-row>
    <v-col v-for="(item, index) in list" :key="index" cols="6">
      <TitleHeader
        class="mb-2"
        :title="item.title"
        :style="{ cursor: item.id ? 'pointer' : '' }"
        @click="moveToList(item.id, item.type)"
      ></TitleHeader>
      <v-divider
        class="border-opacity-100 mb-2"
        thickness="4"
        color="indigo"
      ></v-divider>
      <div v-if="item.type === 'I'">
        <GalleryList
          :posts="item.posts"
          columnCount="3"
          @clickItem="moveToDetail"
          :summary="true"
        ></GalleryList>
      </div>
      <div v-else>
        <PostSummaryList
          :posts="item.posts"
          @clickTitle="moveToDetail"
        ></PostSummaryList>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { inject, onMounted, ref } from "vue";
import DateUtil from "@/utils/DateUtil";
import PostSummaryList from "@/components/list/PostSummaryList.vue";
import router from "@/router";
import TitleHeader from "@/components/TitleHeader.vue";
import store from "@/store";
import GalleryList from "@/components/list/GalleryList.vue";

export default {
  name: "MainHome",
  components: { GalleryList, TitleHeader, PostSummaryList },
  setup() {
    const axios = inject("axios");
    let list = ref([]);

    onMounted(() => {
      const boardInfos = store.getters["boardInfoStore/getBoardInfos"];
      let promises = [];
      for (let boardInfo of boardInfos) {
        if (!boardInfo.allowSecret) {
          promises.push(fetchPosts(boardInfo));
        }
      }
      promises.push(fetchHitPosts());
      Promise.all(promises).then(() => {
        list.value.sort((a, b) => {
          return a.id - b.id;
        });
      });
    });

    const fetchHitPosts = () => {
      return axios
        .get(`/boards/hit/posts`, {
          params: {
            startDate: DateUtil.getLastWeek(),
            endDate: DateUtil.getToday(),
            page: 1,
            size: 8,
          },
        })
        .then(res => {
          list.value.push({
            id: null,
            title: "WEEKLY BEST: 조회수",
            type: "L",
            posts: res.data.data,
          });
        })
        .catch(e => {
          console.log(e);
        });
    };

    const fetchPosts = boardInfo => {
      return axios
        .get(`/boards/${boardInfo.id}/posts`, {
          params: {
            page: 1,
            size: boardInfo.boardType === "I" ? 6 : 8,
          },
        })
        .then(res => {
          list.value.push({
            id: boardInfo.id,
            title: boardInfo.subject,
            type: boardInfo.boardType,
            posts: res.data.data.data,
          });
        })
        .catch(e => {
          console.log(e);
        });
    };

    const moveToDetail = id => {
      router.push({
        path: `/portal/${id}`,
      });
    };
    const moveToList = (id, type) => {
      router.push({
        path: "/portal",
        query: {
          boardId: id,
          boardType: type,
        },
      });
    };
    return { list, moveToDetail, moveToList };
  },
};
</script>

<style scoped></style>
