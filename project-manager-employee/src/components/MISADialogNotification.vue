<script>
export default {
  name: "MISADialogNotification",
  props: ["errors"],
  data() {
    return {};
  },
  methods: {
    btnAgree() {
      this.$msemitter.emit("closeDialogNotice");
    },
  },
};
</script>

<template>
  <div id="dialog" class="dialog dialog-close">
    <div class="dialog-warning">
      <div class="dialog-warning__notification">
        <div class="dialog-error__icon">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <div class="dialog-warning__content">
          <h1 class="dialog-warning__title">Lỗi</h1>
          <p v-for="(error, index) in errors" :key="index">
            {{ error }}
          </p>
        </div>
      </div>
      <div class="dialog-warning__notification--footer">
        <button
          @click="btnAgree"
          id="btn-agree"
          class="dialog-btn--close dialog__button-ok btn__primary btn-hover btn-pressed"
        >
          Đồng ý
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
