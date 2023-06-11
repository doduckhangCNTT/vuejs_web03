<script>
import { filterInfoEntity, getData, getDataById } from "../../config/FetchData";
import { convertDate } from "../../functions/ConvertDate";
import TheLoading from "../../components/TheLoading.vue";
import { ShowQuestion } from "../../functions/CatchError";
import BaseUrl from "../../config/BaseUrl";

export default {
  name: "EmployeeList",
  components: { TheLoading },

  data() {
    // Cập nhật status ban đầu của các "btn option"
    const showOption = {};

    // Thực hiện lưu trữ trạng thái ban đầu của các "popup btnOption"
    const isShowContentOption = {};
    // Cập nhật trạng thái đóng "btnOption, popup" ban đầu
    this.employees?.forEach((item, index) => {
      showOption[index] = false;
      isShowContentOption[index] = false;
    });
    return {
      employees: [], // Số bản ghi trên trang tương ứng
      showOption,
      isShowContentOption,
      loading: false,
      loadingProgress: 0,
      checkboxEmployeesId: [], // Chứa toàn bộ employeeId được chọn
      deleteSingleEmployeeId: [], // Chỉ chứa một employeeId duy nhất
      isCheckedAll: false,
    };
  },
  async created() {
    // this.loadData();
    // Thực hiện lấy dữ liệu tương ứng với url khi mà refresh trang
    await this.fetchDataByPageAndLimit();
    // Lắng nghe sự kiện được truyền đến
    this.$msemitter.on("refresh", this.reloadData);
    // Lắng nghe tín hiệu từ EmployeeHome.vue
    this.$msemitter.on("listEmployeeSearch", this.handleShowListEmployeeSearch);
  },
  async mounted() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("click", this.handleClosePopup);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("click", this.handleClosePopup);
  },
  watch: {
    "$route.query": {
      async handler() {
        /**
         * - Mục đích là để khi refresh trang nếu trên url có query search thì thực hiện lấy giá trị với query đó
         * - "!this.$route.query.page" việc cho thêm điều kiện này là bởi khi bấm "chọn, next, previous" thì sẽ ko bị "tự động" thực hiện hàm bên trong này
         * - Câu hỏi đặt ra: "Thế không Refesh có giá trị page sao" -> Thì nó vẫn refresh vì "ngay điều kiện bên dưới đã gọi đến hàm fetchDataByPageAndLimit() "
         * - Điều kiện này chỉ thực hiện khi mà trên url chỉ có "duy nhất query search" vd: "http://127.0.0.1:5173/employee?search=test"
         */
        if (this.$route.query.search && !this.$route.query.page) {
          // Phát đến EmployeeHome.vue
          // this.$msemitter.emit("handleSearch");
          // this.fetchDataByPageAndLimit();
        }
        if (this.$route.query.page || this.$route.query.limit) {
          this.fetchDataByPageAndLimit();
        }
      },
      immediate: true, // Kích hoạt watcher ngay khi component được tạo ra
      deep: true, // Theo dõi sâu đối với các thuộc tính con của $route.query
    },
  },
  methods: {
    handleClosePopup() {
      this.employees?.forEach((_, index) => {
        this.isShowContentOption[index] = false;
      });
    },

    /**
     * @param(): null
     * Des: Thực hiện lấy tham số {page, limit} trên url mỗi khi có sự thay đổi => lấy dữ liệu tương ứng
     * Author: DDKhang
     * CreateAt: 30/4/2023
     * ModifierAt: 30/4/2023
     */
    async fetchDataByPageAndLimit() {
      // Lấy query trên url
      let { page, limit, search } = this.$route.query;
      let res;
      this.loading = true;
      // progress bar
      const intervalId = setInterval(() => {
        if (this.loadingProgress < 100) {
          this.loadingProgress += 8;
        } else {
          clearInterval(intervalId);
          this.loading = false;
        }
      }, 20);

      if (page && limit) {
        // Thực hiện kiểm tra khi chọn số lượng bản ghi, mà lấy giá trị page của trang trước đó
        // const response = await getData(`${BaseUrl}/Employees/filter`);
        let entityFilterInitial = {
          pageSize: limit,
          pageNumber: page,
          valueFilter: null,
        };
        if (search) {
          entityFilterInitial = { ...entityFilterInitial, valueFilter: search };
        }
        // Gọi api
        res = await filterInfoEntity(
          this.$EntityEnum.Employees,
          entityFilterInitial
        );
        // 1. Thực hiện tính toán tổng số trang ứng với limit hiện tại
        const totalRecords = res.data.TotalRecord;
        const totalPage = Math.ceil(totalRecords / limit);
        // 2. So sánh page trên url so với giá trị page (ứng với limit mới)
        if (page > totalPage) {
          page = totalPage;
          this.$router.push(`/employee?page=${page}&limit=${limit}`);
        }

        this.employees = res.data.Data;

        try {
          // // Chuỗi truy vấn tìm kiếm
          // let entityFilter = {
          //   pageSize: limit,
          //   pageNumber: page,
          //   valueFilter: null,
          // };
          // if (search) {
          //   entityFilter = { ...entityFilter, valueFilter: search };
          //   res = await filterInfoEntity(
          //     this.$EntityEnum.Employees,
          //     entityFilter
          //   );
          //   this.employees = res.data.Data;
          // }
          this.loadingProgress = 100;

          // const employeesArray = res.data.Data;
          // const result = Promise.all(
          //   employeesArray.map(async (employee) => {
          //     if (employee.BankId && employee.DepartmentId) {
          //       const res = await this.fetchBankInfo(employee.BankId);
          //       const bankInfo = res.data;
          //       const resDepartment = await getDataById(
          //         this.$EntityEnum.Departments,
          //         employee.DepartmentId
          //       );
          //       const departmentInfo = resDepartment.data;
          //       return {
          //         ...employee,
          //         bankInfo,
          //         departmentInfo,
          //       };
          //     } else {
          //       return {
          //         ...employee,
          //         bankInfo: {},
          //         departmentInfo: {},
          //       };
          //     }
          //   })
          // );
          // const resolvedResult = await result;
          // this.employees = resolvedResult;
          this.loading = false;
        } catch (error) {
          this.isLoading = false;
        }
      } else {
        // Thực hiện lấy dữ liệu khi không có query url nào (https//:localhost:3000/employee)
        const page = 1;
        const limit = 20;
        try {
          let employeeFilter = {
            pageSize: limit,
            pageNumber: page,
            valueFilter: null,
          };
          // Kiểm tra có truy vấn search
          if (search) {
            employeeFilter = { ...employeeFilter, valueFilter: search };
          }
          // Gọi api
          res = await filterInfoEntity(
            this.$EntityEnum.Employees,
            employeeFilter
          );
          this.loadingProgress = 100;
          this.employees = res.data.Data;

          // const employeesArray = res.data.Data;
          // const result = Promise.all(
          //   employeesArray.map(async (employee) => {
          //     if (employee.BankId && employee.DepartmentId) {
          //       const res = await this.fetchBankInfo(employee.BankId);
          //       const bankInfo = res.data;
          //       const resDepartment = await getDataById(
          //         this.$EntityEnum.Departments,
          //         employee.DepartmentId
          //       );
          //       const departmentInfo = resDepartment.data;
          //       return {
          //         ...employee,
          //         bankInfo,
          //         departmentInfo,
          //       };
          //     } else {
          //       return {
          //         ...employee,
          //         bankInfo: {},
          //         departmentInfo: {},
          //       };
          //     }
          //   })
          // );
          // const resolvedResult = await result;
          // this.employees = resolvedResult;
          this.loading = false;
        } catch (error) {
          console.log(error);
          this.isLoading = false;
        }
      }

      // Phát thông tin của các bản record -> EmployeeHomeFooter.vue
      this.$msemitter.emit("recordsResInfo", res.data);
    },

    /**
     *
     * @param {*} bankId - Mã ngân hàng
     * - Des: Thực hiện lấy thông tin ngân hàng theo id
     * Author: DDKhang (3/6/2023)
     */
    async fetchBankInfo(bankId) {
      const res = await getDataById(this.$EntityEnum.Banks, bankId);
      return res;
    },

    /**
     * Params: null
     * Des: Xử lí tải lại dữ liệu cho table
     * Author: DDKhang
     * CreateAt: 30/4/2023
     * ModifierAt: 30/4/2023
     */
    reloadData() {
      // this.fetchDataByPageAndLimit();
      this.loadData();
    },
    /**
     * Params: null
     * Des: Xử lí tải dữ liệu employee từ server ("Không sử dụng nữa, thay bằng fetchDataByPageAndLimit()")
     * Author: DDKhang
     * CreateAt: 30/4/2023
     * ModifierAt: 30/4/2023
     */
    async loadData() {
      this.loading = true;
      try {
        const intervalId = setInterval(() => {
          if (this.loadingProgress < 100) {
            this.loadingProgress += 8;
          } else {
            clearInterval(intervalId);
            this.loading = false;
          }
        }, 20);
        this.$router.push("/employee?page=1&limit=20");
        const res = await getData(
          `${BaseUrl}/Employees/filter?pageSize=${20}&pageNumber=${1}`
        );
        this.loadingProgress = 100;
        this.employees = res.data.Data;
        this.loading = false;

        // Phát thông tin của các bản record -> EmployeeHomeFooter.vue
        this.$msemitter.emit("recordsResInfo", res.data);
      } catch (error) {
        console.log(error);
        this.isLoading = false;
      }
    },
    /**
     * Params:
     *  + dateTime: Javascript datetime onbject
     * Des: Xử lí việc chuyển đổi datetime -> dd/mm/yyyy
     * Author: DDKhang
     * CreateAt: 24/4/2023
     * ModifierAt: 24/4/2023
     */
    convertDate(date) {
      return convertDate(date);
    },
    /**
     * Params:
     *  + employee: thông tin employee muốn sửa thông tin
     * Des: Xử lí chỉnh sửa thông tin nhân viên
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    handleEditEmployeeItem(employee) {
      // Mở form thông tin employee
      this.$router.push(`/employee/${employee.EmployeeId}`);
      // this.$router.push(`/employee/${employee.id}`);
      // Truyền dữ liệu vào trong form
      // Thực hiện valid form
    },

    /**
     * Params:
     *  + index: Chỉ số của thẻ tr khi di chuột vào, di chuột ra
     * Des: Thực hiện cập nhật trạng thái hiển thị "button option" trên thẻ tr
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    handleMouseOverEmployeeItem(index) {
      this.showOption[index] = true;
    },

    /**
     * Params:
     *  + index: Chỉ số của thẻ tr khi di chuột vào, di chuột ra
     * Des: Thực hiện cập nhật trạng thái hiển thị "button option" trên thẻ tr
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    handleMouseOutEmployeeItem(index) {
      this.showOption[index] = false;
    },

    /**
     * Params:
     *  + index: Chỉ số của thẻ tr khi di chuột vào
     * Des: Thực hiện hiển thị "button option" khi nhấn vào
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    handleShowOption(index, event) {
      event.stopPropagation();
      this.isShowContentOption[index] = !this.isShowContentOption[index];
    },

    /**
     * Params:
     *  + employee: Thông tin của employee khi checkbox vào
     * Des: Thực hiện thêm id của các employee vào mảng để thực hiện xóa nhiều, ...
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    handleChangeInputCheckbox(employee) {
      const employeeId = employee.EmployeeId;
      // Kiểm tra xem id employee đã tồn tại trong mảng checkboxEmployeId chưa -> xóa id đó
      if (this.checkboxEmployeesId.indexOf(employeeId) !== -1) {
        this.checkboxEmployeesId = this.checkboxEmployeesId.filter(
          (id) => id !== employeeId
        );
      } else {
        // Nếu chưa tồn tại thì thêm id đó vào mảng
        this.checkboxEmployeesId = [...this.checkboxEmployeesId, employeeId];
      }
      // Thông báo khi có yêu cầu muốn xóa employee, chuyển danh sách chứa employeeId được checked
      if (this.checkboxEmployeesId.length >= 0) {
        // Phát sự kiên đến "EmployeeHome.vue" thực hiện truyền danh sách employeeId cần xóa
        this.$msemitter.emit(
          "handleDeleteEmployeeById",
          this.checkboxEmployeesId
        );
      }
    },

    /**
     * Params:
     *  + employee: Thông tin của employees khi mà tìm kiếm
     * Des: Thực hiện lưu trữ thông tin của employees đã tìm kiếm đó và hiển thị trên bảng
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    handleShowListEmployeeSearch(employees) {
      this.employees = employees;
    },

    /**
     * Params: null
     * Des: Thực hiện xử lí checked tất cả danh sách employee trên trang hiện tại
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    async handleCheckAll() {
      this.isCheckedAll = !this.isCheckedAll;
      if (this.isCheckedAll) {
        let { page, limit } = this.$route.query;
        // trạng thái checkAll
        // Khởi tạo giá trị ban đầu cho trang ban đầu
        if (!page) page = 1;
        if (!limit) limit = 20;
        // Khởi tạo danh sách checked
        let listCheck = [];
        // Khởi tạo entityFilter để truyền lên api filter
        const entityFilter = {
          pageNumber: page,
          pageSize: limit,
          valueFilter: null,
        };
        // Thực hiện gọi api lấy những nhân viên trên trang hiện tại
        const res = await filterInfoEntity(
          this.$EntityEnum.Employees,
          entityFilter
        );
        const employees = res.data.Data;
        // Thực hiện lấy danh sách employeeId -> Cập nhật danh sách employee được checked
        employees.forEach((employee) => {
          listCheck.push(employee.EmployeeId);
        });
        this.checkboxEmployeesId = [...listCheck];
      } else {
        // trang thai bo checkAll
        this.checkboxEmployeesId = [];
      }
      if (this.checkboxEmployeesId.length >= 0) {
        // Phát lên EmployeeHome.vue -> Để khi bấm nút Delete trên EmployeeHome
        this.$msemitter.emit(
          "handleDeleteEmployeeById",
          this.checkboxEmployeesId
        );
      }
    },

    /**
     * Params: null
     * Des: Thực hiện xóa nhân viên theo mã nhân viên
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     * @param {*} employeeId - Mã nhân viên
     */
    handleDeleteEmployee(employeeId) {
      // Hiển thị dialog
      ShowQuestion(this.$MISAResource.Delete.deleteOneInfo);
      // Phát kiểu xóa đến MISADialoQuestion.vue
      this.$msemitter.emit("deleteType", this.$DeleteType.deleteOne);
      // Phát lên "MISADialogQuestion.vue"
      // Thực hiện xóa Phát lên "EmployeeHome.vue"
      // this.$msemitter.emit("handleDeleteEmployeeById", [employeeId]);
      // Phát tín hiệu đến EmployeeHome.vue
      this.$msemitter.emit("deleteSingleEmployeeId", [employeeId]);
      this.$msemitter.emit("refresh");
    },

    /**
     * - Xử lí nút nhân bản
     * - Author: DDKhang (4/6/2023)
     */
    handleDuplicateEmployee(employee) {
      this.$router.push(`/employee/${employee.EmployeeId}?duplicate=true`);
    },
  },
};
</script>

<template>
  <TheLoading v-if="this.loading" :loadingProgress="this.loadingProgress" />
  <div class="main__table-info">
    <table id="table-employee">
      <!-- <tr style="position: fixed"> -->
      <thead>
        <tr>
          <th
            class="table-header__checkbox sticky-column-thead1 checkbox-item"
            style="min-width: 50px; background-color: #f2f2f2; z-index: 2"
          >
            <input
              style="accent-color: #23a623"
              type="checkbox"
              @click="handleCheckAll"
            />
          </th>
          <th
            class="sticky-column-thead2"
            style="min-width: 140px; background-color: #f2f2f2; z-index: 2"
          >
            {{ this.$MISAResource.EmployeeList.thead.employeeCode.text }}
          </th>
          <th
            class="sticky-column-thead3"
            style="min-width: 150px; background-color: #f2f2f2; z-index: 2"
          >
            {{ this.$MISAResource.EmployeeList.thead.employeeName.text }}
          </th>
          <th class="table-header__gender" style="min-width: 110px">
            {{ this.$MISAResource.EmployeeList.thead.gender.text }}
          </th>
          <th style="min-width: 150px">
            {{ this.$MISAResource.EmployeeList.thead.dateOfBirth.text }}
          </th>
          <th style="min-width: 150px">
            <label
              class="textfield__label"
              :title="
                this.$MISAResource.EmployeeList.thead.identifyNumber.tooltip
              "
            >
              {{
                this.$MISAResource.EmployeeList.thead.identifyNumber.text
              }}</label
            >
          </th>
          <th style="min-width: 140px">
            {{ this.$MISAResource.EmployeeList.thead.title.text }}
          </th>
          <th class="table-header__unit" style="min-width: 100px">
            {{ this.$MISAResource.EmployeeList.thead.unit.text }}
          </th>
          <th>{{ this.$MISAResource.EmployeeList.thead.bankAccount.text }}</th>
          <th style="min-width: 154px">
            {{ this.$MISAResource.EmployeeList.thead.bankName.text }}
          </th>
          <th style="min-width: 272px; width: 300px">
            {{ this.$MISAResource.EmployeeList.thead.branch.text }}
          </th>
          <!--<th colspan="2">CHỨC NĂNG</th> -->
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(employee, index) in employees"
          :key="employee.EmployeeId"
          @dblclick="handleEditEmployeeItem(employee)"
          @mouseout="handleMouseOutEmployeeItem(index)"
          @mouseover="handleMouseOverEmployeeItem(index)"
        >
          <td style="min-width: 50px" class="sticky-column1 checkbox-item">
            <input
              @dblclick.stop
              type="checkbox"
              style="cursor: pointer; accent-color: #23a623"
              :checked="checkboxEmployeesId.includes(employee.EmployeeId)"
              @change="handleChangeInputCheckbox(employee)"
            />
          </td>
          <td class="sticky-column2">{{ employee.EmployeeCode }}</td>
          <td class="sticky-column3">{{ employee.FullName }}</td>
          <td>{{ employee?.GenderName }}</td>
          <td class="table-employee-dateOfBirth">
            {{ this.convertDate(employee.DateOfBirth) }}
          </td>
          <td>{{ employee.IdentityNumber }}</td>
          <td>{{ employee.Title }}</td>
          <td>{{ employee.DepartmentName }}</td>
          <td>{{ employee?.AccountNumber }}</td>
          <td>{{ employee.BankName }}</td>
          <td style="width: 150px">{{ employee.Branch }}</td>
          <td
            colspan="2"
            class="table-employee__options"
            v-show="showOption[index]"
          >
            <div class="table-employee__options-edit">
              <button
                @dblclick.stop
                class="btn-custom-rounded btn-custom-rounded-custom"
                @click="handleEditEmployeeItem(employee)"
                :title="this.$MISAResource.EmployeeList.btnEdit.tooltip"
              >
                <i class="fas fa-pen"></i>
              </button>
            </div>

            <div
              class="table-employee__options-edit"
              @click.stop="handleShowOption(index, $event)"
            >
              <button
                @dblclick.stop
                class="btn-custom-rounded btn-custom-rounded-option"
                :title="this.$MISAResource.EmployeeList.btnOption.tooltip"
              >
                <i class="fas fa-ellipsis-h"></i>
              </button>
              <!-- Thực hiện xử lí hiển thị popup -->
              <div
                :class="[
                  'main__table-info-icon-option-items',
                  this.employees.length >=
                    this.$MagicNumber.EmployeeList.popup.qualityViewInitial &&
                  index >=
                    this.employees.length -
                      this.$MagicNumber.EmployeeList.popup
                        .qualityRecordShowPopupTop
                    ? 'bottom-popup'
                    : '',
                ]"
                v-show="isShowContentOption[index]"
              >
                <div
                  class="main__table-info-icon-option-item"
                  @click="handleDuplicateEmployee(employee)"
                >
                  {{
                    this.$MISAResource.EmployeeList.btnOption.btnDuplicate.text
                  }}
                </div>
                <div
                  class="main__table-info-icon-option-item"
                  @click="handleDeleteEmployee(employee.EmployeeId)"
                >
                  {{ this.$MISAResource.EmployeeList.btnOption.btnDelete.text }}
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped></style>
