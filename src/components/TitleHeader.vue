<template>
  <div>
    <h2>{{ this.title }}</h2>
  </div>
</template>

<script>
export default {
  name: "TitleHeader",
  props: {
    title: {
      type: String,
      required: true,
      default: "",
    },
  },
};
</script>
<style scoped></style>
