<script>
export default {
  name: "MISADialogNotification",
  props: ["errors"],
  data() {
    return {};
  },
  methods: {
    btnAgree() {
      // Phát đến EmployeeForm.vue
      this.$msemitter.emit("closeDialogNotice");
    },
  },
};
</script>

<template>
  <!-- <div id="dialog" class="dialog dialog-close">
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
  </div> -->
  <div class="dialog">
    <div class="dialog-question min-width-dialog">
      <div class="dialog-question__header">
        <div class="dialog-question__header-title">
          {{ this.$MISAResource.ButtonText.dialogNotice.title }}
        </div>
      </div>
      <div class="dialog-question__des">
        <div class="dialog-icon"></div>
        <ul>
          <li v-for="error in this.errors">{{ error }}</li>
        </ul>
      </div>
      <div class="dialog-question__button">
        <!-- <button
          class="dialog-question__button-cancel"
          @click="statusDeleteEmployee(false)"
        >
          {{ this.$MISAResource.ButtonText.dialogNotice.btnCancel }}
        </button> -->
        <button
          class="dialog-question__button-ok dialog-question__button-delete btn-color-delete"
          @click="btnAgree"
        >
          {{ this.$MISAResource.ButtonText.dialogNotice.btnAgree }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog-question__des {
  display: flex;
  align-items: flex-start;
  column-gap: 10px;
}

.dialog-question__button-ok {
  background-color: #50b83c;
}

.dialog-icon {
  background: url("../assets/ResourceTable/img/Sprites.64af8f61.svg") no-repeat -593px -145px;
  width: 22px;
  height: 23px;
}
</style>
