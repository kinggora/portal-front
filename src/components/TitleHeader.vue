<template>
  <div>
    <h2>{{ this.title }}</h2>
  </div>
</template>

<script>
export default {
  name: "TitleHeader",
  props: {
    title: String,
  },
};
</script>
<style scoped>
div {
  margin-bottom: 30px;
}
</style>
