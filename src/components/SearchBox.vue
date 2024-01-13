<template>
  <v-row dense>
    <v-sheet class="pa-4">등록일</v-sheet>
    <v-col cols="2">
      <v-text-field
        type="date"
        density="compact"
        variant="outlined"
        :min="minDate"
        :max="maxDate"
        v-model="searchCriteria.startDate"
      ></v-text-field>
    </v-col>
    <v-sheet class="pa-4">~</v-sheet>
    <v-col cols="2">
      <v-text-field
        type="date"
        density="compact"
        variant="outlined"
        :min="minDate"
        :max="maxDate"
        v-model="searchCriteria.endDate"
      ></v-text-field>
    </v-col>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-col cols="2">
      <v-select
        density="compact"
        variant="outlined"
        :items="categories"
        item-title="name"
        item-value="id"
        label="카테고리 선택"
        v-model="searchCriteria.categoryId"
      >
      </v-select>
    </v-col>
    <v-col cols="3">
      <v-text-field
        density="compact"
        variant="outlined"
        single-line
        v-model="searchCriteria.searchWord"
      ></v-text-field>
    </v-col>
    <v-col cols="1">
      <v-btn height="40px" color="indigo" @click="search">검색</v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { ref } from "vue";

export default {
  name: "SearchBox",
  props: ["categories", "criteria"],
  emits: ["searchEvent"],
  setup(props, { emit }) {
    const minDate = "1970-01-01";
    const maxDate = new Date().toISOString().split("T")[0];

    let searchCriteria = ref({
      startDate: props.criteria.startDate,
      endDate: props.criteria.endDate,
      categoryId: props.criteria.categoryId,
      searchWord: props.criteria.searchWord,
    });

    const search = () => {
      emit("searchEvent", searchCriteria.value);
    };

    return { minDate, maxDate, searchCriteria, search };
  },
};
</script>

<style scoped></style>
