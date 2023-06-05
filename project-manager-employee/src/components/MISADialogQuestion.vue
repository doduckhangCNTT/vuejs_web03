<script>
export default {
  name: "MISADialogQuestion",
  props: ["warnings"],
  data() {
    return { deleteType: "" };
  },
  created() {
    // Nhận từ EmployeeHome.vue và EmployeeList.vue
    this.$msemitter.on("deleteType", this.handleDeleteType);
  },
  methods: {
    /**
     *
     * @param {*} status - Cung cấp thông tin muốn xóa (có | không)
     * - Thực hiện phát sự kiện muốn hay không xóa và kiểu muốn xóa
     *  - Author: DDKhang (4/6/2023)
     */
    statusDeleteEmployee(status) {
      const infoDelete = {
        deleteType: this.deleteType,
        status,
      };
      // Phát sự kiện tới App.js & EmployeeHome.js
      this.$msemitter.emit("closeDialogQuestion", infoDelete);
    },

    /**
     *
     * @param {*} deleteType - Cập nhật kiểu xóa (một || nhiều)
     * - Author: DDKhang (4/6/2023)
     */
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
