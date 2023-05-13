<script>
import { getData } from "../../config/FetchData";
import { convertDate } from "../../functions/ConvertDate";
import TheLoading from "../../components/TheLoading.vue";

export default {
  name: "EmployeeList",
  components: { TheLoading },
  created() {
    // this.loadData();
    // Thực hiện lấy dữ liệu tương ứng với url khi mà refresh trang
    this.fetchDataByPageAndLimit();
    // Lắng nghe sự kiện được truyền đến
    this.$msemitter.on("refresh", this.reloadData);
    this.$msemitter.on("listEmployeeSearch", this.handleShowListEmployeeSearch);
  },
  data() {
    // Cập nhật status ban đầu của các "btn option"
    const showOption = {};
    const isShowContentOption = {};
    this.employees?.forEach((item, index) => {
      showOption[index] = false;
      isShowContentOption[index] = false;
    });
    return {
      employees: [],
      showOption,
      isShowContentOption,
      loading: false,
      loadingProgress: 0,
      checkboxEmployeesId: [], // Chứa toàn bộ id employee được chọn
      isCheckedAll: false,
    };
  },
  watch: {
    "$route.query": {
      async handler() {
        this.fetchDataByPageAndLimit();
      },
      immediate: true, // Kích hoạt watcher ngay khi component được tạo ra
      deep: true, // Theo dõi sâu đối với các thuộc tính con của $route.query
    },
  },
  methods: {
    /**
     * @param(): null
     * Des: Thực hiện lấy tham số {page, limit} trên url mỗi khi có sự thay đổi => lấy dữ liệu tương ứng
     * Author: DDKhang
     * CreateAt: 30/4/2023
     * ModifierAt: 30/4/2023
     */
    async fetchDataByPageAndLimit() {
      const { page, limit } = this.$route.query;
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
        try {
          res = await getData(
            `https://cukcuk.manhnv.net/api/v1/Employees/filter?pageSize=${limit}&pageNumber=${page}`
          );
          this.loadingProgress = 100;
          this.employees = res.data.Data;
          this.loading = false;
        } catch (error) {
          console.log("Error: ", error);
          this.isLoading = false;
        }
      } else {
        // Thực hiện lấy dữ liệu khi không có query url nào (https//:localhost:3000/employee)
        const page = 1;
        const limit = 20;
        try {
          res = await getData(
            `https://cukcuk.manhnv.net/api/v1/Employees/filter?pageSize=${limit}&pageNumber=${page}`
          );
          this.loadingProgress = 100;
          this.employees = res.data.Data;
          this.loading = false;
        } catch (error) {
          console.log(error);
          this.isLoading = false;
        }
      }

      // Phát thông tin của các bản record
      this.$msemitter.emit("recordsResInfo", res.data);
    },
    /**
     * Params: null
     * Des: Xử lí tải lại dữ liệu cho table
     * Author: DDKhang
     * CreateAt: 30/4/2023
     * ModifierAt: 30/4/2023
     */
    reloadData() {
      // this.loadData();
      this.fetchDataByPageAndLimit();
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
        const res = await getData("https://cukcuk.manhnv.net/api/v1/Employees");
        // const res = await getData("https://jsonplaceholder.typicode.com/users");
        this.loadingProgress = 100;
        this.employees = res.data;
        this.loading = false;
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
     * Des: Thực hiện xử lí checked tất cả danh sách employee
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    handleCheckAll() {
      this.isCheckedAll = !this.isCheckedAll;
      if (this.isCheckedAll) {
        // trạng thái checkAll
        let listCheck = [];
        this.employees.forEach((employee) => {
          listCheck.push(employee.EmployeeId);
        });
        this.checkboxEmployeesId = [...listCheck];
      } else {
        // trang thai bo checkAll
        this.checkboxEmployeesId = [];
      }
      if (this.checkboxEmployeesId.length >= 0) {
        this.$msemitter.emit(
          "handleDeleteEmployeeById",
          this.checkboxEmployeesId
        );
      }
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
            class="table-header__checkbox sticky-column-thead1"
            style="min-width: 50px; background-color: #f2f2f2; z-index: 2"
          >
            <input type="checkbox" @click="handleCheckAll" />
          </th>
          <th
            class="sticky-column-thead2"
            style="min-width: 100px; background-color: #f2f2f2; z-index: 2"
          >
            MÃ NHÂN VIÊN
          </th>
          <th
            class="sticky-column-thead3"
            style="min-width: 150px; background-color: #f2f2f2; z-index: 2"
          >
            TÊN NHÂN VIÊN
          </th>
          <th class="table-header__gender" style="min-width: 100px">
            GIỚI TÍNH
          </th>
          <th style="min-width: 150px">NGÀY SINH</th>
          <th style="min-width: 150px">
            <label class="textfield__label" title="Chứng minh thư nhân dân"
              >Số CMND</label
            >
          </th>
          <th style="min-width: 80px">CHỨC DANH</th>
          <th class="table-header__unit" style="min-width: 100px">
            TÊN ĐƠN VỊ
          </th>
          <th>SỐ TÀI KHOẢN</th>
          <th>TÊN NGÂN HÀNG</th>
          <th style="min-width: 272px; width: 300px">
            CHI NHÁNH TÀI KHOẢN NGÂN HÀNG
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
              type="checkbox"
              :checked="this.isCheckedAll"
              @change="handleChangeInputCheckbox(employee)"
            />
          </td>
          <td class="sticky-column2">{{ employee.EmployeeCode }}</td>
          <td class="sticky-column3">{{ employee.FullName }}</td>
          <td>{{ employee.GenderName }}</td>
          <td class="table-employee-dateOfBirth">
            {{ this.convertDate(employee.DateOfBirth) }}
          </td>
          <td>123456789</td>
          <td></td>
          <td>MISA</td>
          <td>0123456789</td>
          <td>MBBank</td>
          <td style="width: 150px">Hà Nội</td>
          <td
            colspan="2"
            class="table-employee__options"
            v-show="showOption[index]"
          >
            <div class="table-employee__options-edit">
              <button
                class="btn-custom-rounded btn-custom-rounded-custom"
                @click="handleEditEmployeeItem(employee)"
              >
                <i class="fas fa-pen"></i>
              </button>
            </div>

            <div
              class="table-employee__options-edit"
              @click.stop="handleShowOption(index, $event)"
            >
              <button class="btn-custom-rounded btn-custom-rounded-option">
                <i class="fas fa-ellipsis-h"></i>
              </button>
              <div
                class="main__table-info-icon-option-items"
                v-show="isShowContentOption[index]"
              >
                <div class="main__table-info-icon-option-item">Nhân bản</div>
                <div class="main__table-info-icon-option-item">Xóa</div>
              </div>
            </div>
          </td>
        </tr>

        <!-- <tr
          v-for="(employee, index) in employees"
          :key="employee.EmployeeId"
          @dblclick="handleEditEmployeeItem(employee)"
          @mouseout="handleMouseOutEmployeeItem(index)"
          @mouseover="handleMouseOverEmployeeItem(index)"
        >
          <td style="min-width: 50px" class="sticky-column1 checkbox-item">
            <input
              type="checkbox"
              @change="handleChangeInputCheckbox(employee)"
            />
          </td>
          <td class="sticky-column2">{{ employee.id }}</td>
          <td class="sticky-column3">{{ employee.name }}</td>
          <td>Nam</td>
          <td class="table-employee-dateOfBirth">01/02/2000</td>
          <td>123456789</td>
          <td></td>
          <td>{{ employee.company.name }}</td>
          <td style="text-align: right">{{ employee.phone }}</td>
          <td>MBBank</td>
          <td style="width: 150px">Hà Nội</td>
          <td
            colspan="2"
            class="table-employee__options"
            v-show="showOption[index]"
          >
            <div
              class="table-employee__options-edit"
              @click="handleEditEmployeeItem(employee)"
            >
              <button class="btn-custom-rounded btn-custom-rounded-custom">
                <i class="fas fa-pen"></i>
              </button>
            </div>

            <div
              class="table-employee__options-edit"
              @click.stop="handleShowOption(index, $event)"
            >
              <button class="btn-custom-rounded btn-custom-rounded-option">
                <i class="fas fa-ellipsis-h"></i>
              </button>
              <div
                class="main__table-info-icon-option-items"
                v-show="isShowContentOption[index]"
              >
                <div class="main__table-info-icon-option-item">Nhân bản</div>
                <div class="main__table-info-icon-option-item">Xóa</div>
              </div>
            </div>
          </td>
        </tr> -->
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped></style>
