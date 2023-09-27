<template>
  <div>
    <v-container fluid>
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
          ></v-select>
        </v-col>
        <v-col cols="3">
          <v-text-field
            density="compact"
            variant="outlined"
            single-line
            placeholder="제목/작성자/내용"
            v-model="searchCriteria.searchWord"
          ></v-text-field>
        </v-col>
        <v-col cols="1">
          <v-btn height="40px" color="indigo" @click="search">검색</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "SearchBox",
  props: ["categories"],
  data() {
    return {
      minDate: "1970-01-01",
      maxDate: this.getCurrentDate(),
      searchCriteria: {
        startDate: "",
        endDate: "",
        categoryId: "",
        searchWord: "",
      },
      rules: {
        required: v => !!v || "E-mail is required",
        startDate: [
          v =>
            /^\d{4}-\d{2}-\d{2}$/.test(v) || "날짜 형식이 올바르지 않습니다.",
          v => new Date(v) < new Date(this.searchCriteria.endDate) || "",
        ],
        endDate: [
          v =>
            /^\d{4}-\d{2}-\d{2}$/.test(v) || "날짜 형식이 올바르지 않습니다.",
          v => new Date(v) > new Date(this.searchCriteria.startDate) || "",
        ],
      },
    };
  },
  methods: {
    search() {
      this.$emit("searchEvent", this.searchCriteria);
    },
    getCurrentDate() {
      return new Date().toISOString().split("T")[0];
    },
  },
};
</script>

<style scoped></style>
