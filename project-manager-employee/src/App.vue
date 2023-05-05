<script>
import TheHeader from "./layouts/TheHeader.vue";
import TheMain from "./layouts/TheMain.vue";
import TheNavbar from "./layouts/TheNavbar.vue";
import MISADialogNotification from "./components/MISADialogNotification.vue";

export default {
  name: "App",
  components: {
    TheHeader,
    TheMain,
    TheNavbar,
    MISADialogNotification,
  },
  props: [],
  created() {
    this.$msemitter.on("showNotice", this.showNotice);
    this.$msemitter.on("closeDialogNotice", this.closeDialogNotice);
  },
  beforeUnmount() {
    this.$msemitter.off("showNotice");
  },
  data() {
    return {
      isShowNotice: false,
      errors: [],
    };
  },
  methods: {
    showNotice(errors) {
      this.isShowNotice = true;
      this.errors = errors;
    },

    closeDialogNotice() {
      this.isShowNotice = false;
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
</template>

<style scoped></style>
