<script>
import EmployeeForm from "./EmployeeForm.vue";
import EmployeeList from "./EmployeeList.vue";
import { ShowQuestion } from "../../functions/CatchError";
import EmployeeHomeFooter from "./EmployeeHomeFooter.vue";
import BaseUrl from "../../config/BaseUrl";
import { deleteMultiple, filterInfoEntity } from "../../config/FetchData";
import MISAButton from "../../components/MISAButton.vue";
import MISACombobox from "../../components/MISACombobox.vue";
import axios from "axios";
// import MISACombobox from "../../components/MISACombobox.vue";

export default {
  name: "EmployeeHome",
  components: {
    EmployeeList,
    EmployeeForm,
    EmployeeHomeFooter,
    MISAButton,
    MISACombobox,
  },
  data() {
    return {
      checkboxListEmployeeId: [],
      textSearch: "",
      isAgreeDeleteEmployee: false,
      options: [
        {
          value: "HTML",
          label: "HTML",
        },
        {
          value: "CSS",
          label: "CSS",
        },
        {
          value: "JavaScript",
          label: "JavaScript",
        },
      ],
    };
  },
  created() {
    // Nhận tín hiệu từ "EmployeeList.vue" lấy danh Employee được checked
    this.$msemitter.on(
      "handleDeleteEmployeeById",
      this.handleDeleteEmployeeById
    );
    // Nhận tín hiệu đóng "MISADialogQuestion.vue" xóa employee
    this.$msemitter.on("closeDialogQuestion", this.statusDeleteEmployee);
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeyDown);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  },
  methods: {
    handleKeyDown(event) {
      if (event.ctrlKey && event.key === this.$ShortCutResource.BtnAdd.char) {
        event.preventDefault(); // Ngăn chặn hành động mặc định của trình duyệt
        this.handleShortcut();
      }
    },

    handleShortcut() {
      this.$router.push("/employee/create");
      // Thêm mã lệnh bạn muốn thực hiện khi nhấn phím tắt Ctrl + S trên nút ở đây
    },
    /**
     * Params:
     *  + status: trạng thái "Có" or "Không" xóa các employee được chọn
     * Des: Xử lí xóa các các employee được chọn
     * Author: DDKhang
     * CreateAt: 8/5/2023
     * ModifierAt: 8/5/2023
     */
    statusDeleteEmployee(infoDelete) {
      const { status, deleteType } = infoDelete;

      switch (deleteType) {
        case this.$DeleteType.deleteMany:
          const listEntityId = this.checkboxListEmployeeId.toString();
          if (status) {
            // Thực hiện xóa những employee đã chọn, khi bấm "Có" trên dialog
            deleteMultiple(this.$EntityEnum.Employees, listEntityId);

            // this.checkboxListEmployeeId.forEach(async (id) => {
            //   this.$axios
            //     .delete(`${BaseUrl}/Employees/delete?employeeId=${id}`)
            //     .then((res) => {
            //       console.log("Data Delete: ", res);
            //     })
            //     .catch((err) => {
            //       console.log(err);
            //     });
            // });
            // Cập nhật lại danh sách employee sẽ xóa => ẩn nút "Delete"
            this.checkboxListEmployeeId = [];
          }
          break;
        case this.$DeleteType.deleteOne:
          if (status) {
            const listEntityId = this.checkboxListEmployeeId.toString();
            deleteMultiple(this.$EntityEnum.Employees, listEntityId);

            //   this.checkboxListEmployeeId.forEach(async (id) => {
            //     this.$axios
            //       .delete(`${BaseUrl}/Employees/${id}`)
            //       .then((res) => {
            //         console.log("Data Delete: ", res);
            //       })
            //       .catch((err) => {
            //         console.log(err);
            //       });
            //   });
          }
          // Cập nhật lại danh sách employee sẽ xóa => ẩn nút "Delete"
          this.checkboxListEmployeeId = [];
          break;
        default:
          break;
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
     * Params: null
     * Des: Thực hiện xuất khẩu dữ liệu
     * Author: DDKhang
     * CreateAt: 30/4/2023
     * ModifierAt: 30/4/2023
     */
    handleExportExcelBtn() {
      axios({
        method: "get",
        url: "https://localhost:44338/api/v1/Employees/export",
        responseType: "blob", // Important: Set the response type to 'blob'
      })
        .then((response) => {
          // Create a temporary download link
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "export.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error) => {
          console.error("Export failed:", error);
        });
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
      this.$msemitter.emit("deleteType", this.$DeleteType.deleteMany);
      // Thực hiện thông báo xóa theo tương ứng theo số lượng bản ghi
      let contentInfoDelete = "";
      if (this.checkboxListEmployeeId.length > 1) {
        // Thông báo khi có nhiều bản ghi
        contentInfoDelete = this.$MISAResource.Delete.deleteManyInfo;
      } else {
        // Thông báo khi chỉ xóa 1 bản ghi
        contentInfoDelete = this.$MISAResource.Delete.deleteOneInfo;
      }
      // Thực hiện hiển thị dialog thông báo
      ShowQuestion(contentInfoDelete);
    },

    /**
     * Params: null
     * Des:  Thực hiện tìm kiếm employe theo "tên || mã nhân viên"
     * Author: DDKhang
     * CreateAt: 30/4/2023
     * ModifierAt: 30/4/2023
     */
    async handleSearchEmployee(event) {
      event.preventDefault();
      if (this.textSearch.trim() === "") {
        this.$msemitter.emit("refresh");
      } else {
        const entityFilter = {
          valueFilter: this.textSearch,
        };
        const res = await filterInfoEntity(
          this.$EntityEnum.Employees,
          entityFilter
        );
        this.$msemitter.emit("listEmployeeSearch", res.data.Data);
      }

      // this.$axios
      //   .get(`${BaseUrl}/Employees/filter?entityFilter=${this.textSearch}`)
      //   .then((res) => {
      //     this.$msemitter.emit("listEmployeeSearch", res.data.Data);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    },
  },
};
</script>

<template>
  <!-- Main top -- Start  -->
  <div class="main__top">
    <div class="main__top-subject">
      {{ this.$MISAResource.EmployeeHome.title.tableName }}
    </div>

    <el-select
      v-model="value"
      multiple
      filterable
      allow-create
      default-first-option
      :reserve-keyword="false"
      placeholder="Choose tags for your article"
    >
      <el-option
        v-for="item in this.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <MISAButton
      id="btn-add-employee"
      class="main__top-add-employee btn__primary btn-hover btn-pressed"
      @click="handleClickShowFormEmployee"
      :title="this.$ShortCutResource.BtnAdd.tooltip"
    >
      {{ this.$MISAResource.EmployeeHome.button.btnAddNewEmployee }}
    </MISAButton>

    <!-- <button
      @click="handleClickShowFormEmployee"
      id="btn-add-employee"
      class="main__top-add-employee btn__primary btn-hover btn-pressed"
      title="Ctrl + a"
    >
      {{ this.$MISAResource.EmployeeHome.button.btnAddNewEmployee }}
    </button> -->

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
      <MISAButton
        id="btn-add-employee"
        class="main__top-add-employee btn__delete btn-delete-hover"
        @click="handleDeleteEmployees"
        v-if="this.checkboxListEmployeeId.length > 0"
      >
        {{ this.$MISAResource.EmployeeHome.button.btnDeleteCheckedEmployee }}
      </MISAButton>
      <!-- <button
        id="btn-add-employee"
        class="main__top-add-employee btn__delete btn-delete-hover"
        @click="handleDeleteEmployees"
        v-if="this.checkboxListEmployeeId.length > 0"
      >
        {{ this.$MISAResource.EmployeeHome.button.btnDeleteCheckedEmployee }}
      </button> -->

      <!-- Search & Refresh - Start -->
      <form
        @submit.prevent="handleSearchEmployee"
        class="main__table-handleOnTable-search"
      >
        <div class="textfield-outline">
          <div class="textfield-validate input-hover">
            <input
              class="textfield-validate__placeholder input-hover"
              type="text"
              :placeholder="
                this.$MISAResource.EmployeeHome.input.searchPlaceholder
              "
              v-model="this.textSearch"
            />
            <button
              type="submit"
              class="textfield-validate__icon"
              :title="this.$MISAResource.EmployeeHome.button.btnSearch.tooltip"
            >
              <div class="textfield-validate__icon-search"></div>
            </button>
          </div>
        </div>
      </form>
      <div
        class="icon-refresh"
        @click="handleRefreshBtn"
        :title="this.$MISAResource.EmployeeHome.button.btnRefresh.tooltip"
      >
        <div class="main__table-handleOnTable-refresh"></div>
      </div>
      <!-- <input ref="fileInput" type="file" style="display: none" @change="exportToExcel" /> -->
      <div
        class="icon-exportExcel"
        @click="handleExportExcelBtn"
        :title="this.$MISAResource.EmployeeHome.button.btnExportExcel.tooltip"
      >
        <div class="main__table-handleOnTable-exportExcel"></div>
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
