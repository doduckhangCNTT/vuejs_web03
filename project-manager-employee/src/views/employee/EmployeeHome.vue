<script>
import EmployeeForm from "./EmployeeForm.vue";
import EmployeeList from "./EmployeeList.vue";
import { showCombobox } from "../../functions/Combobox";

export default {
  name: "EmployeeHome",
  components: { EmployeeList, EmployeeForm },
  data() {
    return {
      checkboxListEmployeeId: [],
      textSearch: "",
    };
  },
  created() {
    this.$msemitter.on(
      "handleDeleteEmployeeById",
      this.handleDeleteEmployeeById
    );
  },
  methods: {
    /**
     * Params: null
     * Des: Xử lí bật form info employee
     * Author: DDKhang
     * CreateAt: 30/4/2023
     * ModifierAt: 30/4/2023
     */
    handleClickShowFormEmployee() {
      this.$router.push("/employee/create");
    },
    /**
     * Params: null
     * Des:  Thực hiện refresh data
     * Author: DDKhang
     * CreateAt: 30/4/2023
     * ModifierAt: 30/4/2023
     */
    handleRefreshBtn() {
      this.$msemitter.emit("refresh");
    },

    handleDeleteEmployeeById(checkboxEmployeesId) {
      console.log("Hello");
      console.log("Checkbox List: ", checkboxEmployeesId);
      this.checkboxListEmployeeId = [...checkboxEmployeesId];
    },

    /**
     * Params: null
     * Des:  Thực hiện xóa nhiều employee được chọn
     * Author: DDKhang
     * CreateAt: 30/4/2023
     * ModifierAt: 30/4/2023
     */
    async handleDeleteEmployees() {
      if (window.confirm("Bạn có muốn xóa các nhân viên đó?")) {
        this.checkboxListEmployeeId.forEach(async (id) => {
          await this.$axios
            .delete(`https://cukcuk.manhnv.net/api/v1/Employees/${id}`)
            .then((res) => {
              console.log("Data Delete: ", res);
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }
    },

    /**
     * Params: null
     * Des: Xử lí hiển thị combobox trên trang chủ
     * Author: DDKhang
     * CreateAt: 30/4/2023
     * ModifierAt: 30/4/2023
     */
    handlePressCombobox() {
      showCombobox();
    },

    /**
     * Params: null
     * Des:  Thực hiện tìm kiếm employe theo "tên || mã nhân viên"
     * Author: DDKhang
     * CreateAt: 30/4/2023
     * ModifierAt: 30/4/2023
     */
    async handelSearchEmployee(event) {
      event.preventDefault();
      await this.$axios
        .get(
          `https://cukcuk.manhnv.net/api/v1/Employees/filter?employeeFilter=${this.textSearch}`
        )
        .then((res) => {
          this.$msemitter.emit("listEmployeeSearch", res.data.Data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<template>
  <!-- Main top -- Start  -->
  <div class="main__top">
    <div class="main__top-subject">Nhân viên</div>
    <button
      @click="handleClickShowFormEmployee"
      id="btn-add-employee"
      class="main__top-add-employee btn__primary btn-hover btn-pressed"
    >
      Thêm mới nhân viên
    </button>

    <!-- FORM ADD EMPLOYEE -->
    <!-- <EmployeeForm /> -->
    <router-view name="EmployeeRouterView"></router-view>

    <!-- DIALOG -->
    <div id="dialog" class="dialog hidden dialog-close">
      <div class="dialog-warning">
        <div class="dialog-warning__notification">
          <div class="dialog-warning__icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="dialog-warning__content">
            Mỗi dialog nên thể hiện cho 1 hành động duy nhất, với 1 chuỗi các
            hành động, nên xem xét việc dùng Popup với các bước riêng biệt.
          </div>
        </div>
        <div class="dialog-warning__notification--footer">
          <button
            id="btn-agree"
            class="dialog-btn--close dialog__button-ok btn__primary btn-hover btn-pressed"
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Main top -- End -->

  <div class="main__table">
    <div class="main__table-handleOnTable">
      <button
        id="btn-add-employee"
        class="main__top-add-employee btn__delete btn-delete-hover"
        @click="handleDeleteEmployees"
        v-if="this.checkboxListEmployeeId.length > 0"
      >
        Delete
      </button>
      <!-- Search & Refresh - Start -->
      <form
        @submit.prevent="handelSearchEmployee"
        class="main__table-handleOnTable-search"
      >
        <div class="textfield-outline">
          <div class="textfield-validate input-hover">
            <input
              class="textfield-validate__placeholder input-hover"
              type="text"
              placeholder="Tìm theo mã, tên nhân viên"
              v-model="this.textSearch"
            />
            <button type="submit" class="textfield-validate__icon">
              <div class="textfield-validate__icon-search"></div>
            </button>
          </div>
        </div>
      </form>
      <div class="icon-refresh" @click="handleRefreshBtn">
        <div class="main__table-handleOnTable-refresh"></div>
      </div>
    </div>
    <!-- Search & Refresh - End -->

    <!-- Table -->
    <EmployeeList />
  </div>

  <!-- Footer - Start -->
  <div class="main__footer">
    <div class="main__footer-total-records">Tổng số: 1035 bản ghi</div>
    <div class="main__footer-paging">
      <div class="main__footer-paging-total-record-on-page">
        <p class="number-records-text">Số bản ghi/trang:</p>
        <!-- Combobox -->
        <div class="dropdown width-76" @click="handlePressCombobox">
          <div class="combobox-input">
            <input type="text" placeholder="20" />
            <div class="combobox-input__icon border-left-none">
              <div class="icon-combobox--arrow"></div>
            </div>
          </div>
          <ul class="options combobox-options--above">
            <li class="option">10</li>
            <li class="option">25</li>
            <li class="option">30</li>
            <li class="option">50</li>
          </ul>
        </div>
        <span class="main__footer-quality-record">1-4 bản ghi </span>
      </div>
      <div class="main__footer-paging-number">
        <span class="main__footer-paging-previous"></span>
        <!-- <ul class="main__footer-paging-number-item">
                  <li>1</li>
                  <li>2</li>
                  <li>3</li>
                  <li>...</li>
                  <li>8</li>
                  <li>9</li>
                </ul> -->
        <span class="main__footer-paging-next"></span>
      </div>
    </div>
  </div>
  <!-- Footer - Start -->
</template>

<style lang="scss" scoped></style>
