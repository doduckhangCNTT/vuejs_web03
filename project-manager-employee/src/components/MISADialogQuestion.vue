<script>
export default {
  name: "MISADialogQuestion",
  props: ["warnings"],
  data() {
    return {};
  },
  methods: {
    statusDeleteEmployee(status) {
      this.$msemitter.emit("closeDialogQuestion", status);
    },
  },
};
</script>

<template>
  <div class="dialog">
    <div class="dialog-question min-width-dialog">
      <div class="dialog-question__header">
        <div class="dialog-question__header-title">
          {{ this.$MISAResource.ButtonText.dialogQuestion.title }}
        </div>
        <div
          class="dialog-question__header-close"
          @click="statusDeleteEmployee(false)"
        >
          <i class="fa-solid fa-xmark"></i>
        </div>
      </div>
      <div class="dialog-question__des">
        {{ this.$MISAResource.textCRUD.textDeleteEmployee }}
      </div>
      <div class="dialog-question__button">
        <button
          class="dialog-question__button-cancel"
          @click="statusDeleteEmployee(false)"
        >
          {{ this.$MISAResource.ButtonText.dialogQuestion.btnCancel }}
        </button>
        <button
          class="dialog-question__button-ok dialog-question__button-delete btn-color-delete"
          @click="statusDeleteEmployee(true)"
        >
          {{ this.$MISAResource.ButtonText.dialogQuestion.btnAgree }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
