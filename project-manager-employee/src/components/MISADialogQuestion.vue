<script>
export default {
  name: "MISADialogQuestion",
  props: ["warnings"],
  data() {
    return { deleteType: "" };
  },
  created() {
    this.$msemitter.on("deleteType", this.handleDeleteType);
  },
  methods: {
    statusDeleteEmployee(status) {
      const infoDelete = {
        deleteType: this.deleteType,
        status,
      };
      // Phát sự kiện tới App.js & EmployeeHome.js
      this.$msemitter.emit("closeDialogQuestion", infoDelete);
    },

    handleDeleteType(deleteType) {
      this.deleteType = deleteType;
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
          <!-- <i class="fa-solid fa-xmark"></i> -->
        </div>
      </div>
      <div class="dialog-question__des">
        <!-- {{ this.$MISAResource.textCRUD.textDeleteEmployee }} -->
        <ul>
          <li v-for="warning in warnings">{{ warning }}</li>
        </ul>
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
