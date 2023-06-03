<script>
import { updateInfoEntity, postInfoEntity } from "../../config/FetchData";
import { ShowValidate } from "../../functions/CatchError";
import {
  checkBlank,
  checkDuplicateEmployeeCode,
} from "../../functions/ValidateForm";
import { showCombobox } from "../../functions/Combobox";
import MISAInput from "../../components/MISAInput.vue";
import {
  getNewCode,
  getDataById,
  filterInfoEntity,
} from "../../config/FetchData";
import MISAButton from "../../components/MISAButton.vue";
import MISACombobox from "../../components/MISACombobox.vue";

export default {
  name: "EmployeeForm",
  props: ["id"],
  components: { MISAInput, MISAButton, MISACombobox },
  data() {
    return {
      employeeId: "",
      employee: {
        Gender: 0,
      },
      department: {},
      employees: [], // Danh sách tất cả dữ liệu của Nhân viên
      departments: [], // Danh sách tất cả dữ liệu của Phòng ban
      inputs: [],
      currentIndex: 0, // index của thẻ input hiện tại được chọn
      isFirstFocusInput: false,
      formattedDate: "",
      cbListDepartment: [], // Danh sách dữ liệu phòng ban cho combobox
    };
  },
  async created() {
    this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
        // react to route changes...
        console.log({
          toParams,
          previousParams,
        });
      }
    );

    await this.handleCustomValueCombobox();
    // Sử dụng tabIndex khi vào form info employee
    // useTabIndex();

    // Thực hiện lấy id nhân viên trên url
    this.employeeId = this.$route.params.id;
    if (this.isAdd) {
      // Thực hiện post employee
      try {
        // Tạo mã employee mới
        // Kiểm tra xem DOM đã được render ra chưa
        this.$nextTick(async function () {
          // const res = await getData(`${BaseUrl}/Employees/NewCode`);
          const res = await getNewCode(this.$EntityEnum.Employees);
          // this.employee.EmployeeCode = res.data[0];
          this.employee.EmployeeCode = res.data;
          // this.$refs.textCodeEmployee.focus();
        });
        // Thực hiện hiển thị thông báo trạng thái post
      } catch (error) {
        console.log(error.message);
      }
    } else {
      /**
       * - Thực mở form cập nhật thông tin nhân viên
       * - Lấy thông tin nhân viên theo id -> truyền thông tin nhân viên đó lên form
       */
      if (this.employeeId) {
        try {
          // 1. Kiểm tra nhân viên có tồn tại -> Lấy thông tin nhân viên -> Hiển thị lên form
          const res = await getDataById(
            this.$EntityEnum.Employees,
            this.employeeId
          );

          // 2. Thực hiện cấu trúc lại dateOfBirth theo yyyy-mm-dd
          this.convertAndSetDate(`${res.data.DateOfBirth}`);
          // 3. Đẩy thông tin lên form
          if (res.data.BankId) {
            const resBank = await getDataById(
              this.$EntityEnum.Banks,
              res.data.BankId
            );
            this.employee = {
              ...res.data,
              DateOfBirth: this.formattedDate,
              BankInfo: resBank.data,
            };
          } else {
            this.employee = {
              ...res.data,
              DateOfBirth: this.formattedDate,
              BankInfo: {},
            };
          }

          // this.employee = res.data[0];
          // this.$refs.textCodeEmployee.focus();
        } catch (error) {
          console.log(error.message);
        }
        if (this.employee?.DepartmentId) {
          try {
            // const res = await getData(
            //   `${BaseUrl}/Departments/${this.employee?.DepartmentId}`
            // );
            const res = await getDataById(
              this.$EntityEnum.Departments,
              this.employee?.DepartmentId
            );
            this.department = res.data;
            // this.employee.DepartmentName = res.data.DepartmentName;
          } catch (error) {
            console.log(error);
          }
        }
      }
      // Thực hiện hiển thị thông báo trạng thái put
    }

    // Thực hiện lấy toàn bộ các phòng ban
    try {
      // const res = await getData(`${BaseUrl}/Departments`);
      const res = await filterInfoEntity(this.$EntityEnum.Departments);
      this.departments = res.data.Data;
    } catch (error) {
      console.log(error.message);
    }

    // Thực hiện lấy toàn bộ employees để check mã trùng lặp
    try {
      const res = await filterInfoEntity(this.$EntityEnum.Employees);
      this.employees = res.data.Data;
    } catch (error) {
      console.log(error.message);
    }
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keydown", this.handleTabKey);

    // // =================== Handel Tab - Start =======================
    // // Lấy toàn bộ những thẻ có thuộc tính "Ref"
    // const tagsContainRefAttr = Object.values(this.$refs);
    // console.log("Tags: ", tagsContainRefAttr);
    // const inputs = [];
    // // Kiểm tra những thẻ khác có phải là thẻ INPUT hoặc BUTTON hay không
    // tagsContainRefAttr.forEach((input) => {
    //   if (input.nodeName === "INPUT" || input.nodeName === "BUTTON") {
    //     inputs.push(input);
    //   }
    // });
    // // Thêm xử lý sự kiện khi nhấn phím Tab
    // inputs.forEach((input, index) => {
    //   input.addEventListener("keydown", (event) => {
    //     if (
    //       event.key === "Tab" &&
    //       !event.shiftKey &&
    //       index === inputs.length - 1
    //     ) {
    //       // Nếu đang ở input cuối cùng và nhấn phím Tab, chuyển về input đầu tiên
    //       event.preventDefault();
    //       const inputFirst = document.querySelector("#textfield_codeEmployee");
    //       // inputs[0].focus();
    //       inputFirst.focus();
    //     }
    //   });
    // });
    // // Thêm xử lý sự kiện khi nhả phím Tab
    // inputs.forEach((input, index) => {
    //   input.addEventListener("keyup", (event) => {
    //     if (event.key === "Tab" && event.shiftKey && index === 0) {
    //       // Nếu đang ở input đầu tiên và nhấn Shift + Tab, chuyển về input cuối cùng
    //       event.preventDefault();
    //       inputs[inputs.length - 1].focus();
    //     }
    //   });
    // });
    // // =================== Handel Tab - End =======================
  },

  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keydown", this.handleTabKey);
  },
  // beforeUpdate() {
  //   // Thực hiện xóa class "invalid" khỏi thẻ input khi thay đổi giá trị trên đó
  //   if (this.employee.FullName) {
  //     const tagCurrent = this.$refs.inputFullName;
  //     this.removeInvalidInputForm(tagCurrent);
  //   }

  //   // if (this.employee.EmployeeCode) {
  //   //   const tagCurrent = this.$refs.textCodeEmployee;
  //   //   this.removeInvalidInputForm(tagCurrent);
  //   // }

  //   if (this.employee.DepartmentId) {
  //     const tagCurrent = this.$refs.comboboxDepartment;
  //     this.removeInvalidInputForm(tagCurrent);
  //   }
  // },
  watch: {
    /**
     * @param {*} newValue - giá trị mới
     * @param {*} oldValue - giá trị cũ
     * - Des: Thực hiện theo dõi "employee.name"
     * - Author: DDKhang
     * - CreateAt: 11/5/2023
     * - ModifierAt: 11/5/2023
     */
    "employee.name": function (newValue, oldValue) {
      if (newValue.trim() != "") {
        const fullName = this.employee.FullName.toUpperCase();
        this.employee.FullName = fullName;
      }
    },
  },
  methods: {
    /**
     *
     * @param {*} event - Sự kiện khi gọi hàm
     * Author: DDKhang (11/5/2023)
     */
    handleTabKey(event) {
      if (event.keyCode === 9 && event.target === document.activeElement) {
        // Kiểm tra xem phần tử đang focus có phải là phần tử cuối cùng hay không
        const lastTabIndex = 19; // Thay thế N bằng tabIndex của phần tử cuối cùng
        if (event.target.tabIndex === lastTabIndex) {
          event.preventDefault(); // Ngăn chặn hành vi mặc định của tab
          this.focusFirstInput(); // Set focus vào phần tử input đầu tiên
        }
      }
    },

    /**
     * - Thực forcus vào thẻ input employeeCode
     * - Author: DDKhang (11/5/2023)
     */
    focusFirstInput() {
      this.$refs.textCodeEmployee?.focusInput(); // Set focus vào phần tử input đầu tiên
    },

    /**
     * @param {*} event - Sự kiên
     * - Des: Thực hiện nhấn phím tắt
     * - Author: DDKhang
     * - CreateAt: 11/5/2023
     * - ModifierAt: 11/5/2023
     */
    handleKeyDown(event) {
      if (event.key === this.$ShortCutResource.CloseForm.char) {
        // Thực hiện nhấn phím đóng Form
        event.preventDefault(); // Ngăn chặn hành động mặc định của trình duyệt
        this.handleShortcut();
      } else if (
        event.ctrlKey &&
        event.key === this.$ShortCutResource.BtnSave.char
      ) {
        // Thực hiện nhấn phím tắt nút Save
        event.preventDefault();
        this.handleBtnSave();
      }
    },

    /**
     * - Des: Thực hiện xử lí khi nhấn phím tắt
     * - Author: DDKhang
     * - CreateAt: 11/5/2023
     * - ModifierAt: 11/5/2023
     */
    handleShortcut() {
      this.$router.push("/employee");
    },

    /**
     * Params:
     *  + tagCurrent: thẻ input hiện tại
     * Des: Thực hiện xóa class "invalid" từ thẻ cha của input đó
     * Author: DDKhang
     * CreateAt: 11/5/2023
     * ModifierAt: 11/5/2023
     */
    // removeInvalidInputForm(tagCurrent) {
    //   // Tham chieu len thẻ cha (".formGroup")
    //   const tagParent = tagCurrent.closest(".form-group");
    //   tagParent.classList.remove("invalid");
    //   tagCurrent.setAttribute("title", "");
    // },

    /**
     * Params:
     * Des: Thực hiện chuyển sang trang table employee khi nhấn đóng form info
     * Author: DDKhang
     * CreateAt: 11/5/2023
     * ModifierAt: 11/5/2023
     */
    handleCloseFormEmployeeInfo() {
      this.$router.push("/employee");
    },

    /**
     * Params: null
     * Des: Thực hiện cất thông tin nhân viên
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    async handleBtnSave() {
      // Cờ bắt lỗi, nếu có lỗi thì -> true
      let flagErrorInput = false;
      // Thực hiện focus vào thẻ input đầu tiên trong các input lỗi
      this.isFirstFocusInput = true;
      const formInput = document.querySelector("#form-employee");
      // 1. Thực hiện truy vấn tất cả những thẻ input[required] trong formInput tương ứng
      const inputsRequired = formInput.querySelectorAll("input[required]");
      inputsRequired.forEach((input) => {
        if (!input.value) {
          flagErrorInput = true;
          // Tham chieu len thẻ cha (".formGroup")
          const tagParent = input.closest(".form-group");
          tagParent.classList.add("invalid");
          input.setAttribute(
            "title",
            this?.$MISAResource?.textError?.textErrorRequired
          );
          if (this.isFirstFocusInput) {
            input.focus();
            // Thực hiện không focus vào các thẻ input lỗi khác
            this.isFirstFocusInput = false;
          }
        } else {
          flagErrorInput = false;
        }
      });
      // Thực validate form
      const checkFullName = checkBlank(this.employee?.FullName);
      const checkCodeEmployee = checkBlank(this.employee?.EmployeeCode);
      // Kiểm tra mã nhân viên có bị trùng lặp
      const isCheckDuplicateEmployeeCode = checkDuplicateEmployeeCode(
        this.employees,
        this.employee.EmployeeCode
      );
      if (checkFullName.status || checkCodeEmployee.status) {
        return ShowValidate(checkFullName.msg);
      }

      // Nếu không xảy ra lỗi trên những thẻ input
      if (!flagErrorInput) {
        if (this.isAdd) {
          // Thực hiện gọi api thêm nhân viên
          if (isCheckDuplicateEmployeeCode.status) {
            return ShowValidate(isCheckDuplicateEmployeeCode.msg);
          }
          // Thực hiện thêm thông tin nhân viên
          await postInfoEntity(this.$EntityEnum.Employees, this.employee);
        } else {
          // Thực hiện gọi api sửa nhân viên
          console.log("Employee Update: ", this.employee);
          await updateInfoEntity(
            this.employee.EmployeeId,
            this.$EntityEnum.Employees,
            this.employee
          );
        }
        // Thực hiện đóng form
        this.handleCloseFormEmployeeInfo();
      }
    },

    /**
     * Params:
     * Des: Thực hiện bắt sự thay đổi trên input
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    handleChangeInput() {
      const tagCurrent = event.currentTarget;
      // Tham chieu len thẻ cha (".formGroup")
      const tagParent = tagCurrent.closest(".form-group");
      tagParent.classList.remove("invalid");
      tagCurrent.setAttribute("title", "");
    },
    /**
     * Params:
     * Des: Thực hiện validate input
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    validateInput() {
      const tagCurrent = event.currentTarget;
      const value = tagCurrent.value;
      if (!value) {
        // Tham chieu len thẻ cha (".formGroup")
        const tagParent = tagCurrent.closest(".form-group");
        tagParent.classList.add("invalid");
        tagCurrent.setAttribute(
          "title",
          this.$MISAResource.textError.textErrorRequired
        );
      } else {
        // Tham chieu len thẻ cha (".formGroup")
        const tagParent = tagCurrent.closest(".form-group");
        tagParent.classList.remove("invalid");
        tagCurrent.setAttribute("title", "");
      }
    },
    /**
     * Params:
     * Des: Thực hiện nhấn combobox
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    handlePressCombobox() {
      showCombobox();
    },

    /**
     * Params:
     * Des: Xử lí việc tab trên mỗi thẻ input
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    // handleTab(index, event) {
    //   if (index === this.inputs.length - 1) {
    //     // nếu đang ở thẻ input cuối cùng thì quay lại thẻ input đầu tiên
    //     event.preventDefault();
    //     this.inputs[0].focus();
    //   } else {
    //     // nếu đang ở thẻ input bất kỳ thì chuyển sang thẻ input tiếp theo
    //     this.currentIndex = index + 1;
    //     this.inputs[this.currentIndex].focus();
    //   }
    // },

    /**
     * Params:
     *  + departmentId:(string) - Id của department
     * Des: Thực hiện xử lí khi trên comboboxDepartment
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    async handleComboboxDepartment(departmentId) {
      this.employee.DepartmentId = departmentId;
    },

    /**
     * Thực hiện chuyển đổi đúng định dạng khi chuyền vào thẻ input type="date" (yyyy-mm-dd)
     * (phải truyền đúng định dạng thì mới hiển thị trên thẻ input)
     * @param {} dateTime  string - Ngày muốn chuyển đổi
     * Author: DDKhang
     * CreateAt: 26/5/2023
     * ModifierAt: 26/5/2023
     */
    convertAndSetDate(dateTime) {
      // Chuyển đổi thành dạng Date
      const date = new Date(dateTime);

      // Lấy dữ liệu ngày, tháng, năm
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      // Đặt đúng cấu trúc yyyy-mm-dd
      var formattedDate =
        year +
        "-" +
        (month < 10 ? "0" : "") +
        month +
        "-" +
        (day < 10 ? "0" : "") +
        day;

      // Cập nhật thông tin cấu trúc ngày
      this.formattedDate = formattedDate;
    },

    /**
     * Des: Xử lí việc cung cấp class cho combobox
     * Author: DDKhang (1/6/2023)
     */
    handleCustomClassCombobox() {
      return {
        borderLeftNone: "border-left--none",
        backgroundWhite: "backgroundColor--white",
        widthInput: "width-full",
      };
    },

    /**
     * - Des: Thực hiện khởi tạo giá trị đầu vào cho combobox trong form chi tiết theo dạng {id: ?, value: ?}
     * - Author: DDKhang (1/6/2023)
     */
    async handleCustomValueCombobox() {
      try {
        // const res = await getData(`${BaseUrl}/Departments`);
        const res = await filterInfoEntity(this.$EntityEnum.Departments);
        const departments = res.data.Data;
        const result = departments.map((d) => {
          return {
            id: d.DepartmentId,
            value: d.DepartmentName,
          };
        });
        // Cập nhật giá trị cho status
        this.cbListDepartment = result;
      } catch (error) {
        console.log(error.message);
      }
    },

    /**
     * - Des: Khởi tạo giá trị mặc định cho combobox để hiển thị ngay khi ban đầu (dùng cho update mà muốn hiển thi)
     * - Author: DDKhang (1/6/2023)
     */
    handleDefaultValueDepartmentCombobox() {
      return {
        id: this.department.DepartmentId,
        value: this.department.DepartmentName,
      };
    },

    /**
     * - Des: Xử lí chọn bản ghi trên combobox department
     * - Author: DDKhang (1/6/2023)
     */
    handleChooseDepartmentRecord(option) {
      this.employee.DepartmentId = option.id;
    },

    /**
     *
     * @param {*} event - Sự kiện mặc định khi gọi sự kiện
     * - Des: Xử lí việc focus vào combobox bằng cách gọi đến hàm forcusInput bên trong component Combobox
     * - Author: DDKhang (1/6/2023)
     */
    handleFocusComboboxDepartment(event) {
      event.preventDefault();
      // Tham chiếu đến combobox department
      var refCombobox = this.$refs.comboboxDepartment;
      // Gọi hàm trong component Combobox
      refCombobox.focusInput();
    },

    /**
     * - Ngăn chặn bấm enter trên form
     * - Author: DDKhang (3/6/2023)
     */
    handleKeyDownForm(event) {
      if (event.key === "Enter") {
        event.preventDefault();
      }
    },
  },
  computed: {
    /**
     * Params:
     * Des:  Tính toán thêm hoặc cập nhật
     * Author: DDKhang
     * CreateAt: 3/5/2023
     * ModifierAt: 3/5/2023
     */
    isAdd: function () {
      if (this.employeeId) {
        return false; // Thực hiện Edit
      } else {
        return true; // Thực hiện Create
      }
    },
  },
};
</script>

<template>
  <div id="form-employee" class="form-employee dialog-close">
    <div class="form-employee-wrapper">
      <!-- UI FORM ADD EMPLOYEE -->
      <form @keydown="handleKeyDownForm" class="form-info-employee">
        <div class="info-employee">
          <!-- Info employee header -- Start -->
          <div class="info-employee-header">
            <div class="info-employee-header-title">
              {{
                this.isAdd
                  ? this.$MISAResource.textCRUD.textAddEmployee
                  : this.$MISAResource.textCRUD.textEditEmployee
              }}
            </div>
            <div
              class="icon-help-close"
              :title="this.$ShortCutResource.CloseForm.tooltip"
              @click="handleCloseFormEmployeeInfo"
            >
              <div class="dialog-btn--close icon-close"></div>
            </div>
          </div>
          <!-- Info employee header -- End -->

          <div class="info-employee-content">
            <div class="info-employee-content-place-first">
              <div class="info-employee-form-one">
                <div class="info-employee-form-one-idName">
                  <div class="info-employee-form-one-id-employee form-group">
                    <label
                      class="textfield__label"
                      :title="
                        this.$MISAResource.EmployeeForm.labelForm.employeeCode
                          .tooltip
                      "
                      >{{
                        this.$MISAResource.EmployeeForm.labelForm.employeeCode
                          .text
                      }}
                      <span class="icon-require">
                        <label for="" title="Bắt buộc nhập">*</label>
                      </span>
                    </label>
                    <!-- <input
                      ref="textCodeEmployee"
                      id="textfield_codeEmployee"
                      class="textfield__input input-hover input-focus firstElement"
                      type="text"
                      field-label="Mã nhân viên"
                      name="employeeCode"
                      v-model="this.employee.EmployeeCode"
                      @blur="validateInput"
                      placeholder="Mã nhân viên"
                      :tabindex="this.$TabIndex.formEmployeeInfo.codeEmployee"
                      required
                    /> -->
                    <MISAInput
                      ref="textCodeEmployee"
                      id="textfield_codeEmployee"
                      class="firstElement"
                      field-label="Mã nhân viên"
                      name="employeeCode"
                      v-model="employee.EmployeeCode"
                      :tabindex="this.$TabIndex.formEmployeeInfo.codeEmployee"
                      required="true"
                      focus="true"
                    ></MISAInput>
                    <small class="form-message--error"></small>
                  </div>

                  <div class="info-employee-form-one-name-employee form-group">
                    <label
                      class="textfield__label"
                      :title="
                        this.$MISAResource.EmployeeForm.labelForm.employeeName
                          .tooltip
                      "
                      >{{
                        this.$MISAResource.EmployeeForm.labelForm.employeeName
                          .text
                      }}
                      <span class="icon-require">*</span>
                    </label>
                    <!-- <input
                      id="textfield_EmployeeName"
                      class="textfield__input input-hover input-focus min-width-input"
                      type="text"
                      field-label="Tên nhân viên"
                      name="FullName"
                      v-model="this.employee.FullName"
                      @blur="validateInput"
                      placeholder="Nguyễn Ánh Bằng"
                      :tabindex="this.$TabIndex.formEmployeeInfo.employeeName"
                      required
                      ref="inputFullName"
                    /> -->
                    <MISAInput
                      ref="inputFullName"
                      id="textfield_EmployeeName"
                      class="min-width-input"
                      field-label="Tên nhân viên"
                      name="FullName"
                      v-model="this.employee.FullName"
                      placeholder="Nguyễn Ánh Bằng"
                      :tabindex="this.$TabIndex.formEmployeeInfo.employeeName"
                      required="true"
                      @keydown.tab.prevent="handleFocusComboboxDepartment"
                    ></MISAInput>
                    <small class="form-message--error"></small>
                  </div>
                </div>

                <div
                  id="info-employee-form-one-unit"
                  class="info-employee-form-one-unit form-group"
                >
                  <!-- Combobox -->
                  <label
                    class="textfield__label"
                    :title="
                      this.$MISAResource.EmployeeForm.labelForm.unit.tooltip
                    "
                    >{{ this.$MISAResource.EmployeeForm.labelForm.unit.text }}
                    <span class="icon-require">*</span>
                  </label>

                  <div class="content-combobox">
                    <MISACombobox
                      :customClass="this.handleCustomClassCombobox()"
                      :listItemValue="this.cbListDepartment"
                      :handleChooseRecord="this.handleChooseDepartmentRecord"
                      required="true"
                      ref="comboboxDepartment"
                      :defaultValueInput="
                        this.handleDefaultValueDepartmentCombobox()
                      "
                      :tabindex="this.$TabIndex.formEmployeeInfo.comboboxUnit"
                    ></MISACombobox>
                  </div>

                  <!-- <input
                    type="text"
                    placeholder="Phòng nhân sự"
                    :tabindex="this.$TabIndex.formEmployeeInfo.comboboxUnit"
                    name="unit"
                    v-model="this.department.DepartmentName"
                    ref="comboboxDepartment"
                    @blur="validateInput"
                  /> -->
                  <!-- <div class="dropdown width-full" @click="handlePressCombobox">
                    <div class="combobox-input form-group">
                      <MISAInput
                        placeholder="Phòng nhân sự"
                        :tabindex="this.$TabIndex.formEmployeeInfo.comboboxUnit"
                        name="unit"
                        v-model="this.department.DepartmentName"
                        ref="comboboxDepartment"
                        @blur="validateInput"
                        required="true"
                      ></MISAInput>
                      <div
                        class="combobox-input__icon border-left-none top-align"
                      >
                        <div class="icon-combobox--arrow"></div>
                      </div>
                    </div>
                    <ul
                      id="contentUnitCombobox"
                      class="options combobox-options--below"
                    >
                      <li
                        class="option"
                        v-for="department in this.departments"
                        @click="
                          this.handleComboboxDepartment(department.DepartmentId)
                        "
                      >
                        {{ department.DepartmentName }}
                      </li>
                    </ul>
                  </div> -->
                  <small class="form-message--error"></small>
                </div>

                <div class="info-employee-form-one-title form-group">
                  <label class="textfield__label">
                    {{ this.$MISAResource.EmployeeForm.labelForm.title.text }}
                  </label>
                  <MISAInput
                    id="textfield__title"
                    class="width-full"
                    type="text"
                    name="title"
                    placeholder=""
                    :tabindex="this.$TabIndex.formEmployeeInfo.title"
                    ref="input4"
                  ></MISAInput>
                  <!-- <input
                    id="textfield__title"
                    class="textfield__input width-full input-hover input-focus"
                    type="text"
                    name="title"
                    placeholder=""
                    :tabindex="this.$TabIndex.formEmployeeInfo.title"
                    ref="input4"
                  /> -->
                  <small class="form-message--error"></small>
                </div>
              </div>

              <div class="info-employee-form-two">
                <div class="info-employee-form-two--dateofbirth-sex">
                  <div class="datetime form-group">
                    <label class="textfield__label">{{
                      this.$MISAResource.EmployeeForm.labelForm.dateOfBirth.text
                    }}</label>
                    <MISAInput
                      type="date"
                      id="textfield__dateOfBirth"
                      name="dateOfBirth"
                      v-model="this.employee.DateOfBirth"
                      :tabindex="this.$TabIndex.formEmployeeInfo.dateOfBirth"
                      ref="input5"
                    ></MISAInput>
                    <!-- <input
                      type="date"
                      id="textfield__dateOfBirth"
                      name="dateOfBirth"
                      v-model="this.employee.DateOfBirth"
                      :tabindex="this.$TabIndex.formEmployeeInfo.dateOfBirth"
                      ref="input5"
                    /> -->
                    <!-- <small class="form-message--error"></small> -->
                  </div>

                  <div class="info-employee-form-two-sex form-group">
                    <label class="textfield__label">
                      {{
                        this.$MISAResource.EmployeeForm.labelForm.gender.text
                      }}
                    </label>
                    <div class="info-employee-form-two-sex--list">
                      <!-- <label class="">
                                  <input
                                    id="radio-male"
                                    type="radio"
                                    name="genre"
                                    value="male"
                                  />
                                  Nam
                                  <span class="checkmark"></span>
                                </label> -->

                      <label class="radio">
                        <input
                          type="radio"
                          name="genre"
                          value="0"
                          v-model="this.employee.Gender"
                          ref="input6"
                          :tabindex="this.$TabIndex.formEmployeeInfo.genderMale"
                        />
                        <p>
                          {{
                            this.$MISAResource.EmployeeForm.labelForm.genderMale
                              .text
                          }}
                        </p>
                        <span class="checkmark"></span>
                      </label>

                      <label class="radio">
                        <input
                          type="radio"
                          name="genre"
                          value="1"
                          v-model="this.employee.Gender"
                          ref="input7"
                        />
                        <p>
                          {{
                            this.$MISAResource.EmployeeForm.labelForm
                              .genderFemale.text
                          }}
                        </p>
                        <span
                          class="checkmark"
                          :tabindex="
                            this.$TabIndex.formEmployeeInfo.genderFemale
                          "
                        ></span>
                      </label>

                      <label class="radio">
                        <input
                          type="radio"
                          name="genre"
                          value="2"
                          v-model="this.employee.Gender"
                          ref="input8"
                        />
                        <p>
                          {{
                            this.$MISAResource.EmployeeForm.labelForm
                              .genderOther.text
                          }}
                        </p>
                        <span
                          class="checkmark"
                          :tabindex="
                            this.$TabIndex.formEmployeeInfo.genderOther
                          "
                        ></span>
                      </label>
                    </div>
                    <small class="form-message--error"></small>
                  </div>
                </div>

                <div class="info-employee-form-two-identification">
                  <div
                    class="info-employee-form-two-identification--number form-group"
                  >
                    <label
                      class="textfield__label"
                      title="Chứng minh thư nhân dân"
                      >{{
                        this.$MISAResource.EmployeeForm.labelForm.identifyNumber
                          .text
                      }}</label
                    >
                    <MISAInput
                      id="textfield__peopleId"
                      class="textfield__input min-width-300"
                      type="text"
                      name="peopleId"
                      placeholder="001202009382"
                      v-model="this.employee.IdentityNumber"
                      :tabindex="this.$TabIndex.formEmployeeInfo.identification"
                      ref="input9"
                    ></MISAInput>
                    <!-- <input
                      id="textfield__peopleId"
                      class="textfield__input input-hover input-focus min-width-300"
                      type="text"
                      name="peopleId"
                      placeholder="001202009382"
                      :tabindex="this.$TabIndex.formEmployeeInfo.identification"
                      ref="input9"
                    /> -->
                    <small class="form-message--error"></small>
                  </div>
                  <!-- <div
                              class="info-employee-form-two-identification--created form-group"
                            >
                              <label class="textfield__label">Ngày cấp</label>
                              <input
                                type="date"
                                id="textfield__dateRange"
                                name="dateRange"
                              />
                              <small class="form-message--error"></small>
                            </div> -->

                  <div class="datetime form-group">
                    <label class="textfield__label">{{
                      this.$MISAResource.EmployeeForm.labelForm.dateRange.text
                    }}</label>
                    <MISAInput
                      class="width-full min-width-200"
                      type="date"
                      id="textfield__dateOfBirth"
                      name="dateOfBirth"
                      :tabindex="this.$TabIndex.formEmployeeInfo.datetime"
                      ref="input10"
                    ></MISAInput>
                    <!-- <input
                      class="width-full min-width-200"
                      type="date"
                      id="textfield__dateOfBirth"
                      name="dateOfBirth"
                      :tabindex="this.$TabIndex.formEmployeeInfo.datetime"
                      ref="input10"
                    /> -->
                    <!-- <small class="form-message--error"></small> -->
                  </div>
                </div>

                <div class="info-employee-form-two-issued form-group">
                  <label class="textfield__label">{{
                    this.$MISAResource.EmployeeForm.labelForm.issuedBy.text
                  }}</label>
                  <MISAInput
                    id="textfield__issuedBy"
                    class="textfield__input width-full input-hover input-focus"
                    type="text"
                    name="issuedBy"
                    placeholder=""
                    v-model="this.employee.IdentityPlace"
                    :tabindex="this.$TabIndex.formEmployeeInfo.issuedBy"
                    ref="input11"
                  ></MISAInput>
                  <!-- <input
                    id="textfield__issuedBy"
                    class="textfield__input width-full input-hover input-focus"
                    type="text"
                    name="issuedBy"
                    placeholder=""
                    :tabindex="this.$TabIndex.formEmployeeInfo.issuedBy"
                    ref="input11"
                  /> -->
                  <small class="form-message--error"></small>
                </div>
              </div>
            </div>

            <div class="info-employee-form-three form-group">
              <label class="textfield__label">{{
                this.$MISAResource.EmployeeForm.labelForm.address.text
              }}</label>
              <MISAInput
                id="textfield__address"
                class="textfield__input width-full input-hover input-focus"
                type="text"
                name="address"
                placeholder=""
                v-model="this.employee.Address"
                :tabindex="this.$TabIndex.formEmployeeInfo.address"
                ref="input12"
              ></MISAInput>
              <!-- <input
                id="textfield__address"
                class="textfield__input width-full input-hover input-focus"
                type="text"
                name="address"
                placeholder=""
                :tabindex="this.$TabIndex.formEmployeeInfo.address"
                ref="input12"
              /> -->
              <small class="form-message--error"></small>
            </div>

            <div class="info-employee-form-four">
              <div class="info-employee-form-four--contact">
                <div
                  class="info-employee-form-four-telephone--contact form-group"
                >
                  <label
                    class="textfield__label"
                    :title="
                      this.$MISAResource.EmployeeForm.labelForm.telephoneNumber
                        .tooltip
                    "
                    >{{
                      this.$MISAResource.EmployeeForm.labelForm.telephoneNumber
                        .text
                    }}</label
                  >
                  <MISAInput
                    id="textfield__mobilePhone"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="mobilePhone"
                    placeholder=""
                    v-model="this.employee.PhoneNumber"
                    :tabindex="this.$TabIndex.formEmployeeInfo.mobilePhone"
                    ref="input13"
                  ></MISAInput>
                  <!-- <input
                    id="textfield__mobilePhone"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="mobilePhone"
                    placeholder=""
                    :tabindex="this.$TabIndex.formEmployeeInfo.mobilePhone"
                    ref="input13"
                  /> -->
                  <small class="form-message--error"></small>
                </div>
                <div
                  class="info-employee-form-four-telephoneDefault--contact form-group"
                >
                  <label
                    class="textfield__label"
                    :title="
                      this.$MISAResource.EmployeeForm.labelForm.landlinePhone
                        .tooltip
                    "
                    >{{
                      this.$MISAResource.EmployeeForm.labelForm.landlinePhone
                        .text
                    }}</label
                  >
                  <MISAInput
                    id="textfield__landlinePhone"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="landlinePhone"
                    placeholder=""
                    v-model="this.employee.LandlinePhone"
                    :tabindex="this.$TabIndex.formEmployeeInfo.landlinePhone"
                    ref="input14"
                  ></MISAInput>
                  <!-- <input
                    id="textfield__landlinePhone"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="landlinePhone"
                    placeholder=""
                    :tabindex="this.$TabIndex.formEmployeeInfo.landlinePhone"
                    ref="input14"
                  /> -->
                  <small class="form-message--error"></small>
                </div>
                <div class="info-employee-form-four-email--contact form-group">
                  <label class="textfield__label">{{
                    this.$MISAResource.EmployeeForm.labelForm.email.text
                  }}</label>
                  <MISAInput
                    id="textfield__email"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="email"
                    v-model="this.employee.Email"
                    placeholder="procuon856@example.com"
                    :tabindex="this.$TabIndex.formEmployeeInfo.email"
                    ref="input15"
                  ></MISAInput>
                  <!-- <input
                    id="textfield__email"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="email"
                    v-model="this.employee.Email"
                    placeholder="procuon856@example.com"
                    :tabindex="this.$TabIndex.formEmployeeInfo.email"
                    ref="input15"
                  /> -->
                  <small class="form-message--error"></small>
                </div>
              </div>

              <div class="info-employee-form-four--bank">
                <div class="info-employee-form-four-telephone--bank form-group">
                  <label class="textfield__label">
                    {{
                      this.$MISAResource.EmployeeForm.labelForm.bankAccount.text
                    }}
                  </label>
                  <MISAInput
                    id="textfield__bankAccount"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="bankAccount"
                    placeholder=""
                    :tabindex="this.$TabIndex.formEmployeeInfo.bankAccount"
                    ref="input16"
                  ></MISAInput>
                  <!-- <input
                    id="textfield__bankAccount"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="bankAccount"
                    placeholder=""
                    :tabindex="this.$TabIndex.formEmployeeInfo.bankAccount"
                    ref="input16"
                  /> -->
                  <small class="form-message--error"></small>
                </div>
                <div
                  class="info-employee-form-four-telephoneDefault--bank form-group"
                >
                  <label class="textfield__label">{{
                    this.$MISAResource.EmployeeForm.labelForm.bankName.text
                  }}</label>
                  <MISAInput
                    id="textfield__bankName"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="bankName"
                    placeholder=""
                    @update:modelValue="
                      $emit('update:value', $event.target.value)
                    "
                    :modelValue="
                      this.employee.BankInfo && this.employee.BankInfo.BankName
                    "
                    :tabindex="this.$TabIndex.formEmployeeInfo.bankName"
                    ref="input17"
                  ></MISAInput>
                  <!-- <input
                    id="textfield__bankName"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="bankName"
                    placeholder=""
                    :tabindex="this.$TabIndex.formEmployeeInfo.bankName"
                    ref="input17"
                  /> -->
                  <small class="form-message--error"></small>
                </div>
                <div class="info-employee-form-four-email--bank form-group">
                  <label class="textfield__label">
                    {{ this.$MISAResource.EmployeeForm.labelForm.branch.text }}
                  </label>
                  <MISAInput
                    id="textfield__branch"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="branch"
                    placeholder=""
                    :tabindex="this.$TabIndex.formEmployeeInfo.branch"
                    ref="input18"
                  ></MISAInput>
                  <!-- <input
                    id="textfield__branch"
                    class="textfield__input input-hover input-focus min-width-input"
                    type="text"
                    name="branch"
                    placeholder=""
                    :tabindex="this.$TabIndex.formEmployeeInfo.branch"
                    ref="input18"
                  /> -->
                  <small class="form-message--error"></small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="info-employee-footer">
          <div class="info-employee-footer-btn">
            <MISAButton
              class="info-employee-footer-btn-keep"
              @click.prevent="handleBtnSave"
              :tabindex="this.$TabIndex.formEmployeeInfo.btnSave"
              ref="input19"
              :title="this.$ShortCutResource.BtnSave.tooltip"
            >
              {{ this.$MISAResource.ButtonText.formInfoEmployee.btnSave }}
            </MISAButton>
            <!-- <button
              class="info-employee-footer-btn-keep"
              @click.prevent="handleBtnSave"
              :tabindex="this.$TabIndex.formEmployeeInfo.btnSave"
              ref="input19"
              :title="this.$ShortCutResource.save.tooltip"
            >
              {{ this.$MISAResource.ButtonText.formInfoEmployee.btnSave }}
            </button> -->

            <MISAButton
              id="btnSaveAndAdd"
              class="info-employee-footer-btnKeepAdd btn-hover btn-pressed"
              :tabindex="this.$TabIndex.formEmployeeInfo.saveAndAdd"
              :title="this.$ShortCutResource.BtnSaveAdd.tooltip"
              ref="input20"
              >{{
                this.$MISAResource.ButtonText.formInfoEmployee.btnSaveAdd
              }}</MISAButton
            >
            <!-- <button
              id="btnSaveAndAdd"
              class="info-employee-footer-btnKeepAdd btn-hover btn-pressed"
              :tabindex="this.$TabIndex.formEmployeeInfo.saveAndAdd"
              ref="input20"
            >
              {{ this.$MISAResource.ButtonText.formInfoEmployee.btnSaveAdd }}
            </button> -->
          </div>

          <MISAButton
            class="info-employee-footer-btnCancel"
            @click="handleCloseFormEmployeeInfo"
            :tabindex="this.$TabIndex.formEmployeeInfo.btnCancel"
            ref="input21"
          >
            {{ this.$MISAResource.ButtonText.formInfoEmployee.btnCancel }}
          </MISAButton>
          <!-- <button
            class="info-employee-footer-btnCancel"
            @click="handleCloseFormEmployeeInfo"
            :tabindex="this.$TabIndex.formEmployeeInfo.btnCancel"
            ref="input21"
          >
            {{ this.$MISAResource.ButtonText.formInfoEmployee.btnCancel }}
          </button> -->
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
