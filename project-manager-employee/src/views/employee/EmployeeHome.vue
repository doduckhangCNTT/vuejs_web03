<script>
import EmployeeForm from "./EmployeeForm.vue";
import EmployeeList from "./EmployeeList.vue";
import { ShowQuestion } from "../../functions/CatchError";
import EmployeeHomeFooter from "./EmployeeHomeFooter.vue";

export default {
  name: "EmployeeHome",
  components: { EmployeeList, EmployeeForm, EmployeeHomeFooter },
  data() {
    return {
      checkboxListEmployeeId: [],
      textSearch: "",
      isAgreeDeleteEmployee: false,
    };
  },
  created() {
    this.$msemitter.on(
      "handleDeleteEmployeeById",
      this.handleDeleteEmployeeById
    );
    // Nhận tín hiệu đóng dialog question xóa employee
    this.$msemitter.on("closeDialogQuestion", this.statusDeleteEmployee);
  },
  methods: {
    /**
     * Params:
     *  + status: trạng thái "Có" or "Không" xóa các employee được chọn
     * Des: Xử lí xóa các các employee được chọn
     * Author: DDKhang
     * CreateAt: 8/5/2023
     * ModifierAt: 8/5/2023
     */
    statusDeleteEmployee(status) {
      if (status) {
        // Thực hiện xóa những employee đã chọn, khi bấm "Có" trên dialog
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
        // Cập nhật lại danh sách employee sẽ xóa => ẩn nút "Delete"
        this.checkboxListEmployeeId = [];
      }
      this.isAgreeDeleteEmployee = status;
    },

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
      this.$msemitter.emit("refresh"); // EmployeeList
      this.textSearch = "";
    },

    /**
     * Params:
     *  + checkboxEmployeesId: danh sách Id của những employee được check
     * Des:  Thực hiện Lưu trữ danh sách Id của employee
     * Author: DDKhang
     * CreateAt: 30/4/2023
     * ModifierAt: 30/4/2023
     */
    handleDeleteEmployeeById(checkboxEmployeesId) {
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
      ShowQuestion(this.$MISAResource.Delete.deleteInfo);
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
  <EmployeeHomeFooter />
  <!-- Footer - End -->
</template>

<style lang="scss" scoped></style>
