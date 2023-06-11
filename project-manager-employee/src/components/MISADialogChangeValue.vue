<script>
export default {
  name: "MISADialogChangeValue",
  props: ["warnings"],
  data() {
    // return { deleteType: "" };
    isChangeDialogValue: false;
  },
  created() {
    // Nhận từ EmployeeHome.vue và EmployeeList.vue
    // this.$msemitter.on("deleteType", this.handleDeleteType);
  },
  methods: {
    /**
     *
     * @param {*} status - Cung cấp thông tin muốn xóa (có | không)
     * - Thực hiện phát sự kiện muốn hay không xóa và kiểu muốn xóa
     *  - Author: DDKhang (4/6/2023)
     */
    statusChangeValueForm(data) {
      // const { btnType } = data;
      let status = false;
      switch (data) {
        case this.$DialogTypeEnum.ChangeValue.btnSaveChange:
          status = true;
          break;
        case this.$DialogTypeEnum.ChangeValue.btnNotSaveChange:
          status = true;
          break;
      }
      const infoChange = {
        btnType: data,
        status,
      };

      console.log("1");
      // Phát sự kiện tới App.js & EmployeeForm.js
      this.$msemitter.emit("closeDialogQuestionChangeValue", infoChange);
    },
  },
  beforeDestroy() {
    this.$msemitter.off(
      "closeDialogQuestionChangeValue",
      this.statusChangeValueForm
    );
  },
};
</script>

<template>
  <div class="dialog">
    <div class="dialog-question min-width-dialog">
      <div class="dialog-question__header">
        <div class="dialog-question__header-title">
          {{ this.$MISAResource.ButtonText.dialogQuestionChangeValue.title }}
        </div>
        <div
          class="dialog-question__header-close"
          @click="statusChangeValueForm(false)"
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
          @click="
            statusChangeValueForm(
              this.$DialogTypeEnum.ChangeValue.btnNotSaveChange
            )
          "
        >
          {{ this.$MISAResource.ButtonText.dialogQuestionChangeValue.btnClose }}
        </button>
        <button
          class="dialog-question__button-cancel"
          @click="
            statusChangeValueForm(
              this.$DialogTypeEnum.ChangeValue.btnNotSaveChange
            )
          "
        >
          {{
            this.$MISAResource.ButtonText.dialogQuestionChangeValue.btnNotSave
          }}
        </button>
        <button
          class="dialog-question__button-ok"
          @click="
            statusChangeValueForm(
              this.$DialogTypeEnum.ChangeValue.btnSaveChange
            )
          "
        >
          {{ this.$MISAResource.ButtonText.dialogQuestionChangeValue.btnSave }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog-question__button {
  display: flex;
  column-gap: 8px;
}

.dialog-question__button-ok {
  margin-left: 0;
  cursor: pointer;
}
</style>
