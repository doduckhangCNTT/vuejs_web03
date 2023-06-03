<script>
import TheHeader from "./layouts/TheHeader.vue";
import TheMain from "./layouts/TheMain.vue";
import TheNavbar from "./layouts/TheNavbar.vue";
import MISADialogNotification from "./components/MISADialogNotification.vue";
import MISADialogQuestion from "./components/MISADialogQuestion.vue";

export default {
  name: "App",
  components: {
    TheHeader,
    TheMain,
    TheNavbar,
    MISADialogNotification,
    MISADialogQuestion,
  },
  props: [],
  created() {
    this.$msemitter.on("showNotice", this.showNotice);
    this.$msemitter.on("showQuestion", this.showQuestion);
    this.$msemitter.on("closeDialogNotice", this.closeDialogNotice);
    this.$msemitter.on("closeDialogQuestion", this.closeDialogQuestion);
  },
  beforeUnmount() {
    this.$msemitter.off("showNotice");
    this.$msemitter.off("showQuestion");
  },
  data() {
    return {
      isShowNotice: false,
      isShowQuestion: false,
      errors: [],
      warnings: [],
    };
  },
  methods: {
    /**
     *
     * @param {*} errors - Thông tin lỗi
     * - Des: Thực hiện hiển thị dialog nhận xét
     * - Author: DDKhang (2/6/2023)
     */
    showNotice(errors) {
      this.isShowNotice = true;
      this.errors = errors;
    },

    /**
     *
     * @param {*} warnings - Thông tin cảnh báo
     * - Des: Thực hiện hiển thị thông tin cảnh báo lên dialog
     * - Author: DDKhang (2/6/2023)
     */
    showQuestion(warnings) {
      this.isShowQuestion = true;
      this.warnings = warnings;
    },

    /**
     * - Đóng dialog nhận xét
     * - Author: DDKhang (2/6/2023)
     */
    closeDialogNotice() {
      this.isShowNotice = false;
    },

    /**
     * - Đóng dialog câu hỏi
     * - Author: DDKhang (2/6/2023)
     */
    closeDialogQuestion() {
      this.isShowQuestion = false;
    },
  },
};
</script>

<template>
  <div class="list-employee">
    <TheNavbar />
    <div class="container">
      <TheHeader />
      <TheMain />
    </div>
  </div>
  <MISADialogNotification
    v-if="isShowNotice"
    :errors="errors"
  ></MISADialogNotification>

  <MISADialogQuestion
    v-show="isShowQuestion"
    :warnings="warnings"
  ></MISADialogQuestion>
</template>

<style scoped></style>
