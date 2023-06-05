<script>
export default {
  data() {
    return {
      toasts: [],
    };
  },
  computed: {},
  methods: {
    /**
     *
     * @param {*} toastInfo - Thông tin toast {status: trạng thái toast, msg: Nội dụng toast}
     * @param {*} duration - Thời gian hiển thị toast
     * - Des: Thực hiện hiển thị toast
     * - Author: DDKhang (5/6/2023)
     */
    showToast(toastInfo, duration) {
      // Thêm thông tin toast
      const toast = { ...toastInfo };
      this.toasts.push(toast);
      // Thực hiện đóng toast khi hết thời gian
      setTimeout(() => {
        this.closeToast(this.toasts.indexOf(toast));
      }, duration || 5000);
    },

    /**
     *
     * @param {*} index - Số thứ tự của toast trong mảng toasts
     * - Des: Thực hiện đóng toast khi hết thời gian
     * - Author: DDKhang (5/6/2023)
     */
    closeToast(index) {
      this.toasts.splice(index, 1);
    },

    /**
     *
     * @param {*} status - Chứa trạng thái của toast
     * - Des: Thực hiện hiển thì trạng thái lên toast
     * - Author: DDKhang (5/6/2023)
     */
    iconStatus(status) {
      switch (status) {
        case this.$MISAEnum.HttpStatusCode.Success:
          return {
            icon: "<div class='icon-success'></div>",
            textSuccess: "Thành công!",
          };
        case this.$MISAEnum.HttpStatusCode.ServerError:
          return "<div class='icon-error'></div>";
      }
    },
  },
};
</script>

<template>
  <div class="toast-example toast--top-right">
    <div v-for="(toast, index) in toasts" :key="index" class="toast">
      <div class="toast-content">
        <div class="" v-html="this.iconStatus(toast.status).icon"></div>
        <div class="toast-content">
          <span
            class="icon"
            v-html="this.iconStatus(toast.status).textSuccess"
          ></span>
          <span>{{ toast.msg }}</span>
        </div>
      </div>
      <button class="toast-close" @click="closeToast(index)"></button>
    </div>
  </div>
</template>

<style>
.toast-example {
  position: absolute;
  z-index: 100;
}

.toast--top-right {
  top: 0;
  right: 0;
}

.icon-success {
  background: url("../assets/ResourceTable/img/Sprites.64af8f61.svg") no-repeat -1602px -258px;
  width: 20px;
  height: 20px;
}

.toast {
  background-color: #fff;
  padding: 10px;
  height: 56px;
  display: flex;
  width: 450px;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  margin: 8px;
  box-shadow: 4px 5px 25px rgba(124, 130, 141, 0.2);
}

.toast-content {
  display: flex;
  align-items: center;
  column-gap: 8px;
}

.toast-content .icon {
  color: #50b83c;
  font-weight: 600;
}

.toast-close {
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.toast-close {
  background: url("../assets/ResourceTable/img/Sprites.64af8f61.svg") no-repeat -1178px -362px;
  width: 12px;
  height: 12px;
}
</style>
