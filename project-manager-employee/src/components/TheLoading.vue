<script>
export default {
  name: "TheLoading",
  props: ["loadingProgress"],
};
</script>

<template>
  <div class="progress">
    <div class="progress-item">
      <progress :value="this.loadingProgress" max="100"></progress>
    </div>
  </div>
</template>

<style scoped>
.progress {
  position: fixed;
  display: grid;
  place-items: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #0000003a;
  z-index: 2;
}

.progress-item progress {
  width: 280px;
  height: 50px;
}
</style>
