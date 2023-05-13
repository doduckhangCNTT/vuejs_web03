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
    showNotice(errors) {
      this.isShowNotice = true;
      this.errors = errors;
    },

    showQuestion(warnings) {
      this.isShowQuestion = true;
      this.warnings = warnings;
    },

    closeDialogNotice() {
      this.isShowNotice = false;
    },
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
    v-if="isShowQuestion"
    :warnings="warnings"
  ></MISADialogQuestion>
</template>

<style scoped></style>
