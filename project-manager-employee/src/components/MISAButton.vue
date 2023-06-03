<script>
export default {
  name: "MISAButton",
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<template>
  <button class="" :title="this.title">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped></style>
