<script>
import EmployeeForm from "./EmployeeForm.vue";
import EmployeeList from "./EmployeeList.vue";
import { ShowQuestion } from "../../functions/CatchError";
import EmployeeHomeFooter from "./EmployeeHomeFooter.vue";
import { deleteMultiple, filterInfoEntity } from "../../config/FetchData";
import MISAButton from "../../components/MISAButton.vue";
import MISACombobox from "../../components/MISACombobox.vue";
import axios from "axios";
import MISAToast from "../../components/MISAToast.vue";
// import MISACombobox from "../../components/MISACombobox.vue";

export default {
  name: "EmployeeHome",
  components: {
    EmployeeList,
    EmployeeForm,
    EmployeeHomeFooter,
    MISAButton,
    MISACombobox,
    MISAToast,
  },
  data() {
    return {
      checkboxListEmployeeId: [], // Chứa danh sách employeeId để thực hiện xóa
      deleteSingleEmployeeId: [], // Chứa một giá trị duy nhất mã nhân viên muốn xóa
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
      numberValue: 0,
    };
  },
  created() {
    // Nhận tín hiệu từ "EmployeeList.vue" lấy danh Employee được checked
    this.$msemitter.on(
      "handleDeleteEmployeeById",
      this.handleDeleteEmployeeById
    );
    // Lắng nghe từ EmployeeList.vue
    this.$msemitter.on("handleSearch", this.handleSearchEmployee);
    // Nhận tính hiệu xóa một từ EmployeeList.vue
    this.$msemitter.on("deleteSingleEmployeeId", this.deleteOneEmployeeId);
    // Nhận tín hiệu đóng "MISADialogQuestion.vue" xóa employee
    this.$msemitter.on("closeDialogQuestion", this.statusDeleteEmployee);
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeyDown);
    // Nhận từ EmployeeHomeFooter.vue
    this.$msemitter.on("emptyTextSearch", this.handleEmptyTextSearch);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  },
  watch: {},
  methods: {
    /**
     *
     * @param {*} event - Sự kiện mặc định
     * - Thực hiện xử lí khi nhấn phím
     * - Author: (8/5/2023)
     */
    handleKeyDown(event) {
      if (event.ctrlKey && event.key === this.$ShortCutResource.BtnAdd.char) {
        event.preventDefault(); // Ngăn chặn hành động mặc định của trình duyệt
        this.handleShortcut();
      }
    },

    /**
     * - Xử lí phím tắt
     * - Author: DDKhang (8/5/2023)
     */
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
    async statusDeleteEmployee(infoDelete) {
      // - status: Trạng thái có hoặc không xóa
      // - deleteType: Kiểu muốn xóa (một, nhiều)
      const { status, deleteType } = infoDelete;

      switch (deleteType) {
        case this.$DeleteType.deleteMany:
          const listEntityId = this.checkboxListEmployeeId.toString();
          if (status) {
            // Thực hiện xóa những employee đã chọn, khi bấm "Có" trên dialog
            const numberDeleted = await deleteMultiple(
              this.$EntityEnum.Employees,
              listEntityId
            );
            // Cập nhật lại danh sách employee sẽ xóa => ẩn nút "Delete"
            this.checkboxListEmployeeId = [];

            if (
              numberDeleted.status === this.$MISAEnum.HttpStatusCode.NoContent
            ) {
              this.handleRefreshBtn();
              // Thực hiện thông báo
              // 1. Thông tin thông báo
              const toastInfo = {
                status:
                  this.$MISAResource.Toast.DeleteEntity.DeleteSuccess.status,
                msg: this.$MISAResource.Toast.DeleteEntity.DeleteSuccess.msg,
              };
              // 2. Phát lên App.vue -> để hiển thị Toast
              this.$msemitter.emit("showToast", toastInfo);
            }
          }
          break;
        case this.$DeleteType.deleteOne:
          if (status) {
            // Thực hiện xóa employeeId trong danh sách xóa nhiều
            const checkboxListEmployeeIdNew =
              this.checkboxListEmployeeId.filter(
                (employeeId) => employeeId !== this.deleteSingleEmployeeId[0]
              );
            this.checkboxListEmployeeId = checkboxListEmployeeIdNew;

            // const listEntityId = this.checkboxListEmployeeId.toString();
            const listEntityId = this.deleteSingleEmployeeId.toString();
            const numberDeleted = await deleteMultiple(
              this.$EntityEnum.Employees,
              listEntityId
            );
            this.handleRefreshBtn();
            if (
              numberDeleted.status === this.$MISAEnum.HttpStatusCode.NoContent
            ) {
              // Cập nhật lại danh sách employee sẽ xóa => ẩn nút "Delete"
              this.checkboxListEmployeeId = [];

              // Thực hiện thông báo
              // 1. Thông tin thông báo
              const toastInfo = {
                status:
                  this.$MISAResource.Toast.DeleteEntity.DeleteSuccess.status,
                msg: this.$MISAResource.Toast.DeleteEntity.DeleteSuccess.msg,
              };
              // 2. Phát lên App.vue -> để hiển thị Toast
              this.$msemitter.emit("showToast", toastInfo);
            }
          }
          break;
        default:
          break;
      }
      this.isAgreeDeleteEmployee = status;
    },

    /**
     * Params: null
     * Des:  Thực hiện xóa nhiều employee được chọn
     * Author: DDKhang
     * CreateAt: 30/4/2023
     * ModifierAt: 30/4/2023
     */
    handleDeleteEmployees() {
      // Phát đến MISADialogQuestion.vue
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
      this.$msemitter.emit("refresh"); // EmployeeList.vue
      this.textSearch = "";
    },

    handleEmptyTextSearch() {
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
     * - Thực hiện lưu trữ một mã nhân viên muốn xóa
     * @param { singleEmployeeId } - Mảng chưa một mã nhân viên
     */
    deleteOneEmployeeId(singleEmployeeId) {
      this.deleteSingleEmployeeId = [...singleEmployeeId];
    },

    /**
     * Params: null
     * Des:  Thực hiện tìm kiếm employe theo "tên || mã nhân viên"
     * Author: DDKhang
     * CreateAt: 30/4/2023
     * ModifierAt: 30/4/2023
     */
    async handleSearchEmployee(event) {
      event?.preventDefault();

      let { page, limit, search } = this.$route.query;
      if (!limit) limit = 20;
      /**
       * - Nếu ban đầu next page trước khi search thì khi này giá trị page sẽ được cập nhật
       * - Để khi search cho thể lấy được giá trị thì cần bắt đầu từ trang 1
       */
      page = 1;

      // Lấy giá trị hiện tại của URL
      const currentParams = this.$route.query;
      // Thêm tham số tìm kiếm mới vào đối tượng params
      // const newParams = { search: this.textSearch || search };
      const newParams = { search: this.textSearch || search };
      // Sử dụng $router.push để điều hướng và cập nhật URL với tham số tìm kiếm mới
      this.$router.push({ query: newParams });

      // if (this.textSearch.trim() === "" && search === "") {
      if (this.textSearch.trim() === "") {
        this.$msemitter.emit("refresh");
      } else {
        const entityFilter = {
          pageSize: null,
          pageNumber: null,
          valueFilter: this.textSearch || search,
        };
        const res = await filterInfoEntity(
          this.$EntityEnum.Employees,
          entityFilter
        );
        // Phát đến EmployeeList.vue & EmployeeHomeFooter.vue
        this.$msemitter.emit("listEmployeeSearch", res.data.Data);
        this.textSearch = "";
      }
    },

    /**
     * - Hiển thị toast
     * - Author: DDKhang (6/6/2023)
     */
    showToast() {
      let number = this.numberValue++;
      this.$refs.toast.showToast("Hello, this is a toast!" + number, 5000);
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

    <!-- Nút thêm mới nhân viên -->
    <MISAButton
      id="btn-add-employee"
      class="main__top-add-employee btn__primary btn-hover btn-pressed"
      @click="handleClickShowFormEmployee"
      :title="this.$ShortCutResource.BtnAdd.tooltip"
    >
      <div class="content">
        <div class="icon">
          <i class="fal fa-plus" style="color: #ffffff; font-size: 20px"></i>
        </div>
        <div class="text">
          {{ this.$MISAResource.EmployeeHome.button.btnAddNewEmployee }}
        </div>
      </div>
    </MISAButton>

    <!-- FORM ADD EMPLOYEE -->
    <!-- <EmployeeForm /> -->
    <router-view name="EmployeeRouterView"></router-view>
  </div>
  <!-- Main top -- End -->

  <div class="main__table">
    <div class="main__table-handleOnTable">
      <div class="main__table-qualityRecordChoose">
        <div
          class="showQualityRecordChoose"
          v-if="this.checkboxListEmployeeId.length > 0"
        >
          {{ this.$MISAResource.EmployeeHome.qualityRecordText }}
          <span class="numberRecorderChoose">{{
            this.checkboxListEmployeeId.length
          }}</span>
        </div>

        <!-- Nút xóa những bản ghi đã được chọn -->
        <!-- <MISAButton
          id="btn-add-employee"
          class="main__top-add-employee btn__delete btn-delete-hover"
          @click="handleDeleteEmployees"
          v-if="this.checkboxListEmployeeId.length > 0"
        >
          {{ this.$MISAResource.EmployeeHome.button.btnDeleteCheckedEmployee }}
        </MISAButton> -->

        <div
          class="delete-all"
          @click="handleDeleteEmployees"
          v-if="this.checkboxListEmployeeId.length > 0"
        >
          Xóa tất cả
        </div>
      </div>

      <div class="main__table-handleOnTable-base">
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
                :title="
                  this.$MISAResource.EmployeeHome.button.btnSearch.tooltip
                "
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

        <div
          class="icon-exportExcel"
          @click="handleExportExcelBtn"
          :title="this.$MISAResource.EmployeeHome.button.btnExportExcel.tooltip"
        >
          <div class="main__table-handleOnTable-exportExcel"></div>
        </div>
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
